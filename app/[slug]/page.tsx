import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPosts, getPostBySlug, getPostsByCategory } from "../../lib/fetchPosts";
import { getArticleSections } from "../../lib/articleSections";
import { commonThumbnail } from "../../lib/siteImages";
import RelatedPosts from "../../components/RelatedPosts";
import TutoringBanner from "../../components/TutoringBanner";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const posts = fetchPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "페이지를 찾을 수 없습니다" };
  }

  const baseUrl = "https://child-mind-lab-88rx.vercel.app";
  const url = `${baseUrl}/${slug}/`;

  return {
    title: post.title,
    description: post.summary,
    keywords: post.keywords,
    alternates: {
      canonical: `${baseUrl}/${slug}/`,
    },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url,
      siteName: "아이마음연구소",
      title: post.title,
      description: post.summary,
      images: [
        {
          url: commonThumbnail.src,
          width: commonThumbnail.width,
          height: commonThumbnail.height,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [commonThumbnail.src],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const categoryPosts = getPostsByCategory(post.category).map(({ slug, title, summary }) => ({
    slug, title, summary,
  }));
  const [intro, firstSection, secondSection] = getArticleSections(post.html);

  return (
      <main className="article-wrapper">
        <div className="article-container">
          {/* 브레드크럼 */}
          <nav className="breadcrumb" aria-label="경로">
            <Link href="/">홈</Link>
            <span className="breadcrumb__sep">›</span>
            <span>{post.category}</span>
            <span className="breadcrumb__sep">›</span>
            <span aria-current="page" className="breadcrumb__current">{post.title}</span>
          </nav>

          {/* 아티클 헤더 */}
          <header className="article-header">
            <span className="article-header__category">{post.category}</span>
            <h1 className="article-header__title">{post.title}</h1>
            {post.summary && (
              <p className="article-header__summary">{post.summary}</p>
            )}
          </header>

          {/* 본문 */}
          <article className="article-body">
            {intro && <div dangerouslySetInnerHTML={{ __html: intro }} />}
            <TutoringBanner placement="top" />
            {firstSection && <div dangerouslySetInnerHTML={{ __html: firstSection }} />}
            <TutoringBanner placement="middle" />
            {secondSection && <div dangerouslySetInnerHTML={{ __html: secondSection }} />}
          </article>
          <TutoringBanner placement="bottom" />
        </div>

        <RelatedPosts posts={categoryPosts} currentSlug={post.slug} />
      </main>
  );
}
