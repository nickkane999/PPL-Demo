import Page from "@/components/Page";
import Feature from "@/components/Feature";
import Teaser from "@/components/Teaser";

import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
  use: [apiPlugin],
  components: {
    page: Page,
    feature: Feature,
    teaser: Teaser,
  },
  apiOptions: {
    region: "us", // Change to 'eu' if your space is in Europe
  },
});
