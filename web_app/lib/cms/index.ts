// Main exports
export * from "./config";
export * from "./factory";

// Client exports
export { StoryblokClient } from "./clients/storyblok";
export { SanityClient } from "./clients/sanity";
export { ContentfulClient } from "./clients/contentful";

// Convenience exports
export { getCMSClient, createCMSClient, switchCMSProvider, getAvailableCMSProviders, getCurrentCMSProvider, cmsFactory } from "./factory";

// Legacy compatibility with old cms.ts
export { getCMSClient as cmsClient } from "./factory";

// Default client (backwards compatibility - lazy loaded)
export function getDefaultCMSClient() {
  const { getCMSClient } = require("./factory");
  return getCMSClient();
}
