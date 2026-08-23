import Link from "next/link";
import type { Route } from "next";

type HeaderProps = {
  activePath?: "home" | "novels" | "contact";
};

type HeaderLink = {
  href: Route | { pathname: Route; hash?: string };
  label: string;
  key: HeaderProps["activePath"];
  fragment?: boolean;
};

const navLinks: HeaderLink[] = [
  { href: "/" as Route, label: "Home", key: "home" },
  { href: "/novels" as Route, label: "Novels", key: "novels" },
  { href: "/contact" as Route, label: "Contact", key: "contact" },
];

export function SiteHeader({ activePath = "home" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#f7c6d9] shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-semibold tracking-widest text-[#2b1f2d] font-serif no-underline hover:text-[#e499b3] transition-colors"
        >
          Cross The Line
        </Link>
        <nav className="flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-semibold text-sm transition-colors no-underline ${
                link.key === activePath && !link.fragment
                  ? "text-[#e499b3] border-b-2 border-[#e499b3] pb-0.5"
                  : "text-[#c87f9b] hover:text-[#2b1f2d]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
