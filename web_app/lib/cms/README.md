# Multi-CMS Integration Guide

This system provides a unified interface for working with **Storyblok**, **Sanity**, and **Contentful** CMS platforms. You can switch between providers seamlessly or use multiple providers simultaneously.

## 🏗️ Architecture Overview

```
lib/cms/
├── config.ts              # Unified interfaces and configuration
├── factory.ts              # CMS client factory and provider management
├── index.ts               # Main exports
├── clients/
│   ├── storyblok.ts       # Storyblok implementation
│   ├── sanity.ts          # Sanity implementation
│   └── contentful.ts      # Contentful implementation
└── hooks/
    └── useCMS.ts          # React hooks for all providers
```

## 🚀 Quick Start

### 1. Install Dependencies

All required packages are already installed:

- `@storyblok/react@5.x` (React 19 compatible)
- `@sanity/client@latest`
- `@sanity/image-url@latest`
- `contentful@latest`
- `@contentful/rich-text-react-renderer@latest`

### 2. Environment Configuration

Update your `.env.local` file with your CMS credentials:

```env
# Choose your primary provider
NEXT_PUBLIC_CMS_PROVIDER=storyblok

# Storyblok Configuration
NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN=your_token_here
STORYBLOK_PREVIEW_TOKEN=your_preview_token_here
NEXT_PUBLIC_STORYBLOK_VERSION=published

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_token_here

# Contentful Configuration
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id_here
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_token_here
CONTENTFUL_PREVIEW_TOKEN=your_preview_token_here
```

### 3. Basic Usage

```tsx
import { useCMSStory, useCMSStories } from "@/lib/cms/hooks/useCMS";

// Fetch a single story
function StoryPage({ slug }: { slug: string }) {
  const { data, isLoading, error } = useCMSStory(slug);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <h1>{data?.title}</h1>;
}

// Fetch multiple stories
function StoriesPage() {
  const { stories, isLoading, total } = useCMSStories({
    contentType: "page",
    perPage: 10,
  });

  return (
    <div>
      <h1>Stories ({total})</h1>
      {stories.map((story) => (
        <div key={story.id}>{story.title}</div>
      ))}
    </div>
  );
}
```

## 📋 Provider Setup Instructions

### Storyblok Setup

