'use client';

import { useState } from 'react';
import subjectiveData from '../../../src/data/subjective-questions.json';

export default function SubjectivePage() {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const years = Array.from(new Set(subjectiveData.questions.map(q => q.year))).sort((a, b) => b - a);

  const filteredQuestions = selectedYear === 'all'
    ? subjectiveData.questions
    : subjectiveData.questions.filter(q => q.year === selectedYear);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subjective Questions - Solved</h1>
          <p className="text-gray-600">
            Complete solutions to CSS Computer Science past paper subjective questions
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="ml-auto text-gray-600">
            Showing {filteredQuestions.length} questions
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div
                className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {question.year}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        Paper {question.paper}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Q.{question.questionNumber} - Section {question.section}
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                        {question.marks} marks
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Question {question.questionNumber} ({question.parts.length} parts)
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-500 transform transition-transform ${expandedQuestion === question.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expandedQuestion === question.id && (
                <div className="border-t border-gray-200">
                  {question.parts.map((part, idx) => (
                    <div key={idx} className="p-6 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {part.part}
                        </span>
                        <span className="text-sm text-gray-500">({part.marks} marks)</span>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Question:</h4>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                          {part.question}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Solution:
                        </h4>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div 
                            className="prose prose-sm max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ 
                              __html: part.answer
                                .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-2"><code>$2</code></pre>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n/g, '<br/>')
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
