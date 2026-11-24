import Image from "next/image";
import Link from "next/link";
import type { Post } from "../lib/fetchPosts";
import { commonThumbnail } from "../lib/siteImages";

export default function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="post-grid">
      {posts.map((post, index) => (
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
  );
}
