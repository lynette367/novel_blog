import Link from "next/link";
import type { Route } from "next";
import { loreArticles, loreArticlePath } from "@/lib/lore/articles";

export function LoreHero({
  kicker,
  title,
  description,
  cta,
}: {
  kicker: string;
  title: React.ReactNode;
  description: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="bg-gradient-to-br from-[#2b1f2d] via-[#3a2030] to-[#2b1f2d] border-b border-[#f7c6d9]/20">
      <div className="page-shell py-14 sm:py-16 text-center">
        <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#f4a7b9]/70 mb-4">
          {kicker}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f7c6d9] font-normal leading-tight max-w-4xl mx-auto mb-4">
          {title}
        </h1>
        <p className="text-[#f7c6d9]/75 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6">
          {description}
        </p>
        {cta && (
          <a
            href={cta.href}
            className="inline-flex items-center gap-2 text-[#f4a7b9] border border-[#f4a7b9]/40 px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#f4a7b9]/10 transition-colors no-underline"
          >
            {cta.label}
          </a>
        )}
      </div>
    </div>
  );
}

export function LoreBreadcrumb({ currentLabel }: { currentLabel: string }) {
  return (
    <nav
      className="flex flex-wrap gap-1.5 items-center text-xs text-[#9c3f5d]/70 mb-8"
      aria-label="Breadcrumb"
    >
      <Link
        href={"/" as Route}
        className="hover:text-[#9c3f5d] transition-colors no-underline text-inherit"
      >
        Home
      </Link>
      <span aria-hidden="true">›</span>
      <span>Lore</span>
      <span aria-hidden="true">›</span>
      <span className="text-[#9c3f5d] font-medium" aria-current="page">
        {currentLabel}
      </span>
    </nav>
  );
}

export type LoreTocItem = {
  href: string;
  label: string;
  number?: string;
};

