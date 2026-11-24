import Image from "next/image";
import Link from "next/link";
import PostGrid from "../components/PostGrid";
import { categories, categoryPageHref } from "../lib/categories";
import { getPostsByCategory } from "../lib/fetchPosts";
import { commonThumbnail } from "../lib/siteImages";

const homePostsPerCategory = 10;

export default function HomePage() {
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

      <nav className="category-nav" aria-label="게시글 카테고리">
        {categories.map(({ name, slug }, index) => (
          <a key={slug} href={`#category-${index + 1}`}>{name}</a>
        ))}
      </nav>

      {categories.map(({ name, slug }, index) => {
        const posts = getPostsByCategory(name).slice(0, homePostsPerCategory);
        const sectionId = `category-${index + 1}`;

        return (
          <section className="home-section" id={sectionId} key={slug} aria-labelledby={`${sectionId}-title`}>
            <h2 id={`${sectionId}-title`}>{name}</h2>
            {posts.length > 0 ? <PostGrid posts={posts} /> : <p className="no-posts">아직 게시글이 없습니다.</p>}
            <div className="home-section__footer">
              <Link className="category-more" href={categoryPageHref(slug)} aria-label={`${name} 더 많은 글 보기`}>
                더 많은 글 보기 →
              </Link>
            </div>
          </section>
        );
      })}
    </main>
  );
}
