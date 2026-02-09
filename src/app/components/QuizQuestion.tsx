'use client';

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

interface QuizQuestionProps {
  mcq: MCQ;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  showResult: boolean;
}

export default function QuizQuestion({
  mcq,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  showResult,
}: QuizQuestionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span className="text-purple-600 font-medium">{mcq.topic}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
        {mcq.question}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {mcq.options.map((option, index) => {
          let optionClass = 'bg-gray-50 border-gray-200 hover:border-blue-400 hover:bg-blue-50';
          
          if (showResult) {
            if (index === mcq.correctAnswer) {
              optionClass = 'bg-green-100 border-green-500 text-green-800';
            } else if (selectedAnswer === index && index !== mcq.correctAnswer) {
              optionClass = 'bg-red-100 border-red-500 text-red-800';
            }
          } else if (selectedAnswer === index) {
            optionClass = 'bg-blue-100 border-blue-500';
          }

          return (
            <button
              key={index}
              onClick={() => !showResult && onSelectAnswer(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${optionClass} ${
                !showResult ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border mr-3 font-semibold">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation (shown after answer) */}
      {showResult && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="font-semibold text-blue-800 mb-1">Explanation:</p>
          <p className="text-gray-700">{mcq.explanation}</p>
        </div>
      )}

      {/* Next Button */}
      {showResult && (
        <button
          onClick={onNext}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg"
        >
          {currentIndex < totalQuestions - 1 ? 'Next Question →' : 'See Results'}
        </button>
      )}

      {!showResult && selectedAnswer !== null && (
        <button
          onClick={onNext}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg"
        >
          Submit Answer
        </button>
      )}
    </div>
  );
}
