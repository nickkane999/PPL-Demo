import { storyblokEditable } from "@storyblok/react/rsc";

export default function Teaser({ blok }: { blok: any }) {
  return (
    <div {...storyblokEditable(blok)} className="teaser bg-blue-50 p-8 rounded-lg mb-6">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">{blok.headline}</h2>
      {blok.text && <p className="text-lg text-blue-700">{blok.text}</p>}
    </div>
  );
}
