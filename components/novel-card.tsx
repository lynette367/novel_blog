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
        <span className="novel-category">
          {novel.tags && novel.tags.length > 0 ? novel.tags[0] : novel.category}
        </span>
      </div>
      <div className="novel-info">
        <h3 className="novel-title">{novel.title}</h3>
        <p className="novel-excerpt">{novel.excerpt}</p>

        {novel.tags && novel.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {novel.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  background: '#f5f0e8',
                  color: '#8b7355',
                  borderRadius: '12px',
                  fontWeight: 600
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <span className="read-btn">Read →</span>
      </div>
    </Link>
  );
}
