import Link from "next/link";
import Image from "next/image";
import type { Novel } from "@/lib/novels";

type NovelCardProps = {
  novel: Novel;
  priority?: boolean; // pass priority={true} for above-the-fold cards
};

export function NovelCard({ novel, priority = false }: NovelCardProps) {
  return (
    <Link
      href={`/novels/${novel.slug}`}
      className="novel-card"
      data-category={novel.category}
      prefetch={false}
    >
      <div className="novel-cover">
        <Image
          src={novel.coverImage}
          alt={novel.coverImageAlt || `Cover image for ${novel.title} - English Translation`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          priority={priority}
          title={`Read ${novel.title} English Translation`}
        />
        <span className="novel-category">
          {novel.tags && novel.tags.length > 0 ? novel.tags[0] : novel.category}
        </span>
      </div>
      <div className="novel-info">
        <h3 className="novel-title">{novel.title}</h3>
        <p className="novel-excerpt">{novel.excerpt}</p>
        <span className="read-btn">Read →</span>
      </div>
    </Link>
  );
}
