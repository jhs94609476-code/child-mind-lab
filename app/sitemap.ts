import type { MetadataRoute } from "next";
import { categories, categoryPageCount, categoryPageHref } from "../lib/categories";
import { fetchPosts } from "../lib/fetchPosts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://child-mind-lab-88rx.vercel.app";
  const posts = fetchPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/${post.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.flatMap(({ name, slug }) => {
    const postCount = posts.filter((post) => post.category === name).length;
    return Array.from({ length: categoryPageCount(postCount) }, (_, index) => ({
      url: `${baseUrl}${categoryPageHref(slug, index + 1)}`,
    }));
  });

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...postEntries,
    ...categoryEntries,
  ];
}
