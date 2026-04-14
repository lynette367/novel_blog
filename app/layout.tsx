import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/siteMetadata";

const defaultDescription =
  "Your destination for high-quality Asian BL novel translations. Discover captivating danmei stories, updated regularly with premium English translations.";

const defaultImage = `${SITE_URL}/assets/images/Wife_are_paramount.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cross The Line | Asian BL Novel Translation & Reviews",
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  keywords: [
    "asian BL novel",
    "danmei translation",
    "BL fiction",
    "yaoi novel",
    "LGBT+ romance",
    "Chinese BL",
    "Korean BL",
    "BL novel translation",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    title: "Cross The Line | Asian BL Novel Translation",
    description: "High-quality Asian BL novel translations and danmei stories in English",
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cross The Line | Asian BL Novel Translation",
    description: "Discover captivating Asian BL novels and danmei translations",
    images: [defaultImage],
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
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WEP970B5F2"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WEP970B5F2');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
