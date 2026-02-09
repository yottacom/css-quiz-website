#!/usr/bin/env python3
"""
Extract questions from CSS Computer Science papers and generate solutions using OpenAI GPT.
Improved version with better JSON handling and retries.
"""

import os
import json
import re
import asyncio
import aiohttp
from pathlib import Path
import PyPDF2

# Config
API_KEY = os.environ.get("OPENAI_API_KEY", "")
PAPERS_DIR = Path("/home/yottacom/.openclaw/workspace-yt-business/CSS-Computer-Science-Papers")
OUTPUT_FILE = Path("/home/yottacom/.openclaw/workspace-yt-business/css-quiz-website/src/data/subjective-questions.json")

API_URL = "https://api.openai.com/v1/chat/completions"

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file."""
    text = ""
    try:
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
    return text

def get_papers():
    """Get all PDF papers with year and paper number."""
    papers = []
    seen = set()
    
    for year_dir in PAPERS_DIR.iterdir():
        if year_dir.is_dir() and year_dir.name.isdigit():
            year = int(year_dir.name)
            for pdf_file in year_dir.glob("*.pdf"):
                name = pdf_file.stem.lower()
                if "combined" in name or "mcq" in name:
                    continue
                
                paper_num = 2 if any(x in name for x in ["paper-2", "paper_2", "p2", "-2-"]) else 1
                key = f"{year}-{paper_num}"
                
                if key not in seen:
                    text = extract_text_from_pdf(pdf_file)
                    if len(text) > 500:
                        papers.append({"path": pdf_file, "year": year, "paper": paper_num, "text": text})
                        seen.add(key)
    
    return sorted(papers, key=lambda x: (x['year'], x['paper']))

def fix_json(text):
    """Try to fix common JSON issues."""
    # Remove markdown code blocks
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*$', '', text)
    
    # Find JSON object
    start = text.find('{')
    end = text.rfind('}')
    if start >= 0 and end > start:
        text = text[start:end+1]
    
    # Fix common issues
    text = text.replace('\n', '\\n')
    text = text.replace('\t', '\\t')
    text = re.sub(r'(?<!\\)"([^"]*?)(?<!\\)"', lambda m: '"' + m.group(1).replace('"', '\\"') + '"', text)
    
    return text

async def call_openai(session, prompt, retries=3):
    """Call OpenAI API with retries."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    for attempt in range(retries):
        payload = {
            "model": "gpt-4o",
            "messages": [
                {"role": "system", "content": "You are an expert CS professor. Return ONLY valid JSON. No markdown, no explanation. Escape all special characters in strings properly."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 4096
        }
        
        try:
            async with session.post(API_URL, headers=headers, json=payload, timeout=aiohttp.ClientTimeout(total=180)) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return data["choices"][0]["message"]["content"]
                elif resp.status == 429:
                    print(f"   Rate limited, waiting...")
                    await asyncio.sleep(30)
                else:
                    error = await resp.text()
                    print(f"   API Error {resp.status}")
        except Exception as e:
            print(f"   Request error: {e}")
        
        await asyncio.sleep(5)
    
    return None

async def process_paper(session, paper):
    """Extract and solve questions from a paper."""
    print(f"\n📄 {paper['year']} Paper {paper['paper']}...")
    
    # Simplified prompt for cleaner JSON
    prompt = f"""Extract subjective questions Q2-Q8 from this CSS Computer Science {paper['year']} Paper {paper['paper']}.

Return ONLY this JSON structure (no other text):
{{"questions":[{{"q":2,"m":20,"text":"question text","answer":"solution with code"}}]}}

Keep answers concise. Use \\n for newlines in strings. Escape quotes.

Paper:
{paper['text'][:12000]}"""
    
    response = await call_openai(session, prompt)
    
    if not response:
        return []
    
    # Try to parse JSON
    try:
        # Clean response
        response = response.strip()
        if response.startswith('```'):
            response = re.sub(r'^```\w*\n?', '', response)
            response = re.sub(r'\n?```$', '', response)
        
        data = json.loads(response)
        
        results = []
        for q in data.get('questions', []):
            question_data = {
                "id": f"{paper['year']}-P{paper['paper']}-Q{q.get('q', 0)}",
                "year": paper['year'],
                "paper": paper['paper'],
                "questionNumber": q.get('q', 0),
                "marks": q.get('m', 20),
                "question": q.get('text', ''),
                "answer": q.get('answer', '')
            }
            results.append(question_data)
        
        print(f"   ✓ {len(results)} questions")
        return results
        
    except json.JSONDecodeError as e:
        print(f"   ✗ JSON error: {str(e)[:50]}")
        
        # Try manual extraction
        try:
            questions = re.findall(r'"q":\s*(\d+).*?"text":\s*"([^"]+)".*?"answer":\s*"([^"]+)"', response, re.DOTALL)
            if questions:
                results = []
                for q, text, answer in questions:
                    results.append({
                        "id": f"{paper['year']}-P{paper['paper']}-Q{q}",
                        "year": paper['year'],
                        "paper": paper['paper'],
                        "questionNumber": int(q),
                        "marks": 20,
                        "question": text,
                        "answer": answer
                    })
                print(f"   ✓ {len(results)} questions (regex)")
                return results
        except:
            pass
    
    return []

async def main():
    print("="*60)
    print("CSS CS Question Extractor - GPT-4o")
    print("="*60)
    
    papers = get_papers()
    print(f"\n📚 {len(papers)} papers found")
    
    all_questions = []
    
    connector = aiohttp.TCPConnector(limit=2)
    async with aiohttp.ClientSession(connector=connector) as session:
        for i in range(0, len(papers), 2):
            batch = papers[i:i+2]
            tasks = [process_paper(session, p) for p in batch]
            results = await asyncio.gather(*tasks)
            
            for r in results:
                all_questions.extend(r)
            
            if i + 2 < len(papers):
                await asyncio.sleep(3)
    
    all_questions.sort(key=lambda x: (x['year'], x['paper'], x['questionNumber']))
    
    output = {
        "metadata": {
            "title": "CSS Computer Science - Subjective Questions",
            "totalQuestions": len(all_questions),
            "years": sorted(list(set(q['year'] for q in all_questions)))
        },
        "questions": all_questions
    }
    
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*60}")
    print(f"✅ {len(all_questions)} questions saved")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(main())
