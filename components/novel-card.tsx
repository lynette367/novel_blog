import Link from "next/link";
import type { Novel } from "@/lib/novels";

type NovelCardProps = {
  novel: Novel;
};

export function NovelCard({ novel }: NovelCardProps) {
  return (
    <Link
      href={`/novels/${novel.slug}`}
      className="novel-card"
      data-category={novel.category}
      prefetch={false}
    >
      <div
        className="novel-cover"
        style={{ backgroundImage: `url('${novel.coverImage}')` }}
      >
        <span className="novel-category">{novel.category}</span>
      </div>
      <div className="novel-info">
        <h3 className="novel-title">{novel.title}</h3>
        <p className="novel-excerpt">{novel.excerpt}</p>
        <span className="read-btn">Read →</span>
      </div>
    </Link>
  );
}
