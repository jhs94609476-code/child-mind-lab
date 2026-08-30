"use client";

import Link from "next/link";
import { useState } from "react";

interface RelatedPost {
  slug: string;
  title: string;
  summary: string;
}

const POSTS_PER_PAGE = 5;

interface RelatedPostsProps {
  posts: RelatedPost[];
  currentSlug: string;
}

export default function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const filteredPosts = posts.filter((p) => p.slug !== currentSlug);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);

  if (filteredPosts.length === 0) return null;

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // 페이지 번호 배열 생성 (최대 5개 표시)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <section className="related-posts">
      <h2 className="related-posts__title">같은 카테고리의 다른 글</h2>

      <ul className="related-list">
        {pagePosts.map((post, idx) => (
          <li key={post.slug} className="related-item">
            <Link href={`/${post.slug}/`}>
              <span className="related-item__num">
                {String(startIndex + idx + 1).padStart(2, "0")}
              </span>
              <span className="related-item__text">
                <span className="related-item__title">{post.title}</span>
                <span className="related-item__summary">{post.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <nav className="pagination" aria-label="관련 글 페이지네이션">
          {/* 이전 버튼 */}
          <button
            className="pagination__btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            ‹ 이전
          </button>

          {/* 페이지 번호 */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={`pagination__btn${currentPage === page ? " pagination__btn--active" : ""}`}
              onClick={() => setCurrentPage(page)}
              aria-label={`${page}페이지`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          {/* 다음 버튼 */}
          <button
            className="pagination__btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            다음 ›
          </button>
        </nav>
      )}
    </section>
  );
}
