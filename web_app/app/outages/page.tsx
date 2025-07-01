import Link from "next/link";

export default function OutagesPage() {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Outage Management</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Report outages, track restoration progress, and get real-time updates on power restoration in your area.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Report an Outage</h2>
              <p className="text-gray-600">Let us know about power outages in your area</p>
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">Report Outage</button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">View Outage Map</h2>
              <p className="text-gray-600">Check current outages and restoration progress</p>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">View Map</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Service Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
              <div className="text-sm text-green-700">System Reliability</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
              <div className="text-sm text-blue-700">Active Outages</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">847</div>
              <div className="text-sm text-orange-700">Customers Affected</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
