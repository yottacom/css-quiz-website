import Link from 'next/link';
import mcqsData from './../../src/data/mcqs.json';
import papersData from './../../src/data/papers.json';

export default function Home() {
  const totalMCQs = mcqsData.mcqs.length;
  const years = Array.from(new Set(mcqsData.mcqs.map(m => m.year))).sort();
  const topics = Array.from(new Set(mcqsData.mcqs.map(m => m.topic)));
  const totalPapers = papersData.papers.reduce((acc, y) => acc + y.papers.length, 0);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            CSS Computer Science Quiz
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Master CSS exam preparation with our comprehensive MCQ collection from past papers (2016-2025)
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start Quiz →
            </Link>
            <Link
              href="/mcqs"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Browse MCQs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalMCQs}</div>
              <div className="text-gray-600">Total MCQs</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{years.length}</div>
              <div className="text-gray-600">Years Covered</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{totalPapers}</div>
              <div className="text-gray-600">Past Papers</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">{topics.length}</div>
              <div className="text-gray-600">Topics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quiz Mode</h3>
              <p className="text-gray-600">
                Test your knowledge with timed quizzes. Filter by year and topic for focused practice.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">MCQ Bank</h3>
              <p className="text-gray-600">
                Browse all MCQs with detailed explanations. Learn at your own pace.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Past Papers</h3>
              <p className="text-gray-600">
                Access complete past papers organized by year for comprehensive exam prep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Topics Covered
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {topics.map((topic) => (
              <span
                key={topic}
                className="px-4 py-2 bg-white rounded-full shadow-md text-gray-700 font-medium hover:shadow-lg transition-shadow"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start practicing now with our comprehensive question bank
          </p>
          <Link
            href="/quiz"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Quiz Now
          </Link>
        </div>
      </section>
    </main>
  );
}
