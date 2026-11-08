import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/siteMetadata";

const defaultOgImage = `${SITE_URL}/assets/images/immigrating-to-the-jurassic.jpg`;

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
    images: [{ url: defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & About Us",
    description:
      "Get in touch for general inquiries, feedback, typo reports, or learn more about our Chinese Danmei & BL web novel project policies.",
    images: [defaultOgImage],
  },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader activePath="contact" />

      {/* Hero Header */}
      <section className="bg-[#2b1f2d] py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-serif text-xs tracking-[0.25em] uppercase text-[#f4a7b9] mb-5">
            About &amp; Inquiries
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#f7c6d9] mb-5 tracking-wide">
            Contact &amp; About Us
          </h1>
          <p className="text-[#f4a7b9] text-base leading-relaxed">
            Have a question, feedback, noticed a typo, or want to know more about our platform?
            We&apos;re glad to connect with fellow readers!
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-14">
        {/* Contact Form */}
        <section id="send-message" className="mb-12 scroll-mt-24">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-normal text-[#2b1f2d] mb-2">
              Send Us a Message
            </h2>
            <p className="text-[#f4a7b9] text-sm leading-relaxed">
              Fill in the form below for any inquiries, feedback, or chapter typo reports, and it will land straight in our inbox.
            </p>
          </div>
          <ContactForm />
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#f7c6d9] to-transparent my-12" />

        {/* About & Policies Section */}
        <section className="mb-8">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl font-normal text-[#2b1f2d] mb-2">
              About the Platform &amp; Policies
            </h2>
            <p className="text-[#f4a7b9] text-sm leading-relaxed max-w-xl mx-auto">
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
