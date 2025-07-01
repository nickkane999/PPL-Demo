import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { UnifiedCMSClient, CMSResponse, CMSStoriesResponse, BaseCMSEntry, CMSQueryParams, CMSImage, SanityConfig } from "../config";

export class SanityClient implements UnifiedCMSClient {
  provider: "sanity" = "sanity";
  private client: any;
  private imageBuilder: any;
  private config: SanityConfig;

  constructor(config: SanityConfig) {
    this.config = config;
    this.initializeClient();
  }

  private initializeClient() {
    this.client = createClient({
      projectId: this.config.projectId,
      dataset: this.config.dataset,
      apiVersion: this.config.apiVersion,
      token: this.config.token,
      useCdn: this.config.useCdn ?? true,
      perspective: this.config.perspective || "published",
    });

    this.imageBuilder = imageUrlBuilder(this.client);
  }

  private transformSanityEntry(doc: any): BaseCMSEntry {
    return {
      id: doc._id,
      slug: doc.slug?.current || doc.slug || doc._id,
      title: doc.title || doc.name || "Untitled",
      content: doc,
      createdAt: doc._createdAt,
      updatedAt: doc._updatedAt,
      publishedAt: doc.publishedAt || doc._updatedAt,
      status: doc._id.startsWith("drafts.") ? "draft" : "published",
      tags: doc.tags || [],
    };
  }

  private urlFor(source: any): string {
    return this.imageBuilder.image(source).url();
  }

  async getStory(slug: string, params?: CMSQueryParams): Promise<CMSResponse<BaseCMSEntry>> {
    try {
      const query = `
        *[slug.current == $slug || slug == $slug] | order(_updatedAt desc) [0] {
          ...,
          "slug": slug.current,
          ${params?.populate ? params.populate.join(", ") : ""}
        }
      `;

      const result = await this.client.fetch(
        query,
        { slug },
        {
          next: { tags: ["sanity-content", `story-${slug}`] },
        }
      );

      if (!result) {
        throw new Error(`Story not found: ${slug}`);
      }

      return {
        data: this.transformSanityEntry(result),
        meta: { query, params: { slug } },
      };
    } catch (error) {
      console.error("Sanity getStory error:", error);
      throw new Error(`Failed to fetch story: ${slug}`);
    }
  }