export function LoreToc({
  items,
  variant = "pills",
  heading = "On this page",
}: {
  items: LoreTocItem[];
  variant?: "pills" | "list";
  heading?: string;
}) {
  if (variant === "list") {
    return (
      <nav
        aria-label={heading}
        className="rounded-xl border border-[#f7c6d9]/60 bg-white/85 p-5 sm:p-6 mb-10"
      >
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#9c3f5d] mb-3">
          {heading}
        </p>
        <ol className="list-none p-0 m-0 divide-y divide-[#f7c6d9]/40">
          {items.map((item, idx) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group flex items-baseline gap-3 py-2.5 text-sm sm:text-base text-[#2b1f2d] hover:text-[#9c3f5d] transition-colors no-underline"
              >
                <span className="font-mono text-xs font-semibold text-[#f4a7b9] shrink-0">
                  {item.number ?? String(idx + 1).padStart(2, "0")}
                </span>
                <span className="font-serif leading-snug group-hover:underline underline-offset-4">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label={heading} className="mb-10">
      <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#9c3f5d]/75 mb-2.5">
        {heading}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-xs font-semibold text-[#9c3f5d] border border-[#f7c6d9] bg-[#fff9f2] px-3 py-1.5 rounded-full hover:bg-[#f7c6d9]/30 transition-colors no-underline"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function LoreReaderNote({
  title = "Reader Note",
  children,
  dark = false,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <section
      className={
        dark
          ? `rounded-lg px-4 py-3 bg-[#f4a7b9]/8 border border-[#f4a7b9]/15 ${className}`
          : `rounded-xl px-5 py-4 bg-[#fff9f2] border border-[#f7c6d9]/60 border-l-4 border-l-[#f4a7b9] ${className}`
      }
    >
      <p
        className={`text-xs font-bold tracking-[0.18em] uppercase ${
          dark ? "text-[#f4a7b9]/60" : "text-[#9c3f5d]"
        }`}
      >
        {title}
      </p>
      <div
        className={`text-sm leading-relaxed mt-1.5 ${
          dark ? "text-[#f7c6d9]/85" : "text-[#2b1f2d]"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

export function LoreSectionHeading({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#9c3f5d] mb-1">
        {kicker}
      </p>
      <h2
        id={id}
        className="font-serif text-2xl sm:text-[1.65rem] text-[#2b1f2d] font-normal leading-snug mb-3 scroll-mt-24"
      >
        {title}
      </h2>
      {children && (
        <div className="text-sm text-[#7d6f67] leading-relaxed max-w-2xl">
          {children}
        </div>
      )}
    </div>
  );
}

type LoreFigureProps = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  visual?: React.ReactNode;
  caption?: string;
  className?: string;
};

export function LoreFigure({
  src,
  alt,
  width,
  height,
  visual,
  caption,
  className = "",
}: LoreFigureProps) {
  return (
    <figure
      className={`my-8 rounded-2xl overflow-hidden border border-[#f7c6d9]/60 bg-[#fff9f2] ${className}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          width={width}
          height={height}
          loading="lazy"
          className="w-full h-auto block max-w-full object-cover"
        />
      ) : (
        <div className="p-4 sm:p-6 bg-white/70">{visual}</div>
      )}
      {caption && (
        <figcaption className="px-5 py-3 text-xs sm:text-sm text-[#7d6f67] leading-relaxed border-t border-[#f7c6d9]/40 bg-[#fff9f2]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export type LoreSidebarLink = {
  href: Route;
  title: string;
  subtitle?: string;
};

export function LoreSidebar({
  currentSlug,
  relatedLinks,
}: {
  currentSlug: string;
  relatedLinks?: LoreSidebarLink[];
}) {
  return (
    <aside
      aria-label="Explore Cross The Line"
      className="lg:sticky lg:top-24 border-t border-[#f7c6d9]/50 pt-8 lg:border-t-0 lg:pt-0 lg:border-l lg:border-[#f7c6d9]/50 lg:pl-7 space-y-8"
    >
      <div>
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#9c3f5d] mb-3">
          Explore Cross The Line
        </h2>
        <ul className="list-none p-0 m-0 divide-y divide-[#f7c6d9]/40">
          <li className="py-2.5 first:pt-0 last:pb-0">
            <Link
              href={"/novels/" as Route}
              className="group flex items-start justify-between gap-2 no-underline"
            >
              <span className="min-w-0">
                <span className="block font-serif text-sm font-medium text-[#2b1f2d] group-hover:text-[#9c3f5d] transition-colors">
                  Novel Library
                </span>
                <span className="block text-xs text-[#7d6f67] leading-relaxed mt-0.5">
                  Read translated Chinese danmei &amp; BL web novels
                </span>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 text-sm text-[#f4a7b9] transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </li>
          <li className="py-2.5 first:pt-0 last:pb-0">
            <Link
              href={"/bl-recs/" as Route}
              className="group flex items-start justify-between gap-2 no-underline"
            >
              <span className="min-w-0">
                <span className="block font-serif text-sm font-medium text-[#2b1f2d] group-hover:text-[#9c3f5d] transition-colors">
                  BL Recommendations
                </span>
                <span className="block text-xs text-[#7d6f67] leading-relaxed mt-0.5">
                  Curated danmei guides by trope &amp; theme
                </span>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 text-sm text-[#f4a7b9] transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#9c3f5d] mb-3">
          Lore &amp; Cultural Analysis
        </h2>
        <ul className="list-none p-0 m-0 divide-y divide-[#f7c6d9]/40">
          {loreArticles.map((article) => {
            const isCurrent = article.slug === currentSlug;
            if (isCurrent) {
              return (
                <li
                  key={article.slug}
                  aria-current="page"
                  className="py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="border-l-2 border-[#f4a7b9] pl-3">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#9c3f5d]">
                      Current guide
                    </span>
                    <span className="block font-serif text-sm font-medium text-[#2b1f2d] leading-snug mt-0.5">
                      {article.shortTitle}
                    </span>
                    <span className="block text-xs text-[#7d6f67] leading-relaxed mt-0.5">
                      {article.category}
                    </span>
                  </div>
                </li>
              );
            }

            return (
              <li
                key={article.slug}
                className="py-2.5 first:pt-0 last:pb-0"
              >
                <Link
                  href={`${loreArticlePath(article.slug)}/` as Route}
                  className="group flex items-start justify-between gap-2 no-underline"
                >
                  <span className="min-w-0">
                    <span className="block font-serif text-sm font-medium text-[#2b1f2d] leading-snug group-hover:text-[#9c3f5d] transition-colors">
                      {article.shortTitle}
                    </span>
                    <span className="block text-xs text-[#7d6f67] leading-relaxed mt-0.5">
                      {article.category}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-sm text-[#f4a7b9] transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {relatedLinks && relatedLinks.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#9c3f5d] mb-3">
            Related Reading
          </h2>
          <ul className="list-none p-0 m-0 divide-y divide-[#f7c6d9]/40">
            {relatedLinks.map((item) => (
              <li key={item.href} className="py-2.5 first:pt-0 last:pb-0">
                <Link
                  href={item.href}
                  className="group flex items-start justify-between gap-2 no-underline"
                >
                  <span className="min-w-0">
                    <span className="block font-serif text-sm font-medium text-[#2b1f2d] leading-snug group-hover:text-[#9c3f5d] transition-colors">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="block text-xs text-[#7d6f67] leading-relaxed mt-0.5">
                        {item.subtitle}
                      </span>
                    )}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-sm text-[#f4a7b9] transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

export function LorePageLayout({
  currentSlug,
  breadcrumbLabel,
  hero,
  relatedLinks,
  children,
}: {
  currentSlug: string;
  breadcrumbLabel: string;
  hero: React.ReactNode;
  relatedLinks?: LoreSidebarLink[];
  children: React.ReactNode;
}) {
  return (
    <>
      {hero}
      <main className="page-shell py-10">
        <LoreBreadcrumb currentLabel={breadcrumbLabel} />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_272px] gap-10 xl:gap-12 items-start">
          <div className="min-w-0">{children}</div>
          <LoreSidebar currentSlug={currentSlug} relatedLinks={relatedLinks} />
        </div>
      </main>
    </>
  );
}
