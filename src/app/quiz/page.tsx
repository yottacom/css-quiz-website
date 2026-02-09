'use client';

import { useState, useMemo } from 'react';
import mcqsData from './../../../src/data/mcqs.json';
import QuizQuestion from '../components/QuizQuestion';
import Link from 'next/link';

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

export default function QuizPage() {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; mcq: MCQ }[]>([]);

  const years = Array.from(new Set(mcqsData.mcqs.map(m => m.year).filter((y): y is number => y !== undefined))).sort((a, b) => b - a);
  const topics = Array.from(new Set(mcqsData.mcqs.map(m => m.topic).filter((t): t is string => t !== undefined))).sort();

  const filteredMCQs = useMemo(() => {
    let filtered = mcqsData.mcqs as MCQ[];
    if (selectedYear !== 'all') {
      filtered = filtered.filter(m => m.year === parseInt(selectedYear));
    }
    if (selectedTopic !== 'all') {
      filtered = filtered.filter(m => m.topic === selectedTopic);
    }
    // Shuffle for quiz
    return filtered.sort(() => Math.random() - 0.5).slice(0, 20);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedTopic, quizStarted]);

  const handleStartQuiz = () => {
    if (filteredMCQs.length === 0) return;
    setQuizStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    if (!showResult) {
      // Show result first
      const isCorrect = selectedAnswer === filteredMCQs[currentIndex].correctAnswer;
      if (isCorrect) setScore(s => s + 1);
      setAnswers(prev => [...prev, { correct: isCorrect, mcq: filteredMCQs[currentIndex] }]);
      setShowResult(true);
    } else {
      // Move to next question or complete
      if (currentIndex < filteredMCQs.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizCompleted(true);
      }
    }
  };

  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  // Quiz Completed Screen
  if (quizCompleted) {
    const percentage = Math.round((score / filteredMCQs.length) * 100);
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
              percentage >= 70 ? 'bg-green-100' : percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <span className={`text-5xl font-bold ${
                percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {percentage}%
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
            <p className="text-xl text-gray-600 mb-8">
              You scored <span className="font-bold text-blue-600">{score}</span> out of <span className="font-bold">{filteredMCQs.length}</span> questions
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleRestartQuiz}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Try Again
              </button>
              <Link
                href="/mcqs"
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
              >
                Review All MCQs
              </Link>
            </div>

            {/* Review Section */}
            <div className="text-left border-t pt-8">
              <h2 className="text-xl font-bold mb-4">Review Your Answers</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 ${
                      ans.correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                    }`}
                  >
                    <p className="font-medium text-gray-900 mb-1">
                      {idx + 1}. {ans.mcq.question}
                    </p>
                    <p className="text-sm text-gray-600">
                      Correct: {ans.mcq.options[ans.mcq.correctAnswer]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Quiz In Progress
  if (quizStarted && filteredMCQs.length > 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleRestartQuiz}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              ← Exit Quiz
            </button>
            <div className="text-lg font-semibold text-blue-600">
              Score: {score}/{currentIndex + (showResult ? 1 : 0)}
            </div>
          </div>
          
          <QuizQuestion
            mcq={filteredMCQs[currentIndex]}
            currentIndex={currentIndex}
            totalQuestions={filteredMCQs.length}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
            onNext={handleNext}
            showResult={showResult}
          />
        </div>
      </main>
    );
  }

  // Quiz Setup Screen
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Mode</h1>
          <p className="text-xl text-gray-600">
            Test your knowledge with random MCQs from CSS past papers
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Configure Your Quiz</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Topics</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">Available Questions</p>
                <p className="text-gray-600">Based on your filters</p>
              </div>
              <div className="text-4xl font-bold text-blue-600">
                {Math.min(filteredMCQs.length, 20)}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={filteredMCQs.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              filteredMCQs.length > 0
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {filteredMCQs.length > 0 ? 'Start Quiz' : 'No Questions Available'}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <div className="text-2xl font-bold text-blue-600">{mcqsData.mcqs.length}</div>
            <div className="text-sm text-gray-600">Total MCQs</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <div className="text-2xl font-bold text-purple-600">{years.length}</div>
            <div className="text-sm text-gray-600">Years</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <div className="text-2xl font-bold text-green-600">{topics.length}</div>
            <div className="text-sm text-gray-600">Topics</div>
          </div>
        </div>
      </div>
    </main>
  );
}
