import siteConfig from "@/site.config";

export function SiteFooter() {
  const { buyMeACoffee, kofi, patreon } = siteConfig.supportLinks;

  return (
    <footer>
      <div className="footer-content">
        <p>&copy; 2026 Cross The Line. All translations published with respect for original authors.</p>
        <p style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "1rem" }}>
          Content Warning: Stories may contain mature themes. Reader discretion advised.
        </p>
        <p className="footer-support-line">
          Enjoying the stories? Support us on{" "}
          {buyMeACoffee && (
            <a href={buyMeACoffee} target="_blank" rel="noopener noreferrer">
              Buy Me a Coffee
            </a>
          )}
          {buyMeACoffee && kofi && ", "}
          {kofi && (
            <a href={kofi} target="_blank" rel="noopener noreferrer">
              Ko-fi
            </a>
          )}
          {((buyMeACoffee && patreon) || (kofi && patreon)) && ", or "}
          {patreon && (
            <a href={patreon} target="_blank" rel="noopener noreferrer">
              Patreon
            </a>
          )}.
        </p>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Translation Policy</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
