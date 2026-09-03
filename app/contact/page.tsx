import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

export const metadata: Metadata = {
  title: "Contact & About Us",
  description:
    "Get in touch for general inquiries, feedback, typo reports, or learn more about our Chinese Danmei & BL web novel project policies.",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
  openGraph: {
    title: "Contact & About Us",
    description:
      "Get in touch for general inquiries, feedback, typo reports, or learn more about our Chinese Danmei & BL web novel project policies.",
    url: absoluteUrl("/contact"),
    siteName: SITE_NAME,
  },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader activePath="contact" />

      {/* Hero Header */}
      <section className="bg-[#2b1f2d] py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-serif text-xs tracking-[0.25em] uppercase text-[#e499b3] mb-5">
            About &amp; Inquiries
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#f7c6d9] mb-5 tracking-wide">
            Contact &amp; About Us
          </h1>
          <p className="text-[#c87f9b] text-base leading-relaxed">
            Have a question, feedback, noticed a typo, or want to know more about our platform?
            We&apos;re glad to connect with fellow readers!
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-14">
        {/* General Contact */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-normal text-[#2b1f2d] mb-2">
              General Inquiries &amp; Feedback
            </h2>
            <p className="text-[#c87f9b] text-sm leading-relaxed">
              Reach out to us directly via email for any inquiries, suggestions, or chapter typo reports.
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
                  Found a broken chapter link or typo? Let us know so we can fix it quickly.
                </p>
                <a
                  href="mailto:contact@crosstheline.press?subject=Typo%20or%20Issue%20Report"
                  className="text-sm font-semibold text-[#e499b3] no-underline hover:text-[#c87f9b] hover:underline transition-colors"
                >
                  contact@crosstheline.press
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#f7c6d9] to-transparent my-12" />

        {/* About & Policies Section */}
        <section className="mb-8">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl font-normal text-[#2b1f2d] mb-2">
              About the Platform &amp; Policies
            </h2>
            <p className="text-[#c87f9b] text-sm leading-relaxed max-w-xl mx-auto">
              Learn more about our mission, content guidelines, and privacy practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: About */}
            <div className="flex flex-col bg-white border border-[#f7c6d9]/50 rounded-2xl p-6 shadow-sm">
              <div className="text-2xl mb-3">📖</div>
              <h3 className="font-serif text-lg font-normal text-[#2b1f2d] mb-2">
                About Our Project
              </h3>
              <p className="text-[#302a2f] text-sm leading-relaxed">
                We are a group of passionate web novel enthusiasts dedicated to bringing captivating Chinese Danmei and Asian BL web novels to readers in English with refined chapters, clear navigation, and regular updates.
              </p>
            </div>

            {/* Card 2: Copyright & Content Policy */}
            <div className="flex flex-col bg-white border border-[#f7c6d9]/50 rounded-2xl p-6 shadow-sm">
              <div className="text-2xl mb-3">⚖️</div>
              <h3 className="font-serif text-lg font-normal text-[#2b1f2d] mb-2">
                Content &amp; DMCA Policy
              </h3>
              <p className="text-[#302a2f] text-sm leading-relaxed">
                All works are hosted for non-commercial cultural appreciation. We hold complete respect for original authors and copyright holders. If you are an author or copyright holder and wish for content removal, please contact us for immediate assistance.
              </p>
            </div>

            {/* Card 3: Privacy */}
            <div className="flex flex-col bg-white border border-[#f7c6d9]/50 rounded-2xl p-6 shadow-sm">
              <div className="text-2xl mb-3">🔒</div>
              <h3 className="font-serif text-lg font-normal text-[#2b1f2d] mb-2">
                Privacy Notice
              </h3>
              <p className="text-[#302a2f] text-sm leading-relaxed">
                We respect reader privacy. We do not collect personal identifying data. Anonymous analytics (such as page load and visit metrics) are used solely to optimize website stability and chapter reading performance.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
