import Link from "next/link";
import { fetchPosts } from "../lib/fetchPosts";

export default function HomePage() {
  const posts = fetchPosts();

  // 카테고리별 그룹핑
  const categories = Array.from(new Set(posts.map((p) => p.category)));

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

      <main className="home-page">
        <section className="home-hero">
          <span className="home-hero__label">Child Mind Lab</span>
          <h1 className="home-hero__title">
            아이의 마음을 이해하는<br />
            부모를 위한 공간
          </h1>
          <p className="home-hero__desc">
            초등·사춘기 자녀의 심리부터 실전 대화법까지,
            과학적 근거를 바탕으로 한 육아 정보를 전합니다.
          </p>
        </section>

        {categories.map((cat) => {
          const catPosts = posts.filter((p) => p.category === cat);
          return (
            <section key={cat} style={{ marginBottom: "3rem" }}>
              <h2 className="home-section-title">📂 {cat}</h2>
              <div className="post-grid">
                {catPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/${post.slug}/`}
                    className="post-card"
                  >
                    <span className="post-card__category">{post.category}</span>
                    <span className="post-card__title">{post.title}</span>
                    <span className="post-card__summary">{post.summary}</span>
                    <span className="post-card__arrow">자세히 읽기 →</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {posts.length === 0 && (
          <div className="no-posts">
            <p>게시글을 불러오는 중입니다...</p>
          </div>
        )}
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
