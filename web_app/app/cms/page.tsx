"use client";

import Link from "next/link";

const CMS_OPTIONS = [
  {
    name: "Storyblok",
    description: "Visual editor with component-based architecture. Perfect for marketing teams.",
    status: "Connected",
    features: ["Visual Editor", "Component Library", "Multi-language", "Asset Management"],
    color: "blue",
    link: "/cms/storyblok",
  },
  {
    name: "Sanity",
    description: "Structured content platform with powerful GROQ queries and real-time collaboration.",
    status: "Available",
    features: ["GROQ Queries", "Real-time Collaboration", "Asset Pipeline", "Custom Schemas"],
    color: "red",
    link: "/cms/sanity",
  },
  {
    name: "Contentful",
    description: "API-first CMS with powerful content modeling and delivery optimization.",
    status: "Available",
    features: ["Rich API", "Content Modeling", "CDN Delivery", "Webhooks"],
    color: "blue",
    link: "/cms/contentful",
  },
];

export default function CMSPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Content Management Systems</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Choose from our integrated headless CMS providers. Each system offers unique advantages for content management and delivery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {CMS_OPTIONS.map((cms) => (
            <Link key={cms.name} href={cms.link}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{cms.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${cms.status === "Connected" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{cms.status}</span>
                </div>

                <p className="text-gray-600 mb-4">{cms.description}</p>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Features:</h4>
                  <ul className="space-y-1">
                    {cms.features.map((feature) => (
                      <li key={feature} className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-blue-600 hover:text-blue-700">
                    <span className="text-sm font-medium">Explore {cms.name}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">CMS Integration Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Storyblok</h3>
              <p className="text-green-600 text-sm">Active & Connected</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Sanity</h3>
              <p className="text-yellow-600 text-sm">Ready to Configure</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Contentful</h3>
              <p className="text-blue-600 text-sm">Ready to Configure</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
