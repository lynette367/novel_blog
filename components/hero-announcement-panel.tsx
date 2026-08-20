import Link from "next/link";

export function HeroAnnouncementPanel() {
  return (
    <aside className="hero-announcement-panel">
      {/* Header */}
      <div className="hero-announcement-header">
        <span className="hero-announcement-icon">✦</span>
        <h2 className="hero-announcement-heading">Dear Readers</h2>
      </div>

      {/* Body */}
      <div className="hero-announcement-body">
        <p className="hero-announcement-paragraph">
          Due to limited staffing and resources, we have released all raw machine-translated (Raw MTL) chapters completely for free so you can follow the plot without waiting!
        </p>

        <p className="hero-announcement-paragraph">
          Our team is working through each novel, chapter by chapter, to create a meticulously crafted, refined version. Currently, we are focusing our efforts on producing the premium, refined chapters for Big Brother.
        </p>

        <ul className="hero-announcement-list">
          <li>
            <span className="hero-announcement-bullet">📖</span>
            Raw MTL chapters available instantly for all novels
          </li>
          <li>
            <span className="hero-announcement-bullet">✨</span>
            Refined chapters added daily, starting from Ch. 1
          </li>
          <li>
            <span className="hero-announcement-bullet">🔒</span>
            No abandoned series — ever
          </li>
        </ul>

        <p className="hero-announcement-paragraph">
          Spot a translation issue or want to request priority polishing for a
          novel you love? We read every message.
        </p>
      </div>

      {/* CTA */}
      <div className="hero-announcement-footer">
        <Link href="/contact" className="hero-announcement-cta">
          Send a Message →
        </Link>
      </div>
    </aside>
  );
}
