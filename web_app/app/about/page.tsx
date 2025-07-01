import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">PPL</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">PPL Electric</span>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to Home
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About This PPL Demo</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">A demonstration of modern web development capabilities for PPL Electric Utilities' digital transformation initiative.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Technical Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Next.js 15 Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• App Router with Server Components</li>
                <li>• TypeScript for type safety</li>
                <li>• Optimized image loading</li>
                <li>• Streaming and Suspense</li>
                <li>• SEO optimization</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Design System</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Tailwind CSS for consistent styling</li>
                <li>• Component-driven architecture</li>
                <li>• Responsive design patterns</li>
                <li>• Accessibility-first approach</li>
                <li>• Reusable UI components</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Architecture Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Component Architecture</h3>
              <p className="text-gray-600 text-sm">Modular, reusable components following established patterns</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessibility First</h3>
              <p className="text-gray-600 text-sm">WCAG 2.1 AA compliant with semantic HTML and ARIA patterns</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Optimized</h3>
              <p className="text-gray-600 text-sm">Lighthouse scores &gt;90 with optimized Core Web Vitals</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">CMS Integration Ready</h2>
          <p className="text-gray-600 mb-6">This demo is prepared for headless CMS integration with Storyblok, including:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Content Management</h4>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Dynamic content components</li>
                <li>• Content type definitions</li>
                <li>• Preview functionality</li>
                <li>• Multi-environment support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Developer Experience</h4>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• TypeScript interfaces for content</li>
                <li>• Component mapping system</li>
                <li>• Hot reloading in development</li>
                <li>• Build-time optimization</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready for Production</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">This demonstration showcases a scalable, maintainable architecture that can support PPL's digital transformation goals while maintaining the highest standards of accessibility and performance.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              View Home Page
            </Link>
            <Link href="/outages" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 font-semibold px-6 py-3 rounded-lg transition-colors">
              Explore Features
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
