'use client';

import { useState } from 'react';

interface MCQ {
  id: string | number;
  year?: number;
  paper?: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty?: string;
}

interface MCQCardProps {
  mcq: MCQ;
  showAnswer?: boolean;
}

export default function MCQCard({ mcq, showAnswer = false }: MCQCardProps) {
  const [revealed, setRevealed] = useState(showAnswer);

  const difficultyColors: Record<string, string> = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {mcq.year && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {mcq.year}
          </span>
        )}
        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
          {mcq.topic}
        </span>
        {mcq.difficulty && (
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${difficultyColors[mcq.difficulty] || 'bg-gray-100 text-gray-800'}`}>
            {mcq.difficulty}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Q{mcq.id}. {mcq.question}
      </h3>

      <div className="space-y-2 mb-4">
        {mcq.options.map((option, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              revealed && index === mcq.correctAnswer
                ? 'bg-green-50 border-green-500 text-green-800'
                : 'bg-gray-50 border-gray-200 text-gray-800'
            }`}
          >
            <span className="font-medium mr-2 text-gray-900">{String.fromCharCode(65 + index)}.</span>
            <span className="text-gray-800">{option}</span>
          </div>
        ))}
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
        >
          Show Answer
        </button>
      ) : (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold text-blue-800 mb-1">
            Correct Answer: {String.fromCharCode(65 + mcq.correctAnswer)}
          </p>
          <p className="text-sm text-gray-700">{mcq.explanation}</p>
        </div>
      )}
    </div>
  );
}