1. **Create a Storyblok Space**

   - Go to [Storyblok](https://app.storyblok.com)
   - Create a new space
   - Get your access token from Settings > Access Tokens

2. **Configure CORS**

   - Add your domain to Settings > Visual Editor
   - Add `http://localhost:3000` for development

3. **Environment Variables**

   ```env
   NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN=your_public_token
   NEXT_PUBLIC_STORYBLOK_SPACE_ID=your_space_id
   STORYBLOK_PREVIEW_TOKEN=your_preview_token
   ```

4. **Webhook Configuration**
   ```
   URL: https://your-domain.com/api/cms/revalidate
   Secret: your_webhook_secret
   Headers: x-cms-provider=storyblok
   ```

### Sanity Setup

1. **Install Sanity CLI**

   ```bash
   npm install -g @sanity/cli
   ```

2. **Create Sanity Project**

   ```bash
   sanity init
   ```

3. **Configure CORS**

   - Go to https://www.sanity.io/manage
   - Add your domain to CORS origins

4. **Environment Variables**

   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_token
   ```

5. **Webhook Configuration**
   ```
   URL: https://your-domain.com/api/cms/revalidate
   Secret: your_webhook_secret
   Headers: x-cms-provider=sanity
   ```

### Contentful Setup

1. **Create Contentful Space**

   - Go to [Contentful](https://app.contentful.com)
   - Create a new space
   - Get tokens from Settings > API keys

2. **Environment Variables**

   ```env
   NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
   NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_delivery_token
   CONTENTFUL_PREVIEW_TOKEN=your_preview_token
   ```

3. **Webhook Configuration**
   ```
   URL: https://your-domain.com/api/cms/revalidate
   Secret: your_webhook_secret
   Headers: x-cms-provider=contentful
   ```

## 🔧 Advanced Usage

### Switching Providers

```tsx
import { useCMSProviders } from "@/lib/cms/hooks/useCMS";

function CMSProviderSelector() {
  const { currentProvider, availableProviders, switchProvider } = useCMSProviders();

  return (
    <select value={currentProvider} onChange={(e) => switchProvider(e.target.value)}>
      {availableProviders.map((provider) => (
        <option key={provider} value={provider}>
          {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </option>
      ))}
    </select>
  );
}
```

### Direct Client Usage

```tsx
import { getCMSClient, createCMSClient } from "@/lib/cms";

// Use default configured client
const client = getCMSClient();
const story = await client.getStory("home");

// Create specific client
const sanityClient = createCMSClient("sanity", config);
const stories = await sanityClient.getStories();
```

### Global Content Management

```tsx
import { useCMSGlobal } from "@/lib/cms/hooks/useCMS";

function Layout({ children }: { children: React.ReactNode }) {
  const { navigation, footer, settings, isLoading } = useCMSGlobal();

  return (
    <div>
      <Navigation items={navigation?.items || []} />
      <main>{children}</main>
      <Footer content={footer} />
    </div>
  );
}
```

## 🎯 Content Model Examples

### Universal Content Structure

All providers are normalized to this structure:

```typescript
interface BaseCMSEntry {
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
```

### Storyblok Schema Example

```json
{
  "name": "page",
  "display_name": "Page",
  "schema": {
    "title": {
      "type": "text",
      "required": true
    },
    "slug": {
      "type": "text",
      "required": true
    },
    "content": {
      "type": "richtext"
    }
  }
}
```

### Sanity Schema Example

```javascript
export default {
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
};
```

### Contentful Schema Example

```json
{
  "name": "page",
  "displayField": "title",
  "fields": [
    {
      "id": "title",
      "name": "Title",
      "type": "Symbol",
      "required": true
    },
    {
      "id": "slug",
      "name": "Slug",
      "type": "Symbol",
      "required": true
    },
    {
      "id": "content",
      "name": "Content",
      "type": "RichText"
    }
  ]
}
```

## 🔄 Preview Mode

### Enabling Preview

Each CMS has preview URLs configured:

**Storyblok:**

```
https://your-domain.com/api/cms/preview?secret=TOKEN&slug=SLUG&provider=storyblok
```

**Sanity:**

```
https://your-domain.com/api/cms/preview?secret=TOKEN&slug=SLUG&provider=sanity
```

**Contentful:**

```
https://your-domain.com/api/cms/preview?secret=TOKEN&slug=SLUG&provider=contentful
```

### Disabling Preview

```
https://your-domain.com/api/cms/preview/disable
```

## 🚀 Deployment & Production

### 1. Vercel Deployment

Add environment variables to your Vercel project:

```bash
vercel env add NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN
vercel env add SANITY_API_TOKEN
vercel env add NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
# ... add all other environment variables
```

### 2. Webhook Configuration

Configure webhooks in each CMS to point to:

```
https://your-domain.vercel.app/api/cms/revalidate
```

### 3. Performance Optimization

The system includes:

- ✅ Automatic cache revalidation
- ✅ Provider-specific cache tags
- ✅ Optimized image handling
- ✅ TypeScript interfaces
- ✅ Error boundaries

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**

   - Add your domain to each CMS's CORS settings
   - Include both production and development URLs

2. **Authentication Errors**

   - Verify API tokens are correct
   - Check token permissions and scopes

3. **Webhook Issues**

   - Test webhook URLs manually
   - Verify secret headers match

4. **Type Errors**
   - Ensure all TypeScript interfaces match your content models
   - Update content transformers if needed

### Debug Mode

Enable debug logging:

```env
DEBUG=cms:*
```

Test endpoints:

```
GET /api/cms/revalidate?secret=debug_secret
```

## 📚 Additional Resources

- [Storyblok Documentation](https://www.storyblok.com/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Next.js 15 Documentation](https://nextjs.org/docs)

## 🤝 Contributing

1. Add new CMS providers to `clients/`
2. Implement the `UnifiedCMSClient` interface
3. Update the factory and configuration
4. Add tests and documentation

---

**Ready to build with any CMS!** 🎉

## ⚠️ CRITICAL: Storyblok Token Configuration

### Getting the Correct Tokens

If you're getting **401 Unauthorized** errors from Storyblok, you likely have the wrong type of token. Follow these steps:

1. **Go to your Storyblok space**: https://app.storyblok.com/
2. **Navigate to**: Settings → Access tokens
3. **Look for these specific tokens**:
   - **"Public"** token - for published content
   - **"Preview"** token - for draft content (optional but recommended)

### ❌ Common Mistake: Wrong Token Type

**DON'T use Management API tokens** - they won't work for reading content!

- ❌ **Management API Token** - Used for creating/editing content programmatically
- ✅ **Public Token** - Used for reading published content
- ✅ **Preview Token** - Used for reading draft content (also works for published)

### 📝 Environment Variables

```env
# Content Delivery API Token (Public) - for published content
NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN=your_public_token_here

# Preview Token - for draft content (if you have one)
NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN=your_preview_token_here

# Space ID
NEXT_PUBLIC_STORYBLOK_SPACE_ID=your_space_id_here
```

### 🔧 Troubleshooting 401 Errors

1. **Check token type**: Ensure you're using Content Delivery API tokens, not Management API tokens
2. **Verify space access**: Make sure the token has access to your specific space
3. **Test in Storyblok**: Verify your content exists and is published
4. **Restart dev server**: After updating environment variables

---

## Overview

This library provides a unified interface for multiple headless CMS providers including Storyblok, Sanity, and Contentful.
