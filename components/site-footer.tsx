import siteConfig from "@/site.config";
import Link from "next/link";

export function SiteFooter() {
  const { buyMeACoffee, kofi, patreon } = siteConfig.supportLinks;

  return (
    <footer className="bg-[#2b1f2d] text-[#f7c6d9] py-12 px-6 mt-20">
      <div className="max-w-6xl mx-auto text-center">
        <p className="mb-4 text-sm">
          &copy; 2026 Cross The Line. All translations published with respect for original authors.
        </p>
        <p className="text-xs opacity-70 mt-4 mb-3">
          Content Warning: Stories may contain mature themes. Reader discretion advised.
        </p>
        <p className="text-sm">
          Enjoying the stories? Support us on{" "}
          {buyMeACoffee && (
            <a
              href={buyMeACoffee}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f7c6d9] underline underline-offset-2 hover:text-[#ffe3ef] transition-colors"
            >
              Buy Me a Coffee
            </a>
          )}
          {buyMeACoffee && kofi && ", "}
          {kofi && (
            <a
              href={kofi}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f7c6d9] underline underline-offset-2 hover:text-[#ffe3ef] transition-colors"
            >
              Ko-fi
            </a>
          )}
          {((buyMeACoffee && patreon) || (kofi && patreon)) && ", or "}
          {patreon && (
            <a
              href={patreon}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f7c6d9] underline underline-offset-2 hover:text-[#ffe3ef] transition-colors"
            >
              Patreon
            </a>
          )}
          .
        </p>
        <div className="flex justify-center mt-6">
          <Link
            href="/contact"
            className="text-[#f7c6d9] no-underline hover:text-[#ffe3ef] transition-colors text-sm hover:underline underline-offset-4"
          >
            Contact &amp; About Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
