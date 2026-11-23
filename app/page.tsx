import Image from "next/image";
import Link from "next/link";
import { fetchPosts } from "../lib/fetchPosts";
import { commonThumbnail } from "../lib/siteImages";

export default function HomePage() {
  const posts = fetchPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <span className="home-hero__label">Child Mind Lab</span>
          <h1>아이의 마음을 이해하는<br />부모를 위한 공간</h1>
          <p>초등·사춘기 자녀의 심리부터 실전 대화법까지, 과학적 근거를 바탕으로 한 육아 정보를 전합니다.</p>
        </div>
        <Image
          className="home-hero__image"
          src={commonThumbnail.src}
          width={commonThumbnail.width}
          height={commonThumbnail.height}
          alt=""
          priority
        />
      </section>

      {categories.length > 0 && (
        <nav className="category-nav" aria-label="게시글 카테고리">
          {categories.map((category, index) => (
            <a key={category} href={`#category-${index + 1}`}>{category}</a>
          ))}
        </nav>
      )}

      {categories.map((category, index) => {
        const categoryPosts = posts.filter((post) => post.category === category);
        const sectionId = `category-${index + 1}`;

        return (
          <section className="home-section" id={sectionId} key={category} aria-labelledby={`${sectionId}-title`}>
            <h2 id={`${sectionId}-title`}>{category}</h2>
            <div className="post-grid">
              {categoryPosts.map((post, index) => (
                <Link key={`${post.slug}-${index}`} href={`/${post.slug}/`} className="post-card" prefetch={false}>
                  <div className="post-card__heading">
                    <div>
                      <span className="post-card__category">{post.category}</span>
                      <h3>{post.title}</h3>
                    </div>
                    <Image
                      className="post-card__thumbnail"
                      src={commonThumbnail.src}
                      width={commonThumbnail.width}
                      height={commonThumbnail.height}
                      alt=""
                    />
                  </div>
                  <p className="post-card__summary">{post.summary}</p>
                  <span className="post-card__more">자세히 읽기</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {posts.length === 0 && <p className="no-posts">게시글을 불러오는 중입니다...</p>}
    </main>
  );
}
