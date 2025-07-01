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
      storyblokInit({
        accessToken: this.config.accessToken,
        use: [apiPlugin],
        apiOptions: {
          region: this.config.region || "us",
        },
      });
      this.api = getStoryblokApi();
      this.isInitialized = true;
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
      const response = await this.api.get("cdn/stories", {
        version: params?.version || this.config.version || "published",
        page: params?.page || 1,
        per_page: params?.perPage || 25,
        starts_with: params?.startsWith,
        with_tag: params?.tags?.join(","),
        sort_by: params?.sortBy,
        ...params,
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
    } catch (error) {
      console.error("Storyblok getStories error:", error);
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
}
