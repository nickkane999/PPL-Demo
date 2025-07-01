"use client";

import { StoryblokComponent as SbComponent } from "@storyblok/react";

export default function StoryblokComponent({ blok }: { blok: any }) {
  return <SbComponent blok={blok} />;
}