  async getStories(params?: CMSQueryParams): Promise<CMSStoriesResponse<BaseCMSEntry>> {
    try {
      const { page = 1, perPage = 25, contentType, tags, sortBy = "_updatedAt", order = "desc" } = params || {};

      let filter = "*";
      if (contentType) {
        filter = `*[_type == "${contentType}"]`;
      }
      if (tags && tags.length > 0) {
        const tagFilter = tags.map((tag) => `"${tag}" in tags`).join(" || ");
        filter += `[${tagFilter}]`;
      }

      const query = `
        {
          "stories": ${filter} | order(${sortBy} ${order}) [${(page - 1) * perPage}...${page * perPage}] {
            ...,
            "slug": slug.current,
            ${params?.populate ? params.populate.join(", ") : ""}
          },
          "total": count(${filter})
        }
      `;

      const result = await this.client.fetch(
        query,
        {},
        {
          next: { tags: ["sanity-content", "stories"] },
        }
      );

      const stories = result.stories.map(this.transformSanityEntry);

      return {
        stories,
        total: result.total,
        pagination: {
          page,
          perPage,
          total: result.total,
          hasNext: page * perPage < result.total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("Sanity getStories error:", error);
      throw new Error("Failed to fetch stories");
    }
  }

  async getStoriesByType(contentType: string, params?: CMSQueryParams): Promise<CMSStoriesResponse<BaseCMSEntry>> {
    return this.getStories({
      ...params,
      contentType,
    });
  }

  async getStoriesByFolder(folder: string, params?: CMSQueryParams): Promise<CMSStoriesResponse<BaseCMSEntry>> {
    try {
      const query = `
        *[_type == "page" && slug.current match "${folder}/*"] | order(_updatedAt desc) {
          ...,
          "slug": slug.current
        }
      `;

      const result = await this.client.fetch(
        query,
        {},
        {
          next: { tags: ["sanity-content", `folder-${folder}`] },
        }
      );

      const stories = result.map(this.transformSanityEntry);

      return {
        stories,
        total: stories.length,
        pagination: {
          page: 1,
          perPage: stories.length,
          total: stories.length,
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      console.error("Sanity getStoriesByFolder error:", error);
      throw new Error(`Failed to fetch stories in folder: ${folder}`);
    }
  }

  async getGlobalSettings(): Promise<CMSResponse<any>> {
    try {
      const query = `*[_type == "globalSettings"][0]`;
      const result = await this.client.fetch(
        query,
        {},
        {
          next: { tags: ["sanity-global"] },
        }
      );

      return {
        data: result || {},
        meta: { query },
      };
    } catch (error) {
      console.error("Sanity getGlobalSettings error:", error);
      return { data: {} };
    }
  }

  async getNavigation(): Promise<CMSResponse<any>> {
    try {
      const query = `*[_type == "navigation"][0]`;
      const result = await this.client.fetch(
        query,
        {},
        {
          next: { tags: ["sanity-navigation"] },
        }
      );

      return {
        data: result || { items: [] },
        meta: { query },
      };
    } catch (error) {
      console.error("Sanity getNavigation error:", error);
      return { data: { items: [] } };
    }
  }

  async getFooter(): Promise<CMSResponse<any>> {
    try {
      const query = `*[_type == "footer"][0]`;
      const result = await this.client.fetch(
        query,
        {},
        {
          next: { tags: ["sanity-footer"] },
        }
      );

      return {
        data: result || {},
        meta: { query },
      };
    } catch (error) {
      console.error("Sanity getFooter error:", error);
      return { data: {} };
    }
  }

  async getAssets(params?: CMSQueryParams): Promise<CMSResponse<CMSImage[]>> {
    try {
      const { page = 1, perPage = 25 } = params || {};

      const query = `
        {
          "assets": *[_type == "sanity.imageAsset"] | order(_updatedAt desc) [${(page - 1) * perPage}...${page * perPage}] {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height
              }
            },
            originalFilename,
            alt
          },
          "total": count(*[_type == "sanity.imageAsset"])
        }
      `;

      const result = await this.client.fetch(query);

      const assets: CMSImage[] = result.assets.map((asset: any) => ({
        url: asset.url,
        alt: asset.alt || asset.originalFilename,
        width: asset.metadata?.dimensions?.width,
        height: asset.metadata?.dimensions?.height,
        filename: asset.originalFilename,
      }));

      return {
        data: assets,
        total: result.total,
        pagination: {
          page,
          perPage,
          total: result.total,
          hasNext: page * perPage < result.total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("Sanity getAssets error:", error);
      return { data: [] };
    }
  }

  async getAsset(id: string): Promise<CMSResponse<CMSImage>> {
    try {
      const query = `*[_type == "sanity.imageAsset" && _id == $id][0]`;
      const result = await this.client.fetch(query, { id });

      if (!result) {
        throw new Error(`Asset not found: ${id}`);
      }

      return {
        data: {
          url: result.url,
          alt: result.alt || result.originalFilename,
          width: result.metadata?.dimensions?.width,
          height: result.metadata?.dimensions?.height,
          filename: result.originalFilename,
        },
      };
    } catch (error) {
      console.error("Sanity getAsset error:", error);
      throw new Error(`Failed to fetch asset: ${id}`);
    }
  }

  async enablePreview(): Promise<void> {
    if (typeof window !== "undefined") {
      document.cookie = "sanity-preview=true; path=/";
    }
  }

  async disablePreview(): Promise<void> {
    if (typeof window !== "undefined") {
      document.cookie = "sanity-preview=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  isPreviewMode(): boolean {
    if (typeof window !== "undefined") {
      return document.cookie.includes("sanity-preview=true");
    }
    return this.config.perspective === "previewDrafts";
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
