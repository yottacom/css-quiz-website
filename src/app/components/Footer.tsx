export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">CSS Quiz</h3>
            <p className="text-sm">
              Comprehensive CSS Computer Science Quiz platform for exam preparation.
              Practice MCQs from past papers (2016-2025).
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/quiz" className="hover:text-blue-400 transition-colors">Quiz Mode</a></li>
              <li><a href="/mcqs" className="hover:text-blue-400 transition-colors">MCQ Bank</a></li>
              <li><a href="/papers" className="hover:text-blue-400 transition-colors">Past Papers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Topics Covered</h4>
            <ul className="space-y-2 text-sm">
              <li>Data Structures & Algorithms</li>
              <li>Operating Systems</li>
              <li>Computer Networks</li>
              <li>Software Engineering</li>
              <li>Database Systems</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} CSS Computer Science Quiz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
