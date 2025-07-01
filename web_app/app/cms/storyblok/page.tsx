"use client";

import { useState, useEffect } from "react";
import { getCMSClient } from "@/lib/cms/factory";
import { StoryblokClient } from "@/lib/cms/clients/storyblok";
import { StoryblokStoryRenderer } from "@/components/StoryblokRenderer";

export default function StoryblokPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...");

  useEffect(() => {
    const loadStories = async () => {
      try {
        setConnectionStatus("Loading stories...");
        const client = getCMSClient() as StoryblokClient;
        const storiesResponse = await client.getStories({
          version: "published",
          page: 1,
          perPage: 10,
        });
        setStories(storiesResponse.stories || []);
        setConnectionStatus("✅ Connected successfully");

        // Auto-select the first story (usually the home page)
        if (storiesResponse.stories && storiesResponse.stories.length > 0) {
          setSelectedStory(storiesResponse.stories[0]);
        }
      } catch (error: any) {
        console.error("❌ Failed to load stories:", error);
        setConnectionStatus(`❌ Connection failed: ${error.message}`);
      }
    };

    loadStories();
  }, []);

  const refreshStories = async () => {
    setIsLoading(true);
    try {
      const client = getCMSClient() as StoryblokClient;
      const storiesResponse = await client.getStories({
        version: "published",
        page: 1,
        perPage: 10,
      });
      setStories(storiesResponse.stories || []);
      setConnectionStatus("✅ Stories refreshed successfully");

      // Auto-select first story if none selected
      if (!selectedStory && storiesResponse.stories && storiesResponse.stories.length > 0) {
        setSelectedStory(storiesResponse.stories[0]);
      }
    } catch (error: any) {
      console.error("❌ Failed to refresh stories:", error);
      setConnectionStatus(`❌ Failed to refresh stories: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Storyblok Content</h1>
              <p className="text-gray-600 mt-1">{connectionStatus}</p>
            </div>
            <div className="flex space-x-3">
              <button onClick={refreshStories} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg">
                {isLoading ? "Loading..." : "Refresh"}
              </button>
              <a href="/cms/storyblok/debug" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg inline-block">
                Debug
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Stories ({stories.length})</h2>
              <div className="space-y-2">
                {stories.map((story) => (
                  <button key={story.id} onClick={() => setSelectedStory(story)} className={`w-full text-left p-3 rounded-lg transition-colors ${selectedStory?.id === story.id ? "bg-blue-100 border-blue-300 border" : "bg-gray-50 hover:bg-gray-100 border border-gray-200"}`}>
                    <div className="font-medium text-gray-900">{story.title}</div>
                    <div className="text-sm text-gray-500">{story.slug}</div>
                    <div className="text-xs text-gray-400 mt-1">{story.status}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              {selectedStory ? (
                <div className="p-6">
                  <StoryblokStoryRenderer story={selectedStory} />
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Select a story to view its content</h3>
                  <p className="text-gray-500">Choose a story from the sidebar to see its rich content rendered here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
