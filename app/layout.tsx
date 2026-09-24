import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/siteMetadata";

const defaultDescription =
  "Your destination for high-quality Chinese Danmei and Asian BL web novels. Discover captivating stories, daily updates, and completed chapters in English.";

// 1. 正确配置 Viewport（Next.js 官方推荐写法，避免手动在 <head> 里写 meta 导致冲突）
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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
        {/* 2. 完美修复后的 Microsoft Clarity 追踪代码 */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "yncaf17d0k");
          `}
        </Script>
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
