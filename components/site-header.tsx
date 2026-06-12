import Link from "next/link";
import type { Route } from "next";

type HeaderProps = {
  activePath?: "home" | "novels" | "join";
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
  { href: { pathname: "/" as Route, hash: "support" }, label: "Support", key: "home", fragment: true },
  { href: "/join" as Route, label: "Join Us", key: "join" },
];

export function SiteHeader({ activePath = "home" }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo">
          Cross The Line
        </Link>
        <nav className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={link.key === activePath && !link.fragment ? "active" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
