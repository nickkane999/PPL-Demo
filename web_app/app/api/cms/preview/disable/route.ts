import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

export async function GET(request: NextRequest) {
  // Disable draft mode
  const draft = await draftMode();
  draft.disable();

  const response = NextResponse.redirect(new URL("/", request.url));

  // Clear all CMS preview cookies
  const cookieOptions = {
    path: "/",
    expires: new Date(0),
  };

  response.cookies.set("sb-preview", "", cookieOptions);
  response.cookies.set("sanity-preview", "", cookieOptions);
  response.cookies.set("contentful-preview", "", cookieOptions);
  response.cookies.set("cms-provider", "", cookieOptions);

  return response;
}

export async function POST(request: NextRequest) {
  try {
    // Disable draft mode
    const draft = await draftMode();
    draft.disable();

    return NextResponse.json({
      success: true,
      message: "Preview mode disabled",
    });
  } catch (error) {
    console.error("Preview disable error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
