import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

export const metadata: Metadata = {
  title: "Join Our Team | Proofreader Recruitment",
  description:
    "Cross The Line is looking for passionate proofreaders to help bring Chinese danmei novels to English readers. Join our translation team today.",
  alternates: {
    canonical: absoluteUrl("/join"),
  },
  openGraph: {
    title: `Join Our Team | ${SITE_NAME}`,
    description:
      "We're looking for dedicated proofreaders who love danmei. Apply to join the Cross The Line translation team.",
    url: absoluteUrl("/join"),
    siteName: SITE_NAME,
  },
};

const requirements = [
  "Strong command of English grammar, punctuation, and style",
  "Familiarity with Chinese danmei / BL fiction conventions and tropes",
  "Ability to meet regular deadlines and communicate proactively",
  "A keen eye for consistency in character names, honorifics, and terminology",
  "Respectful, collaborative attitude — we're a small team and kindness matters",
];

const niceToHave = [
  "Reading knowledge of Chinese (Simplified or Traditional)",
  "Prior experience proofreading or editing creative fiction",
  "Active reader of danmei or other BL literature",
];

export default function JoinPage() {
  return (
    <>
      <SiteHeader activePath="join" />

      <section className="join-hero">
        <div className="join-hero-inner">
          <p className="join-eyebrow">Now Recruiting</p>
          <h1>Join Cross The Line</h1>
          <p className="join-subtitle">
            We're a small, passionate team bringing Chinese danmei stories to
            English readers. If you love these stories and have a sharp eye for
            language, we'd love to hear from you.
          </p>
        </div>
      </section>

      <main className="join-main">

        {/* Open Role */}
        <section className="join-section">
          <div className="role-card">
            <div className="role-header">
              <span className="role-badge">Open Position</span>
              <h2 className="role-title">Proofreader</h2>
              <p className="role-type">Volunteer · Remote · Flexible Hours</p>
            </div>

            <div className="role-body">
              <p className="role-description">
                Our proofreaders are the last line of defence before a chapter
                goes live. You'll work closely with translators to catch typos,
                awkward phrasing, inconsistent terminology, and anything that
                might pull a reader out of the story.
              </p>

              <div className="requirements-block">
                <h3>What we're looking for</h3>
                <ul className="requirement-list">
                  {requirements.map((req) => (
                    <li key={req}>
                      <span className="req-marker">✦</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="requirements-block nice-to-have">
                <h3>Nice to have</h3>
                <ul className="requirement-list">
                  {niceToHave.map((item) => (
                    <li key={item}>
                      <span className="req-marker">◇</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What to expect */}
        <section className="join-section">
          <h2 className="section-heading">What to Expect</h2>
          <div className="expect-grid">
            <div className="expect-card">
              <div className="expect-icon">📖</div>
              <h3>Meaningful work</h3>
              <p>
                Every chapter you polish reaches thousands of readers. Your
                contribution directly shapes how a story is experienced.
              </p>
            </div>
            <div className="expect-card">
              <div className="expect-icon">🕰️</div>
              <h3>Flexible commitment</h3>
              <p>
                We work around real lives. Communicate your availability and
                we'll find a rhythm that works — no crunch, no pressure.
              </p>
            </div>
            <div className="expect-card">
              <div className="expect-icon">🤝</div>
              <h3>A small, warm team</h3>
              <p>
                We're readers first. Expect a collaborative, low-drama
                environment where feedback is kind and everyone's voice counts.
              </p>
            </div>
          </div>
        </section>

        {/* Apply */}
        <section className="join-section apply-section" id="apply">
          <div className="apply-card">
            <h2>Ready to Apply?</h2>
            <p>
              Send us a short introduction — who you are, why you love danmei,
              and any relevant experience. No formal CV required; we care more
              about enthusiasm and attention to detail.
            </p>
            <div className="apply-buttons">
              <span
                className="apply-btn apply-btn--primary"
              >
                ✉ contact@crosstheline.press
              </span>
              <span className="apply-btn apply-btn--secondary">
                wechat: shadowy43
              </span>
            </div>
            <p className="apply-note">
              We read every application and reply within two weeks.
            </p>
          </div>
        </section>
      </main>

      <style>{`
        /* ── Hero ── */
        .join-hero {
          background: linear-gradient(160deg, #2c1f14 0%, #3d2b1a 60%, #2c1f14 100%);
          padding: 5rem 1.5rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .join-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(180,140,80,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .join-hero-inner {
          position: relative;
          max-width: 680px;
          margin: 0 auto;
        }
        .join-eyebrow {
          font-family: Georgia, serif;
          font-size: 0.8rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c9a96e;
          margin: 0 0 1.2rem;
        }
        .join-hero h1 {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: normal;
          color: #f5ede0;
          margin: 0 0 1.2rem;
          letter-spacing: 1px;
        }
        .join-subtitle {
          color: #c4b49a;
          font-size: 1.05rem;
          line-height: 1.7;
          margin: 0;
        }

        /* ── Layout ── */
        .join-main {
          max-width: 820px;
          margin: 0 auto;
          padding: 3rem 1.5rem 4rem;
        }
        .join-section {
          margin-bottom: 3.5rem;
        }
        .section-heading {
          font-family: Georgia, serif;
          font-size: 1.4rem;
          font-weight: normal;
          color: #3d2b1a;
          margin: 0 0 1.5rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid #d4b896;
        }

        /* ── Role Card ── */
        .role-card {
          border: 1px solid #d4b896;
          border-radius: 4px;
          overflow: hidden;
          background: #fdf8f2;
        }
        .role-header {
          background: #3d2b1a;
          padding: 1.8rem 2rem;
        }
        .role-badge {
          display: inline-block;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a96e;
          border: 1px solid #c9a96e;
          padding: 0.25rem 0.7rem;
          border-radius: 2px;
          margin-bottom: 0.8rem;
        }
        .role-title {
          font-family: Georgia, serif;
          font-size: 1.8rem;
          font-weight: normal;
          color: #f5ede0;
          margin: 0 0 0.4rem;
        }
        .role-type {
          color: #a8926e;
          font-size: 0.9rem;
          margin: 0;
        }
        .role-body {
          padding: 2rem;
        }
        .role-description {
          color: #4a3728;
          line-height: 1.75;
          margin: 0 0 2rem;
          font-size: 1rem;
        }
        .requirements-block {
          margin-bottom: 1.8rem;
        }
        .requirements-block h3 {
          font-family: Georgia, serif;
          font-size: 1rem;
          font-weight: normal;
          color: #3d2b1a;
          margin: 0 0 0.8rem;
          letter-spacing: 0.03em;
        }
        .nice-to-have h3 {
          color: #7a6250;
        }
        .requirement-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .requirement-list li {
          display: flex;
          gap: 0.75rem;
          color: #4a3728;
          line-height: 1.6;
          font-size: 0.95rem;
        }
        .req-marker {
          color: #c9a96e;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .nice-to-have .req-marker {
          color: #a8926e;
        }

        /* ── Expect Grid ── */
        .expect-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.2rem;
        }
        .expect-card {
          background: #fdf8f2;
          border: 1px solid #d4b896;
          border-radius: 4px;
          padding: 1.5rem;
        }
        .expect-icon {
          font-size: 1.6rem;
          margin-bottom: 0.8rem;
        }
        .expect-card h3 {
          font-family: Georgia, serif;
          font-size: 1rem;
          font-weight: normal;
          color: #3d2b1a;
          margin: 0 0 0.5rem;
        }
        .expect-card p {
          color: #6b5240;
          font-size: 0.9rem;
          line-height: 1.65;
          margin: 0;
        }

        /* ── Apply ── */
        .apply-section { margin-bottom: 1rem; }
        .apply-card {
          background: #3d2b1a;
          border-radius: 4px;
          padding: 2.5rem 2rem;
          text-align: center;
        }
        .apply-card h2 {
          font-family: Georgia, serif;
          font-size: 1.6rem;
          font-weight: normal;
          color: #f5ede0;
          margin: 0 0 1rem;
        }
        .apply-card > p {
          color: #c4b49a;
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto 1.8rem;
        }
        .apply-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 1.2rem;
        }
        .apply-btn {
          display: inline-block;
          padding: 0.75rem 1.8rem;
          border-radius: 50px;
          font-size: 0.95rem;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .apply-btn:hover { opacity: 0.85; }
        .apply-btn--primary {
          background: #c9a96e;
          color: #2c1f14;
          font-weight: 600;
        }
        .apply-btn--secondary {
          background: transparent;
          color: #c9a96e;
          border: 1.5px solid #c9a96e;
        }
        .apply-note {
          color: #8a7560;
          font-size: 0.82rem;
          margin: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .role-body { padding: 1.5rem; }
          .apply-card { padding: 2rem 1.2rem; }
        }
      `}</style>

      <SiteFooter />
    </>
  );
}
