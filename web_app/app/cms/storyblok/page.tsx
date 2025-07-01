"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCMS } from "../../../lib/cms/hooks/useCMS";
import { BaseCMSEntry } from "../../../lib/cms/config";
import { debugCMSConfig } from "../../../lib/cms/debug";

export default function StoryblokPage() {
  const { client, isLoading: clientLoading } = useCMS();
  const [stories, setStories] = useState<BaseCMSEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const info = debugCMSConfig();
    setDebugInfo(info);
    console.log("🔧 Storyblok Debug Info:", info);
  }, []);

  useEffect(() => {
    const testConnection = async () => {
      if (!client || clientLoading) return;

      try {
        setIsLoading(true);
        setConnectionStatus("connecting");

        const response = await client.getStories({
          perPage: 5,
          contentType: "page",
        });

        setStories(response.stories || []);
        setConnectionStatus("connected");
        setError(null);
      } catch (err) {
        console.error("Storyblok connection error:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to connect to Storyblok";
        setError(errorMessage);
        setConnectionStatus("error");
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();
  }, [client, clientLoading]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "green";
      case "error":
        return "red";
      case "connecting":
        return "yellow";
      default:
        return "gray";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected Successfully";
      case "error":
        return "Connection Failed";
      case "connecting":
        return "Connecting...";
      default:
        return "Checking Connection";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/cms" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to CMS Options
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Storyblok Integration</h1>
              <p className="text-lg text-gray-600">Visual editor with component-based architecture</p>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  connectionStatus === "connected" ? "bg-green-100 text-green-800" : connectionStatus === "error" ? "bg-red-100 text-red-800" : connectionStatus === "connecting" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"
                }`}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${connectionStatus === "connected" ? "bg-green-500" : connectionStatus === "error" ? "bg-red-500" : connectionStatus === "connecting" ? "bg-yellow-500 animate-pulse" : "bg-gray-500"}`}></div>
                {getStatusText()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content from Storyblok</h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading content...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-red-800 font-medium">Connection Error</h3>
                  </div>
                  <p className="text-red-700 mt-2">{error}</p>
                  <div className="mt-4 text-sm text-red-600">
                    <p>Check your environment variables:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN</li>
                      <li>STORYBLOK_SPACE_ID</li>
                    </ul>
                  </div>
                </div>
              ) : stories.length > 0 ? (
                <div className="space-y-4">
                  {stories.map((story) => (
                    <div key={story.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{story.title}</h3>
                          <p className="text-sm text-gray-600">/{story.slug}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${story.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{story.status}</span>
                          <p className="text-xs text-gray-500 mt-1">Updated: {new Date(story.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Found</h3>
                  <p className="text-gray-600">Create your first story in Storyblok to see it here.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Space ID</label>
                  <p className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">{process.env.STORYBLOK_SPACE_ID || "285494041849876"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Access Token</label>
                  <p className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN ? "••••••••••••••••" : "Not configured"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">API Version</label>
                  <p className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">v2</p>
                </div>
                {debugInfo && (
                  <div className="pt-3 border-t">
                    <label className="text-sm font-medium text-gray-700">Debug Status</label>
                    <div className={`text-sm px-2 py-1 rounded flex items-center ${debugInfo.debug.storyblok.configured ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${debugInfo.debug.storyblok.configured ? "bg-green-500" : "bg-red-500"}`}></div>
                      {debugInfo.debug.storyblok.configured ? "Configuration Valid" : "Missing Access Token"}
                    </div>
                    {debugInfo.debug.storyblok.configured && <p className="text-xs text-gray-500 mt-1">Token length: {debugInfo.debug.storyblok.accessTokenLength} chars</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2">
                {["Visual Editor", "Component Library", "Multi-language Support", "Asset Management", "Real-time Preview", "Webhook Integration"].map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="https://app.storyblok.com/" target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors">
                  Open Storyblok Studio
                </a>
                <button onClick={() => window.location.reload()} className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-md text-sm font-medium transition-colors">
                  Refresh Content
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
