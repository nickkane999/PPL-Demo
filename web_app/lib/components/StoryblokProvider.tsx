"use client";

import { getStoryblokApi } from "@/lib/cms";

export default function StoryblokProvider({ children }: { children: React.ReactNode }) {
  getStoryblokApi();
  return <>{children}</>;
}
