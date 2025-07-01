import React from "react";

// Individual Storyblok component renderers
const Teaser = ({ blok }: { blok: any }) => (
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg mb-6">
    <h1 className="text-4xl font-bold mb-4">{blok.headline}</h1>
    {blok.subheadline && <p className="text-xl opacity-90">{blok.subheadline}</p>}
  </div>
);

const Feature = ({ blok }: { blok: any }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
    <h3 className="text-xl font-semibold text-gray-800 mb-3">{blok.name}</h3>
    {blok.description && <p className="text-gray-600 mb-4">{blok.description}</p>}
    {blok.icon && <div className="text-blue-500 text-2xl mb-2">{blok.icon}</div>}
  </div>
);

const Grid = ({ blok }: { blok: any }) => (
  <div className="mb-8">
    {blok.title && <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{blok.title}</h2>}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blok.columns?.map((column: any) => (
        <StoryblokComponent key={column._uid} blok={column} />
      ))}
    </div>
  </div>
);

const Page = ({ blok }: { blok: any }) => (
  <div className="space-y-6">
    {blok.body?.map((nestedBlok: any) => (
      <StoryblokComponent key={nestedBlok._uid} blok={nestedBlok} />
    ))}
  </div>
);

// Component mapping
const components: Record<string, React.ComponentType<{ blok: any }>> = {
  teaser: Teaser,
  feature: Feature,
  grid: Grid,
  page: Page,
};

// Main component renderer
export const StoryblokComponent = ({ blok }: { blok: any }) => {
  if (typeof blok !== "object" || !blok.component) {
    return null;
  }

  const Component = components[blok.component];

  if (!Component) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <p className="text-yellow-800">
          <strong>Unknown component:</strong> {blok.component}
        </p>
        <pre className="text-sm mt-2 text-yellow-700">{JSON.stringify(blok, null, 2)}</pre>
      </div>
    );
  }

  return <Component blok={blok} />;
};

// Story renderer that renders the full story content
export const StoryblokStoryRenderer = ({ story }: { story: any }) => {
  if (!story || !story.content) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600">No content available for this story.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Story Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">{story.title}</h1>
        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
          <span>Slug: {story.slug}</span>
          <span>•</span>
          <span>Status: {story.status}</span>
          <span>•</span>
          <span>Updated: {new Date(story.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Story Content */}
      <div className="prose max-w-none">
        <StoryblokComponent blok={story.content} />
      </div>
    </div>
  );
};

export default StoryblokComponent;
