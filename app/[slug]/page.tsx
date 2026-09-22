import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPosts, getPostBySlug, getPostsByCategory } from "../../lib/fetchPosts";
import RelatedPosts from "../../components/RelatedPosts";

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
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: ["/og-image.png"],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const categoryPosts = getPostsByCategory(post.category);

  // 동적 메타데이터는 head에서 직접 처리
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/" className="site-header__logo">
            🌿 아이마음연구소
          </Link>
          <span className="site-header__subtitle">자녀 심리 · 육아 전문 정보</span>
        </div>
      </header>

      <main className="article-wrapper">
        <div className="article-container">
          {/* 브레드크럼 */}
          <nav className="breadcrumb" aria-label="경로">
            <Link href="/">홈</Link>
            <span className="breadcrumb__sep">›</span>
            <span>{post.category}</span>
            <span className="breadcrumb__sep">›</span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "200px",
              }}
            >
              {post.title}
            </span>
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
          <article
            className="article-body"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* 공정위 필수 문구 */}
          <p className="affiliate-disclosure">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </div>

        {/* 같은 카테고리의 다른 글 */}
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <RelatedPosts posts={categoryPosts} currentSlug={post.slug} />
        </div>
      </main>

      <footer className="site-footer">
        <p>© 2025 아이마음연구소. All rights reserved.</p>
        <p style={{ marginTop: "0.25rem" }}>
          자녀 심리 · 사춘기 육아 · 감정코칭 전문 블로그
        </p>
      </footer>
    </>
  );
}
