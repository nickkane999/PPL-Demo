import { UnifiedCMSClient, CMSProvider, CMSClientConfig, getDefaultCMSConfig } from "./config";
import { StoryblokClient } from "./clients/storyblok";
import { SanityClient } from "./clients/sanity";
import { ContentfulClient } from "./clients/contentful";

export class CMSFactory {
  private static instance: CMSFactory;
  private clients: Map<CMSProvider, UnifiedCMSClient> = new Map();
  private currentProvider: CMSProvider = "storyblok";

  private constructor() {}

  static getInstance(): CMSFactory {
    if (!CMSFactory.instance) {
      CMSFactory.instance = new CMSFactory();
    }
    return CMSFactory.instance;
  }

  createClient(provider: CMSProvider, config?: CMSClientConfig): UnifiedCMSClient {
    const clientConfig = config || getDefaultCMSConfig();

    if (this.clients.has(provider)) {
      return this.clients.get(provider)!;
    }

    let client: UnifiedCMSClient;

    switch (provider) {
      case "storyblok":
        if (!clientConfig.storyblok?.accessToken) {
          throw new Error("Storyblok access token is required");
        }
        client = new StoryblokClient(clientConfig.storyblok);
        break;

      case "sanity":
        if (!clientConfig.sanity?.projectId || !clientConfig.sanity?.dataset) {
          throw new Error("Sanity project ID and dataset are required");
        }
        client = new SanityClient(clientConfig.sanity);
        break;

      case "contentful":
        if (!clientConfig.contentful?.spaceId || !clientConfig.contentful?.accessToken) {
          throw new Error("Contentful space ID and access token are required");
        }
        client = new ContentfulClient(clientConfig.contentful);
        break;

      default:
        throw new Error(`Unsupported CMS provider: ${provider}`);
    }

    this.clients.set(provider, client);
    return client;
  }

  getClient(provider?: CMSProvider): UnifiedCMSClient {
    const targetProvider = provider || this.currentProvider;

    if (!this.clients.has(targetProvider)) {
      return this.createClient(targetProvider);
    }

    return this.clients.get(targetProvider)!;
  }

  setCurrentProvider(provider: CMSProvider): void {
    this.currentProvider = provider;
  }

  getCurrentProvider(): CMSProvider {
    return this.currentProvider;
  }

  clearCache(): void {
    this.clients.clear();
  }

  getAvailableProviders(): CMSProvider[] {
    const config = getDefaultCMSConfig();
    const providers: CMSProvider[] = [];

    if (config.storyblok?.accessToken) {
      providers.push("storyblok");
    }
    if (config.sanity?.projectId && config.sanity?.dataset) {
      providers.push("sanity");
    }
    if (config.contentful?.spaceId && config.contentful?.accessToken) {
      providers.push("contentful");
    }

    return providers;
  }

  switchProvider(provider: CMSProvider): UnifiedCMSClient {
    this.setCurrentProvider(provider);
    return this.getClient(provider);
  }
}

// Export singleton instance
export const cmsFactory = CMSFactory.getInstance();

// Helper functions for easy access
export function createCMSClient(provider: CMSProvider, config?: CMSClientConfig): UnifiedCMSClient {
  return cmsFactory.createClient(provider, config);
}

export function getCMSClient(provider?: CMSProvider): UnifiedCMSClient {
  return cmsFactory.getClient(provider);
}

export function switchCMSProvider(provider: CMSProvider): UnifiedCMSClient {
  return cmsFactory.switchProvider(provider);
}

export function getAvailableCMSProviders(): CMSProvider[] {
  return cmsFactory.getAvailableProviders();
}

export function getCurrentCMSProvider(): CMSProvider {
  return cmsFactory.getCurrentProvider();
}
