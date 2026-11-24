import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostGrid from "../../../../components/PostGrid";
import { categories, categoryPageCount, categoryPageHref, categoryPageSize } from "../../../../lib/categories";
import { getPostsByCategory } from "../../../../lib/fetchPosts";

interface Props {
  params: Promise<{ categorySlug: string; pagination?: string[] }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.flatMap(({ name, slug: categorySlug }) =>
    Array.from({ length: categoryPageCount(getPostsByCategory(name).length) }, (_, index) => ({
      categorySlug,
      pagination: index === 0 ? [] : ["page", String(index + 1)],
    }))
  );
}

async function readCategory(params: Props["params"]) {
  const { categorySlug, pagination = [] } = await params;
  const category = categories.find(({ slug }) => slug === categorySlug);
  if (!category) notFound();

  const page = pagination.length === 0 ? 1 : Number(pagination[1]);
  if (pagination.length > 0 && (
    pagination.length !== 2 || pagination[0] !== "page" ||
    !Number.isSafeInteger(page) || page < 2 || String(page) !== pagination[1]
  )) notFound();

  const posts = getPostsByCategory(category.name);
  const totalPages = categoryPageCount(posts.length);
  if (page > totalPages) notFound();

  return { category, posts, page, totalPages };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, page } = await readCategory(params);

  return {
    title: page === 1 ? category.name : `${category.name} – ${page}페이지`,
    description: category.description,
    alternates: { canonical: categoryPageHref(category.slug, page) },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category, posts, page, totalPages } = await readCategory(params);
  const start = (page - 1) * categoryPageSize;
  const pagePosts = posts.slice(start, start + categoryPageSize);

  return (
    <main className="category-page">
      <nav className="breadcrumb" aria-label="경로">
        <Link href="/">홈</Link>
        <span className="breadcrumb__sep" aria-hidden="true">›</span>
        <span aria-current={page === 1 ? "page" : undefined}>{category.name}</span>
        {page > 1 && <span aria-current="page">{page}페이지</span>}
      </nav>
      <header className="category-page__header">
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </header>
      {pagePosts.length > 0 ? (
        <section className="home-section" aria-labelledby="category-posts-title">
          <h2 id="category-posts-title">전체 글 <span className="category-page__count">{posts.length}개</span></h2>
          <PostGrid posts={pagePosts} />
        </section>
      ) : (
        <p className="no-posts">아직 게시글이 없습니다.</p>
      )}
      {totalPages > 1 && (
        <nav className="pagination category-pagination" aria-label="카테고리 페이지 이동">
          {page > 1 && <Link className="pagination__btn" rel="prev" href={categoryPageHref(category.slug, page - 1)}>이전 페이지</Link>}
          <span aria-current="page">{page} / {totalPages} 페이지</span>
          {page < totalPages && <Link className="pagination__btn" rel="next" href={categoryPageHref(category.slug, page + 1)}>다음 페이지</Link>}
        </nav>
      )}
    </main>
  );
}
