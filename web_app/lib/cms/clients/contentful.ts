import { createClient } from "contentful";
import { UnifiedCMSClient, CMSResponse, CMSStoriesResponse, BaseCMSEntry, CMSQueryParams, CMSImage, ContentfulConfig } from "../config";

export class ContentfulClient implements UnifiedCMSClient {
  provider: "contentful" = "contentful";
  private client: any;
  private previewClient: any;
  private config: ContentfulConfig;

  constructor(config: ContentfulConfig) {
    this.config = config;
    this.initializeClient();
  }

  private initializeClient() {
    this.client = createClient({
      space: this.config.spaceId,
      accessToken: this.config.accessToken,
      environment: this.config.environment || "master",
      host: this.config.host,
    });

    if (this.config.previewToken) {
      this.previewClient = createClient({
        space: this.config.spaceId,
        accessToken: this.config.previewToken,
        environment: this.config.environment || "master",
        host: "preview.contentful.com",
      });
    }
  }

  private getClient(version?: "draft" | "published") {
    return version === "draft" && this.previewClient ? this.previewClient : this.client;
  }

  private transformContentfulEntry(entry: any): BaseCMSEntry {
    const fields = entry.fields || {};
    return {
      id: entry.sys.id,
      slug: fields.slug || entry.sys.id,
      title: fields.title || fields.name || "Untitled",
      content: fields,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      publishedAt: entry.sys.publishedAt,
      status: entry.sys.publishedAt ? "published" : "draft",
      tags: fields.tags || [],
    };
  }

  private transformContentfulAsset(asset: any): CMSImage {
    const fields = asset.fields || {};
    const file = fields.file || {};

    return {
      url: file.url ? (file.url.startsWith("//") ? `https:${file.url}` : file.url) : "",
      alt: fields.title || fields.description || "",
      width: file.details?.image?.width,
      height: file.details?.image?.height,
      filename: file.fileName,
    };
  }

  async getStory(slug: string, params?: CMSQueryParams): Promise<CMSResponse<BaseCMSEntry>> {
    try {
      const client = this.getClient(params?.version);
      const query: any = {
        "fields.slug": slug,
      };

      if (params?.contentType) {
        query.content_type = params.contentType;
      }

      if (params?.populate) {
        query.include = 10; // Contentful's max include depth
      }

      const response = await client.getEntries(query);

      if (!response.items || response.items.length === 0) {
        throw new Error(`Story not found: ${slug}`);
      }

      const entry = response.items[0];
      return {
        data: this.transformContentfulEntry(entry),
        meta: {
          total: response.total,
          skip: response.skip,
          limit: response.limit,
        },
      };
    } catch (error) {
      console.error("Contentful getStory error:", error);
      throw new Error(`Failed to fetch story: ${slug}`);
    }
  }

  async getStories(params?: CMSQueryParams): Promise<CMSStoriesResponse<BaseCMSEntry>> {
    try {
      const client = this.getClient(params?.version);
      const { page = 1, perPage = 25, contentType, tags, sortBy = "sys.updatedAt", order = "desc" } = params || {};

      const query: any = {
        skip: (page - 1) * perPage,
        limit: perPage,
        order: order === "desc" ? `-${sortBy}` : sortBy,
      };

      if (contentType) {
        query.content_type = contentType;
      }

      if (tags && tags.length > 0) {
        query["metadata.tags.sys.id[in]"] = tags.join(",");
      }

      if (params?.populate) {
        query.include = 10;
      }

      const response = await client.getEntries(query);

      const stories = response.items.map(this.transformContentfulEntry);

      return {
        stories,
        total: response.total,
        pagination: {
          page,
          perPage,
          total: response.total,
          hasNext: page * perPage < response.total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("Contentful getStories error:", error);
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
      const client = this.getClient(params?.version);
      const query: any = {
        "fields.slug[match]": `${folder}/`,
      };

      if (params?.contentType) {
        query.content_type = params.contentType;
      }

      const response = await client.getEntries(query);
      const stories = response.items.map(this.transformContentfulEntry);

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
      console.error("Contentful getStoriesByFolder error:", error);
      throw new Error(`Failed to fetch stories in folder: ${folder}`);
    }
  }

  async getGlobalSettings(): Promise<CMSResponse<any>> {
    try {
      const client = this.getClient();
      const response = await client.getEntries({
        content_type: "globalSettings",
        limit: 1,
      });

      const settings = response.items[0]?.fields || {};
      return {
        data: settings,
        meta: { total: response.total },
      };
    } catch (error) {
      console.error("Contentful getGlobalSettings error:", error);
      return { data: {} };
    }
  }

  async getNavigation(): Promise<CMSResponse<any>> {
    try {
      const client = this.getClient();
      const response = await client.getEntries({
        content_type: "navigation",
        limit: 1,
      });

      const navigation = response.items[0]?.fields || { items: [] };
      return {
        data: navigation,
        meta: { total: response.total },
      };
    } catch (error) {
      console.error("Contentful getNavigation error:", error);
      return { data: { items: [] } };
    }
  }

  async getFooter(): Promise<CMSResponse<any>> {
    try {
      const client = this.getClient();
      const response = await client.getEntries({
        content_type: "footer",
        limit: 1,
      });

      const footer = response.items[0]?.fields || {};
      return {
        data: footer,
        meta: { total: response.total },
      };
    } catch (error) {
      console.error("Contentful getFooter error:", error);
      return { data: {} };
    }
  }

  async getAssets(params?: CMSQueryParams): Promise<CMSResponse<CMSImage[]>> {
    try {
      const client = this.getClient(params?.version);
      const { page = 1, perPage = 25 } = params || {};

      const query: any = {
        skip: (page - 1) * perPage,
        limit: perPage,
        order: "-sys.updatedAt",
      };

      const response = await client.getAssets(query);
      const assets = response.items.map(this.transformContentfulAsset);

      return {
        data: assets,
        total: response.total,
        pagination: {
          page,
          perPage,
          total: response.total,
          hasNext: page * perPage < response.total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("Contentful getAssets error:", error);
      return { data: [] };
    }
  }

  async getAsset(id: string): Promise<CMSResponse<CMSImage>> {
    try {
      const client = this.getClient();
      const asset = await client.getAsset(id);

      return {
        data: this.transformContentfulAsset(asset),
      };
    } catch (error) {
      console.error("Contentful getAsset error:", error);
      throw new Error(`Failed to fetch asset: ${id}`);
    }
  }

  async enablePreview(): Promise<void> {
    if (typeof window !== "undefined") {
      document.cookie = "contentful-preview=true; path=/";
    }
  }

  async disablePreview(): Promise<void> {
    if (typeof window !== "undefined") {
      document.cookie = "contentful-preview=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  isPreviewMode(): boolean {
    if (typeof window !== "undefined") {
      return document.cookie.includes("contentful-preview=true");
    }
    return Boolean(this.previewClient);
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
