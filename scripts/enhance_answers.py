#!/usr/bin/env python3
"""
Enhance each question with detailed answer + explanation via individual API calls.
Async for speed.
"""

import os
import json
import asyncio
import aiohttp

API_KEY = os.environ.get("OPENAI_API_KEY", "")
INPUT_FILE = "/home/yottacom/.openclaw/workspace-yt-business/css-quiz-website/src/data/subjective-questions.json"
OUTPUT_FILE = INPUT_FILE  # Overwrite with enhanced version

API_URL = "https://api.openai.com/v1/chat/completions"
CONCURRENT_LIMIT = 5  # Max concurrent API calls

async def enhance_question(session, semaphore, question, index, total):
    """Call API to get detailed answer + explanation for one question."""
    async with semaphore:
        prompt = f"""You are a CSS Computer Science exam expert. 

Question ({question['year']} Paper {question['paper']} Q{question['questionNumber']}):
{question['question']}

Provide:
1. A DETAILED, COMPLETE answer with full code (if applicable)
2. Step-by-step explanation of the solution

Format your response as JSON:
{{
  "answer": "Complete detailed answer with code in markdown format. Use ```cpp for C++ code blocks.",
  "explanation": "Detailed step-by-step explanation of the concepts and solution approach."
}}

Return ONLY valid JSON. Escape special characters properly."""

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-4o",
            "messages": [
                {"role": "system", "content": "You are an expert CS professor. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
            "max_tokens": 2000
        }
        
        for attempt in range(3):
            try:
                async with session.post(API_URL, headers=headers, json=payload, 
                                        timeout=aiohttp.ClientTimeout(total=120)) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        content = data["choices"][0]["message"]["content"]
                        
                        # Parse JSON
                        content = content.strip()
                        if content.startswith('```'):
                            content = content.split('\n', 1)[1]
                            content = content.rsplit('```', 1)[0]
                        
                        start = content.find('{')
                        end = content.rfind('}') + 1
                        if start >= 0 and end > start:
                            result = json.loads(content[start:end])
                            question['answer'] = result.get('answer', question['answer'])
                            question['explanation'] = result.get('explanation', '')
                            print(f"✓ {index+1}/{total} - {question['id']}")
                            return question
                    
                    elif resp.status == 429:
                        print(f"⏳ Rate limited, waiting... ({question['id']})")
                        await asyncio.sleep(20)
                    else:
                        print(f"✗ API error {resp.status} for {question['id']}")
                        
            except json.JSONDecodeError:
                print(f"✗ JSON error for {question['id']}, retry {attempt+1}")
            except Exception as e:
                print(f"✗ Error for {question['id']}: {str(e)[:50]}")
            
            await asyncio.sleep(2)
        
        # Keep original if all retries failed
        print(f"⚠ Keeping original for {question['id']}")
        return question

async def main():
    print("="*60)
    print("Enhancing answers with detailed solutions + explanations")
    print("="*60)
    
    # Load existing questions
    with open(INPUT_FILE) as f:
        data = json.load(f)
    
    questions = data['questions']
    total = len(questions)
    print(f"\n📝 {total} questions to enhance\n")
    
    # Process with concurrency limit
    semaphore = asyncio.Semaphore(CONCURRENT_LIMIT)
    connector = aiohttp.TCPConnector(limit=CONCURRENT_LIMIT)
    
    async with aiohttp.ClientSession(connector=connector) as session:
        tasks = [
            enhance_question(session, semaphore, q, i, total) 
            for i, q in enumerate(questions)
        ]
        enhanced = await asyncio.gather(*tasks)
    
    # Update data
    data['questions'] = enhanced
    data['metadata']['enhanced'] = True
    data['metadata']['hasExplanations'] = True
    
    # Save
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*60}")
    print(f"✅ Enhanced {total} questions with detailed answers")
    print(f"✅ Saved to {OUTPUT_FILE}")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(main())
