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
        Found a Novel You Want to Read?
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink/70">
        If one of the novels in this list caught your attention but you can&apos;t
        find an English version, we can help you track it down.
      </p>

      <div className="mt-6 border-t border-card-border pt-6">
        <h3 className="font-bold">Want us to look?</h3>

        <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
          Donate {FINDER.price} on Ko-fi and put the novel&apos;s title in your
          message. We&apos;ll research it and see whether we can locate a
          legitimate English reading or purchase option.
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
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-card-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-brand-ink/50">
          Can&apos;t remember the title? A character name, plot detail, screenshot,
          or anything else you remember can help.
        </p>

        <Link href="/contact" className={`${secondary} shrink-0 text-xs no-underline`}>
          Email us the details
        </Link>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-brand-ink/40">
        We can&apos;t promise that every novel has a legitimate English release or
        that we&apos;ll be able to find one. This is a reader-supported search,
        not a translation or publishing request.
      </p>
    </section>
  );
}
