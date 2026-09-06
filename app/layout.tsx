import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/siteMetadata";

const defaultDescription =
  "Your destination for high-quality Chinese Danmei and Asian BL web novels. Discover captivating stories, daily updates, and completed chapters in English.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Read Chinese Danmei & BL Web Novels Online in English",
    template: "%s | Danmei Novels",
  },
  description: defaultDescription,
  keywords: [
    "danmei novels",
    "chinese danmei",
    "BL web novel",
    "asian BL",
    "read danmei online",
    "Xianxia BL",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    title: "Read Chinese Danmei & BL Web Novels Online in English",
    description:
      "Discover popular Chinese Danmei and Asian BL web novels in English with regular updates.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Read Chinese Danmei & BL Web Novels Online in English",
    description: "Discover popular Chinese Danmei and Asian BL web novels in English with regular updates.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body>
        {children}

        {/* Load GA only after the page is interactive — never blocks rendering */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WEP970B5F2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WEP970B5F2');
          `}
        </Script>
      </body>
    </html>
  );
}
