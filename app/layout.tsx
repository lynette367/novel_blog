import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/siteMetadata";

const defaultDescription =
  "Discover beautifully translated Asian popular novels, curated reading lists, and exclusive content from Cross The Line.";

const defaultImage = `${SITE_URL}/assets/images/Wife_are_paramount.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cross The Line | Asian BL Novel Translation",
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Asian Pop Novel Translation`,
    description: defaultDescription,
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
    title: SITE_NAME,
    description: defaultDescription,
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
        <link rel="canonical" href={SITE_URL} />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
