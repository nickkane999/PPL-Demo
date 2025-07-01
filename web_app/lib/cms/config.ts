export type CMSProvider = "storyblok" | "sanity" | "contentful";

export interface BaseCMSEntry {
  id: string;
  slug: string;
  title: string;
  content: any;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: "draft" | "published";
  tags?: string[];
}

export interface CMSImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  filename?: string;
}

export interface CMSResponse<T = any> {
  data: T;
  total?: number;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta?: any;
}

export interface CMSStoriesResponse<T = any> {
  stories: T[];
  total: number;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CMSQueryParams {
  version?: "draft" | "published";
  page?: number;
  perPage?: number;
  startsWith?: string;
  containsSlug?: string;
  tags?: string[];
  contentType?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  locale?: string;
  populate?: string[];
  fields?: string[];
  filter_query?: any; // Storyblok-specific filter queries
  [key: string]: any; // Allow additional CMS-specific parameters
}

export interface UnifiedCMSClient {
  provider: CMSProvider;

  // Story/Entry operations
  getStory(slug: string, params?: CMSQueryParams): Promise<CMSResponse<BaseCMSEntry>>;
  getStories(params?: CMSQueryParams): Promise<CMSStoriesResponse<BaseCMSEntry>>;
  getStoriesByType(contentType: string, params?: CMSQueryParams): Promise<CMSStoriesResponse<BaseCMSEntry>>;
  getStoriesByFolder(folder: string, params?: CMSQueryParams): Promise<CMSStoriesResponse<BaseCMSEntry>>;

  // Global operations
  getGlobalSettings(): Promise<CMSResponse<any>>;
  getNavigation(): Promise<CMSResponse<any>>;
  getFooter(): Promise<CMSResponse<any>>;

  // Asset operations
  getAssets(params?: CMSQueryParams): Promise<CMSResponse<CMSImage[]>>;
  getAsset(id: string): Promise<CMSResponse<CMSImage>>;

  // Preview and draft
  enablePreview(): Promise<void>;
  disablePreview(): Promise<void>;
  isPreviewMode(): boolean;

  // Cache operations
  revalidateTag(tag: string): Promise<void>;
  revalidatePath(path: string): Promise<void>;
}

export interface StoryblokConfig {
  accessToken: string;
  previewToken?: string;
  spaceId?: string;
  version?: "draft" | "published";
  region?: "us" | "eu";
}

export interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  token?: string;
  useCdn?: boolean;
  perspective?: "published" | "previewDrafts";
}

export interface ContentfulConfig {
  spaceId: string;
  accessToken: string;
  previewToken?: string;
  environment?: string;
  host?: string;
}

export interface CMSClientConfig {
  provider: CMSProvider;
  storyblok?: StoryblokConfig;
  sanity?: SanityConfig;
  contentful?: ContentfulConfig;
}

export interface CMSClientProps {
  config: CMSClientConfig;
}

export type CMSFactoryProps = {
  provider: CMSProvider;
  config: CMSClientConfig;
};

export interface CMSHookState {
  isLoading: boolean;
  error: string | null;
  data: any;
  provider: CMSProvider;
}

export interface CMSHookHandlers {
  refetch: () => Promise<void>;
  setProvider: (provider: CMSProvider) => void;
  clearError: () => void;
}

export type UseCMSProps = {
  state: CMSHookState;
  handlers?: CMSHookHandlers;
  client?: UnifiedCMSClient | null;
  isLoading?: boolean;
  error?: string | null;
};

export function getDefaultCMSConfig(): CMSClientConfig {
  // For Storyblok, use preview token if available (it can access both draft and published)
  // Otherwise fall back to public token
  const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN || process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN || "";

  return {
    provider: "storyblok",
    storyblok: {
      accessToken: storyblokToken,
      spaceId: process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID || "",
      version: (process.env.NEXT_PUBLIC_STORYBLOK_VERSION as "draft" | "published") || "published",
      region: "us",
    },
    sanity: {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
      useCdn: process.env.NODE_ENV === "production",
    },
    contentful: {
      spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "",
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || "",
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "master",
    },
  };
}

// Backwards compatibility
export const DEFAULT_CMS_CONFIG: CMSClientConfig = {
  provider: "storyblok",
  storyblok: { accessToken: "", version: "published", region: "us" },
  sanity: { projectId: "", dataset: "production", apiVersion: "2024-01-01", useCdn: false },
  contentful: { spaceId: "", accessToken: "", environment: "master" },
};

export const CMS_ENDPOINTS = {
  storyblok: {
    api: "https://api.storyblok.com/v2",
    management: "https://mapi.storyblok.com/v1",
  },
  sanity: {
    api: (projectId: string) => `https://${projectId}.api.sanity.io`,
    cdn: (projectId: string) => `https://${projectId}.apicdn.sanity.io`,
  },
  contentful: {
    api: "https://api.contentful.com",
    preview: "https://preview.contentful.com",
    management: "https://api.contentful.com",
  },
} as const;
