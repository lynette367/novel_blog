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
      <section className="bg-[#2b1f2d] py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-serif text-xs tracking-[0.25em] uppercase text-[#e499b3] mb-5">
            Get In Touch
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#f7c6d9] mb-5 tracking-wide">
            Contact Us
          </h1>
          <p className="text-[#c87f9b] text-base leading-relaxed">
            Have a question, noticed a typo, want to collaborate, or interested in joining our
            translation team? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-14">
        {/* General Contact */}
        <section className="mb-8">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-normal text-[#2b1f2d] mb-2">
              General Inquiries &amp; Feedback
            </h2>
            <p className="text-[#c87f9b] text-sm leading-relaxed">
              Reach out to us directly via email for any inquiries or typo reports.
            </p>
          </div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {/* Email card */}
            <div className="flex gap-4 p-5 bg-white border border-[#f7c6d9]/50 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-3xl flex-shrink-0 leading-none pt-0.5">✉️</div>
              <div>
                <h3 className="font-serif text-base font-normal text-[#2b1f2d] mb-1">
                  Official Email
                </h3>
                <p className="text-[#c87f9b] text-sm mb-2 leading-snug">
                  For general questions, feedback, and collaboration
                </p>
                <a
                  href="mailto:contact@crosstheline.press"
                  className="text-sm font-semibold text-[#e499b3] no-underline hover:text-[#c87f9b] hover:underline transition-colors"
                >
                  contact@crosstheline.press
                </a>
              </div>
            </div>

            {/* Report card */}
            <div className="flex gap-4 p-5 bg-white border border-[#f7c6d9]/50 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-3xl flex-shrink-0 leading-none pt-0.5">🐛</div>
              <div>
                <h3 className="font-serif text-base font-normal text-[#2b1f2d] mb-1">
                  Report an Issue / Typo
                </h3>
                <p className="text-[#c87f9b] text-sm mb-2 leading-snug">
                  Found a broken link or typo? Let us know so we can fix it quickly.
                </p>
                <span className="text-sm font-semibold text-[#2b1f2d]">
                  contact@crosstheline.press
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#f7c6d9] to-transparent my-12" />

        {/* Join Us */}
        <section id="join-us" className="mb-8">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-normal text-[#2b1f2d] mb-2">Join Us</h2>
            <p className="text-[#c87f9b] text-sm leading-relaxed max-w-xl mx-auto">
              We are actively looking for passionate individuals to help bring Chinese Danmei novels
              to English readers worldwide!
            </p>
          </div>

          {/* Role card */}
          <div className="rounded-2xl border border-[#f7c6d9]/50 overflow-hidden shadow-sm mt-8">
            {/* Role header */}
            <div className="bg-[#2b1f2d] p-6 sm:p-8 text-[#f7c6d9]">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="text-xs uppercase tracking-[0.15em] font-bold text-[#2b1f2d] bg-[#e499b3] px-2.5 py-0.5 rounded-sm">
                  ✦ Now Hiring
                </span>
                <span className="text-sm text-[#c87f9b]">
                  Volunteer · Remote · Flexible Hours
                </span>
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#f7c6d9] m-0">
                Editors &amp; Proofreaders
              </h3>
            </div>

            {/* Role body */}
            <div className="p-6 sm:p-8 bg-white">
              <p className="text-[#302a2f] text-base leading-relaxed mb-8">
                Our proofreaders and editors are the vital polish layer before chapters go live.
                You&apos;ll work closely with translators to fix typos, refine prose flow, ensure term
                consistency, and enhance the reader&apos;s immersion.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                {/* Key requirements */}
                <div>
                  <h4 className="font-serif text-base font-normal text-[#2b1f2d] mb-4 pb-2 border-b border-dashed border-[#f7c6d9]">
                    Key Requirements
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-3">
                    {requirements.map((req) => (
                      <li key={req} className="flex gap-3 text-sm text-[#302a2f] leading-relaxed">
                        <span className="text-[#e499b3] flex-shrink-0">✦</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nice to have */}
                <div>
                  <h4 className="font-serif text-base font-normal text-[#c87f9b] mb-4 pb-2 border-b border-dashed border-[#f7c6d9]">
                    Nice to Have
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-3">
                    {niceToHave.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-[#302a2f] leading-relaxed">
                        <span className="text-[#c87f9b] flex-shrink-0">◇</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Apply callout */}
              <div className="bg-[#2b1f2d] text-[#f7c6d9] rounded-xl p-6 sm:p-8">
                <h4 className="font-serif text-lg font-normal text-[#f7c6d9] mb-3">
                  Ready to Apply?
                </h4>
                <p className="text-[#c87f9b] text-sm leading-relaxed">
                  Send an email to{" "}
                  <strong className="text-[#f7c6d9]">contact@crosstheline.press</strong> with the
                  subject line{" "}
                  <code className="bg-[#e499b3]/20 text-[#e499b3] px-1.5 py-0.5 rounded text-xs">
                    [Proofreader Application] Your Name
                  </code>
                  . Tell us a bit about yourself, why you love Danmei, and any relevant experience!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
