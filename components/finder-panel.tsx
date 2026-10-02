import Link from "next/link";
import { FINDER } from "@/lib/bl-recs";

const primary =
  "inline-flex items-center rounded-full bg-brand-pinkdeep px-5 py-2.5 text-sm font-bold text-brand-ink transition hover:bg-brand-pink";
const secondary =
  "inline-flex items-center rounded-full border border-brand-pinkdeep bg-white px-5 py-2.5 text-sm font-bold text-brand-ink transition hover:bg-brand-blush";

/**
 * Finder prompt for recommendation-cluster detail pages.
 *
 * The cluster page is already focused on the novels in that list, so this
 * panel keeps the CTA contextual: help the reader find an English version
 * of a novel they just discovered here.
 */
export function FinderPanel() {
  return (
    <section
      id="find-it"
      className="scroll-mt-24 rounded-3xl border border-card-border bg-card-bg p-6 shadow-[var(--card-shadow)] sm:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
        Want to read one of these?
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Found a Novel You Want to Read
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink/70">
        If you are intersted in any of the novels in this list, donate {FINDER.price} on Ko-fi and put the novel&apos;s title in your
        message. We&apos;ll help you locate an English version.
      </p>

      <div className="mt-5">
        <a
          href={FINDER.payUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={primary}
        >
          Donate {FINDER.price} on Ko-fi →
        </a>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-card-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        {/* 左侧文字容器：在宽屏下占 2/3 宽度，内部 p 标签上下平铺 */}
        <div className="flex flex-col gap-1 sm:w-2/3">
          <p className="text-xs leading-relaxed text-brand-ink/50">
            Can&apos;t remember the title? A character name, plot detail, screenshot,
            or anything else you remember can help.
          </p>
          <p className="text-xs leading-relaxed text-brand-ink/40">
            Unless the novel is already on our recommendation list, please email us the details first.
            We will review the clues and let you know if we can track it down before you make a donation.
          </p>
        </div>

        {/* 右侧按钮：自动挤到最右边 */}
        <Link href="/contact" className={`${secondary} shrink-0 text-xs no-underline`}>
          Email us the details
        </Link>
      </div>

    </section>
  );
}
