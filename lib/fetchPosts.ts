import path from "path";
import fs from "fs";

export interface Post {
  slug: string;
  category: string;
  title: string;
  summary: string;
  keywords: string;
  html: string;
}

let cachedPosts: Post[] | null = null;

export function fetchPosts(): Post[] {
  if (cachedPosts) return cachedPosts;

  const jsonPath = path.join(process.cwd(), "data", "posts.json");

  if (!fs.existsSync(jsonPath)) {
    throw new Error(
      "data/posts.json 파일이 없습니다. 빌드 전에 `node scripts/fetch-data.js`를 먼저 실행하세요."
    );
  }

  const raw = fs.readFileSync(jsonPath, "utf-8");
  cachedPosts = JSON.parse(raw) as Post[];
  return cachedPosts;
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = fetchPosts();
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): Post[] {
  const posts = fetchPosts();
  return posts.filter((p) => p.category === category);
}
