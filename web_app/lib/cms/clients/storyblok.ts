import { apiPlugin, storyblokInit, getStoryblokApi } from "@storyblok/react/rsc";
import { UnifiedCMSClient, CMSResponse, CMSStoriesResponse, BaseCMSEntry, CMSQueryParams, CMSImage, StoryblokConfig } from "../config";

export class StoryblokClient implements UnifiedCMSClient {
  provider: "storyblok" = "storyblok";
  private api: any;
  private config: StoryblokConfig;
  private isInitialized = false;

  constructor(config: StoryblokConfig) {
    this.config = config;
    this.initializeClient();
  }

  private initializeClient() {
    if (!this.isInitialized) {
      console.log("🚀 Initializing Storyblok client with config:", {
        accessTokenLength: this.config.accessToken?.length,
        region: this.config.region,
        version: this.config.version,
        spaceId: this.config.spaceId,
      });

      // Create custom API client that directly uses your working URL pattern
      // Working URL: https://api.storyblok.com/v2/cdn/stories?token=...
      this.api = {
        baseURL: "https://api.storyblok.com/v2",
        get: async (endpoint: string, params: any = {}) => {
          const searchParams = new URLSearchParams();

          // Add all params to URL
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          });

          // Always add token
          searchParams.append("token", this.config.accessToken!);

          const url = `${this.api.baseURL}/${endpoint}?${searchParams.toString()}`;
          console.log("🚀 Direct API request to:", url);

          const response = await fetch(url);

          if (!response.ok) {
            const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
            (error as any).status = response.status;
            (error as any).response = { status: response.status, statusText: response.statusText };
            throw error;
          }

          const data = await response.json();
          return {
            data,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            total: data.total,
            config: { url },
          };
        },
      };

