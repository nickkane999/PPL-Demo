"use client";

import { useState, useEffect } from "react";
import { getCMSClient } from "@/lib/cms/factory";
import { StoryblokClient } from "@/lib/cms/clients/storyblok";

export default function StoryblokPage() {
  const [config, setConfig] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [connectionTest, setConnectionTest] = useState<string>("Not tested");
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      console.log("🔧 Getting CMS client and debug info...");
      const client = getCMSClient() as StoryblokClient;
      const cmsConfig = client.getConfig();
      const cmsDebugInfo = client.getDebugInfo();

      setConfig(cmsConfig);
      setDebugInfo(cmsDebugInfo);

      console.log("🔧 Storyblok Debug Info:", { config: cmsConfig, debug: cmsDebugInfo });

      // Run basic connection test
      const testConnection = async () => {
        try {
          console.log("🧪 Testing basic connection...");
          const storiesResponse = await client.getStories({
            version: "published",
            page: 1,
            perPage: 10,
          });
          console.log("✅ Basic connection successful:", storiesResponse);
          setConnectionTest("✅ Connected successfully");
          setStories(storiesResponse.stories || []);
        } catch (error: any) {
          console.error("❌ Basic connection failed:", error);
          setConnectionTest(`❌ Connection failed: ${error.message}`);
        }
      };

      testConnection();
    } catch (error: any) {
      console.error("💥 Failed to initialize:", error);
      setConnectionTest(`💥 Failed to initialize: ${error.message}`);
    }
  }, []);

  const loadStories = async () => {
    setIsLoading(true);
    try {
      const client = getCMSClient() as StoryblokClient;
      const storiesResponse = await client.getStories({
        version: "published",
        page: 1,
        perPage: 10,
      });
      setStories(storiesResponse.stories || []);
      setConnectionTest("✅ Stories loaded successfully");
    } catch (error: any) {
      console.error("❌ Failed to load stories:", error);
      setConnectionTest(`❌ Failed to load stories: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Storyblok CMS Integration</h1>

          {/* Connection Status */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Connection Status</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-lg">{connectionTest}</p>
            </div>
          </div>

          {/* Configuration */}
          {config && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>CMS Provider:</strong> {config.provider}
                  </p>
                  <p>
                    <strong>Region:</strong> {config.storyblok?.region || "us"}
                  </p>
                  <p>
                    <strong>Space ID:</strong> {config.storyblok?.spaceId}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Access Token:</strong> {config.storyblok?.accessToken ? `${config.storyblok.accessToken.substring(0, 8)}...` : "Not set"}
                  </p>
                  <p>
                    <strong>Version:</strong> {config.storyblok?.version || "published"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mb-6">
            <button onClick={loadStories} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg mr-4">
              {isLoading ? "Loading..." : "Load Stories"}
            </button>
            <a href="/cms/storyblok/debug" className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg inline-block">
              Advanced Diagnostics
            </a>
          </div>

          {/* Stories */}
          {stories.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Stories ({stories.length})</h2>
              <div className="space-y-4">
                {stories.map((story) => (
                  <div key={story.id} className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-lg">{story.title}</h3>
                    <p className="text-gray-600">Slug: {story.slug}</p>
                    <p className="text-gray-600">Status: {story.status}</p>
                    <p className="text-gray-600">Updated: {new Date(story.updatedAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debug Information */}
          {debugInfo && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Debug Information</h2>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}

          {/* Help */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h3 className="font-semibold text-blue-800 mb-2">🔧 Troubleshooting</h3>
            <p className="text-blue-700 mb-2">If you're having connection issues:</p>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Check that your tokens are Content Delivery API tokens (not Management API)</li>
              <li>Ensure your space has published content</li>
              <li>Try the Advanced Diagnostics for detailed testing</li>
              <li>
                Your working URL format: <code>https://api.storyblok.com/v2/cdn/stories?token=...</code>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
