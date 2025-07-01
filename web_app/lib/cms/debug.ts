export function debugCMSConfig() {
  const config = {
    storyblok: {
      accessToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN || "",
      spaceId: process.env.STORYBLOK_SPACE_ID || "",
      version: process.env.NEXT_PUBLIC_STORYBLOK_VERSION || "published",
    },
    sanity: {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "",
    },
    contentful: {
      spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "",
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || "",
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "",
    },
  };

  const debug = {
    storyblok: {
      configured: !!(config.storyblok.accessToken && config.storyblok.accessToken.length > 0),
      accessTokenLength: config.storyblok.accessToken.length,
      hasSpaceId: !!config.storyblok.spaceId,
      version: config.storyblok.version,
    },
    sanity: {
      configured: !!(config.sanity.projectId && config.sanity.dataset),
      hasProjectId: !!config.sanity.projectId,
      hasDataset: !!config.sanity.dataset,
      apiVersion: config.sanity.apiVersion,
    },
    contentful: {
      configured: !!(config.contentful.spaceId && config.contentful.accessToken),
      hasSpaceId: !!config.contentful.spaceId,
      hasAccessToken: !!config.contentful.accessToken,
      environment: config.contentful.environment,
    },
  };

  return { config, debug };
}

export function logCMSStatus() {
  const { debug } = debugCMSConfig();

  console.log("🔧 CMS Configuration Status:");
  console.log("  📝 Storyblok:", debug.storyblok.configured ? "✅ Configured" : "❌ Missing token");
  console.log("  📝 Sanity:", debug.sanity.configured ? "✅ Configured" : "❌ Missing config");
  console.log("  📝 Contentful:", debug.contentful.configured ? "✅ Configured" : "❌ Missing config");

  if (debug.storyblok.configured) {
    console.log(`    • Access token length: ${debug.storyblok.accessTokenLength}`);
    console.log(`    • Version: ${debug.storyblok.version}`);
  }

  return debug;
}
