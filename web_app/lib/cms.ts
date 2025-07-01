import { apiPlugin, storyblokInit, getStoryblokApi } from "@storyblok/react/rsc";

export interface StoryblokStory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  content: any;
  created_at: string;
  published_at: string;
  first_published_at: string;
  sort_by_date: string;
  tag_list: string[];
  is_startpage: boolean;
  parent_id: number;
  meta_data: any;
  group_id: string;
  default_root: string;
  translated_slugs: any[];
}

export interface StoryblokResponse<T = any> {
  data: {
    story: StoryblokStory & { content: T };
  };
  perPage: number;
  total: number;
  headers: any;
}

export interface StoryblokStoriesResponse<T = any> {
  data: {
    stories: (StoryblokStory & { content: T })[];
  };
  perPage: number;
  total: number;
  headers: any;
}

// Initialize Storyblok with React 19 support
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN || "demo-token",
  use: [apiPlugin],
  apiOptions: {
    region: "us", // Use 'us' if your space is in the US, otherwise 'eu'
  },
});

// Get Storyblok API instance
const storyblokApi = getStoryblokApi();

export interface CMSClient {
  getStory(slug: string, params?: any): Promise<StoryblokResponse>;
  getStories(params?: any): Promise<StoryblokStoriesResponse>;
  getStoriesByFolder(folder: string, params?: any): Promise<StoryblokStoriesResponse>;
  getGlobalSettings(): Promise<StoryblokResponse>;
}

// Real Storyblok client implementation
export const cmsClient: CMSClient = {
  async getStory(slug: string, params?: any): Promise<StoryblokResponse> {
    try {
      const response = await storyblokApi.get(`cdn/stories/${slug}`, {
        version: process.env.NEXT_PUBLIC_STORYBLOK_VERSION || "published",
        ...params,
      });
      return response;
    } catch (error) {
      console.error("Failed to fetch story:", error);
      throw error;
    }
  },

  async getStories(params?: any): Promise<StoryblokStoriesResponse> {
    try {
      const response = await storyblokApi.get("cdn/stories", {
        version: process.env.NEXT_PUBLIC_STORYBLOK_VERSION || "published",
        ...params,
      });
      return response;
    } catch (error) {
      console.error("Failed to fetch stories:", error);
      throw error;
    }
  },

  async getStoriesByFolder(folder: string, params?: any): Promise<StoryblokStoriesResponse> {
    try {
      const response = await storyblokApi.get("cdn/stories", {
        starts_with: folder,
        version: process.env.NEXT_PUBLIC_STORYBLOK_VERSION || "published",
        ...params,
      });
      return response;
    } catch (error) {
      console.error("Failed to fetch stories by folder:", error);
      throw error;
    }
  },

  async getGlobalSettings(): Promise<StoryblokResponse> {
    try {
      const response = await storyblokApi.get("cdn/stories/global-settings", {
        version: process.env.NEXT_PUBLIC_STORYBLOK_VERSION || "published",
      } as any);
      return response as StoryblokResponse;
    } catch (error) {
      console.error("Failed to fetch global settings:", error);
      throw error;
    }
  },
};

// Export the API instance for use in other parts of the app
export { storyblokApi };

// Re-export getStoryblokApi for client-side initialization
export { getStoryblokApi };

// Mock data for development (fallback when Storyblok is not available)
export const mockStoryblokData = {
  hero: {
    title: "PPL Electric Utilities",
    subtitle: "Powering Pennsylvania's Future with Digital Innovation",
    description: "Leading electric utility serving over 1.4 million customers across 29 counties in Pennsylvania with safe, reliable, and affordable electricity.",
    cta_text: "Learn More",
    cta_link: "/about",
    background_image: "/images/power-lines-sunset.jpg",
  },
  services: [
    {
      id: 1,
      title: "Outage Management",
      description: "Report outages and track restoration progress in real-time",
      icon: "power",
      link: "/outages",
    },
    {
      id: 2,
      title: "Bill Pay & Account",
      description: "Manage your account, view bills, and make payments online",
      icon: "credit-card",
      link: "/account",
    },
    {
      id: 3,
      title: "Energy Efficiency",
      description: "Discover programs to save energy and reduce your electric bill",
      icon: "leaf",
      link: "/energy-programs",
    },
    {
      id: 4,
      title: "Service Requests",
      description: "Start, stop, or transfer electric service at your location",
      icon: "home",
      link: "/service",
    },
  ],
  alerts: [
    {
      id: 1,
      type: "warning" as const,
      title: "Heat Advisory in Effect",
      message: "Take precautions, stay safe and save energy with these tips",
      link: "/safety/heat-advisory",
    },
  ],
};

export const previewModeEnabled = process.env.NEXT_PUBLIC_STORYBLOK_VERSION === "draft";
