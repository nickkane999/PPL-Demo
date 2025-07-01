import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "/";
  const provider = searchParams.get("provider") || "storyblok";

  // Validate secret based on provider
  let expectedSecret: string | undefined;
  switch (provider) {
    case "storyblok":
      expectedSecret = process.env.STORYBLOK_PREVIEW_TOKEN;
      break;
    case "sanity":
      expectedSecret = process.env.SANITY_API_TOKEN;
      break;
    case "contentful":
      expectedSecret = process.env.CONTENTFUL_PREVIEW_TOKEN;
      break;
    default:
      return NextResponse.json({ error: "Invalid CMS provider" }, { status: 400 });
  }

  if (!secret || !expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Invalid or missing secret" }, { status: 401 });
  }

  // Enable draft mode
  const draft = await draftMode();
  draft.enable();

  // Set provider-specific cookies for client-side detection
  const response = NextResponse.redirect(new URL(slug, request.url));

  switch (provider) {
    case "storyblok":
      response.cookies.set("sb-preview", "true", {
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });
      break;
    case "sanity":
      response.cookies.set("sanity-preview", "true", {
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });
      break;
    case "contentful":
      response.cookies.set("contentful-preview", "true", {
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });
      break;
  }

  response.cookies.set("cms-provider", provider, {
    path: "/",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

// POST method for programmatic preview activation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, slug = "/", provider = "storyblok" } = body;

    // Validate secret based on provider
    let expectedSecret: string | undefined;
    switch (provider) {
      case "storyblok":
        expectedSecret = process.env.STORYBLOK_PREVIEW_TOKEN;
        break;
      case "sanity":
        expectedSecret = process.env.SANITY_API_TOKEN;
        break;
      case "contentful":
        expectedSecret = process.env.CONTENTFUL_PREVIEW_TOKEN;
        break;
      default:
        return NextResponse.json({ error: "Invalid CMS provider" }, { status: 400 });
    }

    if (!secret || !expectedSecret || secret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid or missing secret" }, { status: 401 });
    }

    // Enable draft mode
    const draft = await draftMode();
    draft.enable();

    return NextResponse.json({
      success: true,
      provider,
      slug,
      message: "Preview mode enabled",
      previewUrl: `${request.nextUrl.origin}${slug}`,
    });
  } catch (error) {
    console.error("Preview activation error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