      this.isInitialized = true;
      console.log("✅ Custom Storyblok client initialized - using main endpoint directly");
      console.log("🔧 API instance config:", {
        baseURL: this.api?.baseURL,
        customImplementation: true,
        workingUrlPattern: "https://api.storyblok.com/v2/cdn/stories?token=...",
      });
    }
  }

  private transformStoryblokEntry(story: any): BaseCMSEntry {
    return {
      id: story.id.toString(),
      slug: story.slug,
      title: story.name || story.content?.title || story.slug,
      content: story.content,
      createdAt: story.created_at,
      updatedAt: story.published_at || story.created_at,
      publishedAt: story.published_at,
      status: story.published_at ? "published" : "draft",
      tags: story.tag_list || [],
    };
  }

  async getStory(slug: string, params?: CMSQueryParams): Promise<CMSResponse<BaseCMSEntry>> {
    try {
      const response = await this.api.get(`cdn/stories/${slug}`, {
        version: params?.version || this.config.version || "published",
        ...params,
      });

      return {
        data: this.transformStoryblokEntry(response.data.story),
        meta: {
          cv: response.data.cv,
          rels: response.data.rels,
          links: response.data.links,
        },
      };
    } catch (error) {
      console.error("Storyblok getStory error:", error);
      throw new Error(`Failed to fetch story: ${slug}`);
    }
  }

  async getStories(params?: CMSQueryParams): Promise<CMSStoriesResponse<BaseCMSEntry>> {
    try {
      // Only use Storyblok-compatible parameter names (avoid conflicts)
      const apiParams: Record<string, any> = {
        version: params?.version || this.config.version || "published",
        page: params?.page || 1,
        per_page: params?.perPage || 10, // Use per_page, not perPage
      };

      // Add optional parameters only if they exist (avoid undefined values)
      if (params?.startsWith) {
        apiParams.starts_with = params.startsWith;
      }
      if (params?.tags?.length) {
        apiParams.with_tag = params.tags.join(",");
      }
      if (params?.sortBy) {
        apiParams.sort_by = params.sortBy;
      }

      // Add any additional CV (cache version) parameter if present
      if (params?.cv) {
        apiParams.cv = params.cv;
      }

      // Always use main API endpoint (matches your working URL format)
      const baseUrl = "https://api.storyblok.com/v2/cdn";

      console.log("📡 Storyblok API request:", {
        endpoint: "cdn/stories",
        params: apiParams,
        accessTokenPresent: !!this.config.accessToken,
        accessTokenLength: this.config.accessToken?.length,
        spaceId: this.config.spaceId,
        baseUrl: baseUrl,
        note: "Using main endpoint to match your working URL",
        actualApiInstance: this.api?.constructor?.name || "unknown",
      });

      // Log the actual request being made
      console.log("🔍 Making API request to:", `${this.api.baseURL || "unknown"}/cdn/stories`);

      const response = await this.api.get("cdn/stories", apiParams);

      console.log("✅ Storyblok API response:", {
        storiesCount: response.data.stories?.length || 0,
        total: response.total,
        headers: response.headers,
        status: response.status,
        actualUrl: response.config?.url || response.request?.responseURL || "unknown",
      });

      const stories = response.data.stories.map(this.transformStoryblokEntry);
      const total = response.total || stories.length;
      const perPage = params?.perPage || 25;
      const currentPage = params?.page || 1;

      return {
        stories,
        total,
        pagination: {
          page: currentPage,
          perPage,
          total,
          hasNext: currentPage * perPage < total,
          hasPrev: currentPage > 1,
        },
      };
    } catch (error: any) {
      console.error("❌ Storyblok getStories error:", error);
      console.error("Error details:", {
        message: error.message || "Unknown error",
        status: error.status || error.response?.status,
        statusText: error.statusText || error.response?.statusText || "",
        data: error.response?.data || {},
        url: error.config?.url || error.request?.responseURL || "unknown",
        baseURL: this.api?.baseURL || "unknown",
        config: {
          accessTokenLength: this.config.accessToken?.length,
          spaceId: this.config.spaceId,
          version: this.config.version,
          region: this.config.region,
        },
      });

      // Check for specific error types
      if (error.status === 401 || error.response?.status === 401) {
        console.error("🚫 401 Unauthorized - Possible causes:");
        console.error("   • Token might be invalid or expired");
        console.error("   • Token might not have access to this space");
        console.error("   • Space might be in a different region");
        console.error("   • Token might be a Management API token instead of Content Delivery API");
      }

      throw new Error("Failed to fetch stories");
    }
  }

  async getStoriesByType(contentType: string, params?: CMSQueryParams): Promise<CMSStoriesResponse<BaseCMSEntry>> {
    return this.getStories({
      ...params,
      filter_query: {
        component: {
          in: contentType,
        },
      },
    });
  }

  async getStoriesByFolder(folder: string, params?: CMSQueryParams): Promise<CMSStoriesResponse<BaseCMSEntry>> {
    return this.getStories({
      ...params,
      startsWith: folder,
    });
  }

  async getGlobalSettings(): Promise<CMSResponse<any>> {
    try {
      const response = await this.api.get("cdn/stories/global-settings", {
        version: this.config.version || "published",
      } as any);

      return {
        data: response.data.story.content,
        meta: { cv: response.data.cv },
      } as CMSResponse<any>;
    } catch (error) {
      console.error("Storyblok getGlobalSettings error:", error);
      return { data: {} };
    }
  }

  async getNavigation(): Promise<CMSResponse<any>> {
    try {
      const response = await this.api.get("cdn/stories/navigation", {
        version: this.config.version || "published",
      });

      return {
        data: response.data.story.content,
        meta: { cv: response.data.cv },
      };
    } catch (error) {
      console.error("Storyblok getNavigation error:", error);
      return { data: { items: [] } };
    }
  }

  async getFooter(): Promise<CMSResponse<any>> {
    try {
      const response = await this.api.get("cdn/stories/footer", {
        version: this.config.version || "published",
      });

      return {
        data: response.data.story.content,
        meta: { cv: response.data.cv },
      };
    } catch (error) {
      console.error("Storyblok getFooter error:", error);
      return { data: {} };
    }
  }

  async getAssets(params?: CMSQueryParams): Promise<CMSResponse<CMSImage[]>> {
    try {
      const response = await this.api.get("cdn/assets", {
        page: params?.page || 1,
        per_page: params?.perPage || 25,
      });

      const assets: CMSImage[] = response.data.assets.map((asset: any) => ({
        url: asset.filename,
        alt: asset.alt || asset.title,
        width: asset.meta_data?.width,
        height: asset.meta_data?.height,
        filename: asset.filename,
      }));

      return {
        data: assets,
        total: response.total,
      };
    } catch (error) {
      console.error("Storyblok getAssets error:", error);
      return { data: [] };
    }
  }

  async getAsset(id: string): Promise<CMSResponse<CMSImage>> {
    try {
      const response = await this.api.get(`cdn/assets/${id}`);
      const asset = response.data.asset;

      return {
        data: {
          url: asset.filename,
          alt: asset.alt || asset.title,
          width: asset.meta_data?.width,
          height: asset.meta_data?.height,
          filename: asset.filename,
        },
      };
    } catch (error) {
      console.error("Storyblok getAsset error:", error);
      throw new Error(`Failed to fetch asset: ${id}`);
    }
  }

  async enablePreview(): Promise<void> {
    if (typeof window !== "undefined") {
      document.cookie = "sb-preview=true; path=/";
    }
  }

  async disablePreview(): Promise<void> {
    if (typeof window !== "undefined") {
      document.cookie = "sb-preview=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  isPreviewMode(): boolean {
    if (typeof window !== "undefined") {
      return document.cookie.includes("sb-preview=true");
    }
    return this.config.version === "draft";
  }

  async revalidateTag(tag: string): Promise<void> {
    try {
      // Only available in server context - call via API route instead
      if (typeof window === "undefined") {
        const { revalidateTag } = await import("next/cache");
        revalidateTag(tag);
      }
    } catch (error) {
      console.error("Failed to revalidate tag:", error);
    }
  }

  async revalidatePath(path: string): Promise<void> {
    try {
      // Only available in server context - call via API route instead
      if (typeof window === "undefined") {
        const { revalidatePath } = await import("next/cache");
        revalidatePath(path);
      }
    } catch (error) {
      console.error("Failed to revalidate path:", error);
    }
  }

  getConfig() {
    return {
      provider: this.provider,
      storyblok: this.config,
    };
  }

  getDebugInfo() {
    // Always use main API endpoint (matches your working URL)
    const baseUrl = "https://api.storyblok.com/v2";

    return {
      provider: this.provider,
      isInitialized: this.isInitialized,
      config: {
        hasAccessToken: !!this.config.accessToken,
        accessTokenLength: this.config.accessToken?.length,
        region: this.config.region,
        version: this.config.version,
        spaceId: this.config.spaceId,
      },
      api: {
        isAvailable: !!this.api,
        baseUrl: baseUrl,
        note: "Using main API endpoint (no region) to match your working URL format",
      },
    };
  }
}
