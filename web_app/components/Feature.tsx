import { storyblokEditable } from "@storyblok/react/rsc";

export default function Feature({ blok }: { blok: any }) {
  return (
    <div {...storyblokEditable(blok)} className="feature bg-green-50 p-6 rounded-lg">
      <span className="text-lg font-semibold text-green-800">{blok.name}</span>
    </div>
  );
}
