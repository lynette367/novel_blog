import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

export const metadata: Metadata = {
  title: `Contact Us & Recruitment | ${SITE_NAME}`,
  description:
    "Get in touch with Cross The Line for general inquiries, feedback, typo reports, or apply to join our translation and proofreading team.",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
  openGraph: {
    title: `Contact Us & Recruitment | ${SITE_NAME}`,
    description:
      "Get in touch with Cross The Line for general inquiries, feedback, typo reports, or apply to join our translation and proofreading team.",
    url: absoluteUrl("/contact"),
    siteName: SITE_NAME,
  },
};

const requirements = [
  "Strong command of English grammar, punctuation, and literary style",
  "Familiarity with Chinese Danmei / BL fiction conventions and tropes",
  "Ability to meet regular deadlines and communicate proactively",
  "A keen eye for consistency in character names, honorifics, and terminology",
  "Respectful, collaborative attitude — we're a small, friendly team",
];

const niceToHave = [
  "Reading proficiency in Chinese (Simplified or Traditional)",
  "Prior experience proofreading or editing web fiction",
  "Enthusiastic reader of Danmei or other BL literature",
];

export default function ContactPage() {
  return (
    <>
      <SiteHeader activePath="contact" />

      {/* Hero Header */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <p className="contact-eyebrow">Get In Touch</p>
          <h1>Contact Us</h1>
          <p className="contact-subtitle">
            Have a question, noticed a typo, want to collaborate, or interested in
            joining our translation team? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <main className="contact-main">
        {/* ── TOP SECTION: General Contact (邮箱、Discord、联系表单) ── */}
        <section className="contact-section">
          <div className="section-header">
            <h2 className="section-title">General Inquiries & Feedback</h2>
            <p className="section-desc">
              Reach out to us directly via email for any inquiries or typo reports.
            </p>
          </div>

          {/* Quick Contact Cards (Two cards side by side) */}
          <div className="contact-cards">
            <div className="contact-card">
              <div className="card-icon">✉️</div>
              <div className="card-info">
                <h3>Official Email</h3>
                <p>For general questions, feedback, and collaboration</p>
                <a
                  href="mailto:contact@crosstheline.press"
                  className="contact-link"
                >
                  contact@crosstheline.press
                </a>
              </div>
            </div>

            <div className="contact-card">
              <div className="card-icon">🐛</div>
              <div className="card-info">
                <h3>Report an Issue / Typo</h3>
                <p>Found a broken link or typo? Let us know so we can fix it quickly.</p>
                <span className="contact-text">
                  contact@crosstheline.press
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="section-divider" />

        {/* ── BOTTOM SECTION: Join Us / Recruitment (加入我们/招募) ── */}
        <section className="contact-section join-section" id="join-us">
          <div className="section-header text-center">
            <h2 className="section-title">Join US</h2>
            <p className="section-desc">
              We are actively looking for passionate individuals to help bring Chinese Danmei novels to English readers worldwide!
            </p>
          </div>

          {/* Role Card */}
          <div className="role-card">
            <div className="role-header">
              <div className="role-meta">
                <span className="role-badge-open">✦ Now Hiring</span>
                <span className="role-type">Volunteer · Remote · Flexible Hours</span>
              </div>
              <h3 className="role-title">Editors &amp; Proofreaders</h3>
            </div>

            <div className="role-body">
              <p className="role-description">
                Our proofreaders and editors are the vital polish layer before chapters go live. You&apos;ll work closely with translators to fix typos, refine prose flow, ensure term consistency, and enhance the reader&apos;s immersion.
              </p>

              <div className="requirements-grid">
                <div className="requirements-block">
                  <h4>Key Requirements</h4>
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
                  <h4>Nice to Have</h4>
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

              <div className="apply-callout">
                <div className="apply-callout-content">
                  <h4>Ready to Apply?</h4>
                  <p>
                    Send an email to <strong>contact@crosstheline.press</strong> with the subject line <code>[Proofreader Application] Your Name</code>. Tell us a bit about yourself, why you love Danmei, and any relevant experience!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        /* ── Hero ── */
        .contact-hero {
          background: linear-gradient(160deg, #2c1f14 0%, #3d2b1a 60%, #2c1f14 100%);
          padding: 4.5rem 1.5rem 3.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .contact-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(180,140,80,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .contact-hero-inner {
          position: relative;
          max-width: 680px;
          margin: 0 auto;
        }
        .contact-eyebrow {
          font-family: Georgia, serif;
          font-size: 0.8rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c9a96e;
          margin: 0 0 1.2rem;
        }
        .contact-hero h1 {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          font-weight: normal;
          color: #f5ede0;
          margin: 0 0 1.2rem;
          letter-spacing: 1px;
        }
        .contact-subtitle {
          color: #c4b49a;
          font-size: 1.05rem;
          line-height: 1.7;
          margin: 0;
        }

        /* ── Layout ── */
        .contact-main {
          max-width: 1040px;
          margin: 0 auto;
          padding: 3.5rem 1.5rem 5rem;
        }
        .contact-section {
          margin-bottom: 2rem;
        }
        .section-header {
          margin-bottom: 2rem;
        }
        .section-header.text-center {
          text-align: center;
        }
        .section-title {
          font-family: Georgia, serif;
          font-size: 1.8rem;
          font-weight: normal;
          color: #3d2b1a;
          margin: 0 0 0.5rem;
        }
        .section-desc {
          color: #6b5240;
          font-size: 0.98rem;
          line-height: 1.6;
          margin: 0;
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #d4b896 50%, transparent 100%);
          margin: 4rem 0;
        }

        /* ── Contact Grid (Cards & Form) ── */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }

        .contact-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 680px) {
          .contact-cards {
            grid-template-columns: 1fr;
          }
        }
        .contact-card {
          display: flex;
          gap: 1.2rem;
          padding: 1.4rem 1.5rem;
          background: #fdf8f2;
          border: 1px solid #d4b896;
          border-radius: 6px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .contact-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(61,43,26,0.08);
        }
        .card-icon {
          font-size: 1.8rem;
          flex-shrink: 0;
          line-height: 1;
        }
        .card-info h3 {
          font-family: Georgia, serif;
          font-size: 1.05rem;
          font-weight: normal;
          color: #3d2b1a;
          margin: 0 0 0.3rem;
        }
        .card-info p {
          color: #6b5240;
          font-size: 0.88rem;
          margin: 0 0 0.6rem;
          line-height: 1.5;
        }
        .contact-link {
          display: inline-block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #8c5a2b;
          text-decoration: none;
          transition: color 0.2s;
        }
        .contact-link:hover {
          color: #5c3511;
          text-decoration: underline;
        }
        .contact-text {
          display: inline-block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #4a3728;
        }

        /* ── Form Wrapper ── */
        .form-wrapper {
          background: #fdf8f2;
          border: 1px solid #d4b896;
          border-radius: 6px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(61,43,26,0.04);
        }

        /* ── Bottom Section: Join Us / Recruitment ── */
        .join-badge {
          display: inline-block;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8c5a2b;
          border: 1px solid #c9a96e;
          background: #fcf5ea;
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          margin-bottom: 0.8rem;
        }
        .role-card {
          background: #fdf8f2;
          border: 1px solid #d4b896;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(61,43,26,0.06);
          margin-top: 2rem;
        }
        .role-header {
          background: #3d2b1a;
          padding: 2rem;
          color: #f5ede0;
        }
        .role-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.8rem;
          flex-wrap: wrap;
        }
        .role-badge-open {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #2c1f14;
          background: #c9a96e;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: 3px;
        }
        .role-type {
          font-size: 0.88rem;
          color: #c4b49a;
        }
        .role-title {
          font-family: Georgia, serif;
          font-size: 2rem;
          font-weight: normal;
          color: #f5ede0;
          margin: 0;
        }
        .role-body {
          padding: 2.2rem 2rem;
        }
        .role-description {
          font-size: 1.02rem;
          line-height: 1.7;
          color: #4a3728;
          margin: 0 0 2rem;
        }

        .requirements-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2.2rem;
        }
        @media (max-width: 680px) {
          .requirements-grid {
            grid-template-columns: 1fr;
          }
        }
        .requirements-block h4 {
          font-family: Georgia, serif;
          font-size: 1.05rem;
          font-weight: normal;
          color: #3d2b1a;
          margin: 0 0 1rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px dashed #d4b896;
        }
        .nice-to-have h4 {
          color: #6b5240;
        }
        .requirement-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .requirement-list li {
          display: flex;
          gap: 0.7rem;
          font-size: 0.93rem;
          line-height: 1.6;
          color: #4a3728;
        }
        .req-marker {
          color: #c9a96e;
          flex-shrink: 0;
        }

        /* Apply Callout */
        .apply-callout {
          background: #3d2b1a;
          color: #f5ede0;
          border-radius: 6px;
          padding: 1.8rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .apply-callout-content h4 {
          font-family: Georgia, serif;
          font-size: 1.2rem;
          font-weight: normal;
          color: #f5ede0;
          margin: 0 0 0.5rem;
        }
        .apply-callout-content p {
          color: #c4b49a;
          font-size: 0.92rem;
          line-height: 1.6;
          margin: 0;
          max-width: 100%;
        }
        .apply-callout-content code {
          background: rgba(201,169,110,0.2);
          color: #c9a96e;
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
        }
        .apply-now-btn {
          display: inline-block;
          background: #c9a96e;
          color: #2c1f14;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.8rem 1.6rem;
          border-radius: 50px;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.2s, transform 0.2s;
        }
        .apply-now-btn:hover {
          background: #d9b87d;
          transform: translateY(-1px);
        }

        @media (max-width: 600px) {
          .role-body { padding: 1.5rem; }
          .apply-callout { padding: 1.5rem; flex-direction: column; align-items: stretch; text-align: center; }
          .apply-now-btn { text-align: center; }
        }
      `}</style>

      <SiteFooter />
    </>
  );
}
