import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headerSecret = request.headers.get("x-revalidate-secret");
    const provider = request.headers.get("x-cms-provider") || body.provider;

    // Validate secret based on provider
    let expectedSecret: string | undefined;
    switch (provider) {
      case "storyblok":
        expectedSecret = process.env.STORYBLOK_REVALIDATE_SECRET;
        break;
      case "sanity":
        expectedSecret = process.env.SANITY_REVALIDATE_SECRET;
        break;
      case "contentful":
        expectedSecret = process.env.CONTENTFUL_REVALIDATE_SECRET;
        break;
      default:
        return NextResponse.json({ error: "Invalid or missing CMS provider" }, { status: 400 });
    }

    if (!expectedSecret || headerSecret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid or missing secret" }, { status: 401 });
    }

    // Handle different webhook formats
    let slug: string | undefined;
    let tags: string[] = [];
    let paths: string[] = [];

    switch (provider) {
      case "storyblok":
        slug = body.slug || body.story?.slug;
        if (slug) {
          tags.push(`story-${slug}`);
          paths.push(`/${slug}`);
        }
        tags.push("storyblok-content");
        break;

      case "sanity":
        const document = body.body || body;
        slug = document.slug?.current || document.slug;
        if (slug) {
          tags.push(`story-${slug}`);
          paths.push(`/${slug}`);
        }
        tags.push("sanity-content");

        // Handle specific document types
        if (document._type === "globalSettings") {
          tags.push("sanity-global");
        }
        if (document._type === "navigation") {
          tags.push("sanity-navigation");
        }
        if (document._type === "footer") {
          tags.push("sanity-footer");
        }
        break;

      case "contentful":
        const entry = body.fields || body;
        slug = entry.slug;
        if (slug) {
          tags.push(`story-${slug}`);
          paths.push(`/${slug}`);
        }
        tags.push("contentful-content");

        // Handle specific content types
        const contentType = body.sys?.contentType?.sys?.id;
        if (contentType === "globalSettings") {
          tags.push("contentful-global");
        }
        if (contentType === "navigation") {
          tags.push("contentful-navigation");
        }
        if (contentType === "footer") {
          tags.push("contentful-footer");
        }
        break;
    }

    // Revalidate tags
    for (const tag of tags) {
      revalidateTag(tag);
    }

    // Revalidate paths
    for (const path of paths) {
      revalidatePath(path);
    }

    // Always revalidate home page
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      provider,
      revalidated: {
        tags,
        paths: ["/", ...paths],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for debugging
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");

  if (!secret || secret !== process.env.REVALIDATE_DEBUG_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    message: "Revalidation endpoint is working",
    timestamp: new Date().toISOString(),
    env: {
      hasStoryblokSecret: !!process.env.STORYBLOK_REVALIDATE_SECRET,
      hasSanitySecret: !!process.env.SANITY_REVALIDATE_SECRET,
      hasContentfulSecret: !!process.env.CONTENTFUL_REVALIDATE_SECRET,
    },
  });
}
