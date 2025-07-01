import { getStoryblokApi } from "@/lib/storyblok";
import { StoryblokStory } from "@storyblok/react/rsc";

export default async function StoryblokTestPage() {
  const { data } = await fetchData();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Storyblok Connection Test</h1>

        {data?.story ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-4">✅ Connected to Storyblok!</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>
                <strong>Story Name:</strong> {data.story.name}
              </p>
              <p>
                <strong>Story Slug:</strong> {data.story.slug}
              </p>
              <p>
                <strong>Story ID:</strong> {data.story.id}
              </p>
              <p>
                <strong>Published At:</strong> {data.story.published_at}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Story Content:</h3>
              <StoryblokStory story={data.story} />
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">❌ Connection Failed</h2>
            <p>Could not fetch the home story from Storyblok. Please check:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-red-700">
              <li>Your access token is correct</li>
              <li>You have a 'home' story in your Storyblok space</li>
              <li>Your environment variables are properly set</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export async function fetchData() {
  try {
    const storyblokApi = getStoryblokApi();
    return await storyblokApi.get(`cdn/stories/home`, { version: "draft" });
  } catch (error) {
    console.error("Storyblok fetch error:", error);
    return { data: null };
  }
}
