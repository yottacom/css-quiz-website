'use client';

import { useState } from 'react';
import papersData from './../../../src/data/papers.json';
import mcqsData from './../../../src/data/mcqs.json';
import MCQCard from '../components/MCQCard';

interface Paper {
  id: string;
  title: string;
  year: number;
  mcqCount: number;
  descriptiveCount: number;
}

interface MCQ {
  id: number;
  year: number;
  paper: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: string;
}

export default function PapersPage() {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

  const getPaperMCQs = (paper: Paper): MCQ[] => {
    const paperNum = paper.id.includes('paper-1') ? 1 : 2;
    return (mcqsData.mcqs as MCQ[]).filter(
      m => m.year === paper.year && m.paper === paperNum
    );
  };

  if (selectedPaper) {
    const paperMCQs = getPaperMCQs(selectedPaper);
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setSelectedPaper(null)}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Papers
          </button>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <h1 className="text-3xl font-bold mb-2">{selectedPaper.title}</h1>
            <p className="text-blue-100 text-lg">Year: {selectedPaper.year}</p>
            <div className="flex gap-6 mt-4">
              <div>
                <span className="text-3xl font-bold">{paperMCQs.length}</span>
                <span className="text-blue-200 ml-2">MCQs Available</span>
              </div>
            </div>
          </div>

          {paperMCQs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {paperMCQs.map((mcq) => (
                <MCQCard key={mcq.id} mcq={mcq} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl text-gray-600">MCQs for this paper are not yet available</p>
              <p className="text-gray-500 mt-2">Check back later for updates</p>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Past Papers</h1>
          <p className="text-xl text-gray-600">
            Browse CSS Computer Science papers from 2016 to 2025
          </p>
        </div>

        <div className="space-y-8">
          {papersData.papers.sort((a, b) => b.year - a.year).map((yearData) => (
            <div key={yearData.year} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">{yearData.year}</h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {yearData.papers.map((paper) => {
                    const paperMCQs = getPaperMCQs(paper);
                    return (
                      <button
                        key={paper.id}
                        onClick={() => setSelectedPaper(paper)}
                        className="text-left p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {paper.title}
                            </h3>
                            <div className="flex gap-4 mt-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {paperMCQs.length} MCQs
                              </span>
                            </div>
                          </div>
                          <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
