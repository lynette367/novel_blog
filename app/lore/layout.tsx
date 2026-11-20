import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Shared shell for all pages under the /lore cluster.
export default function LoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader activePath="lore" />
      {children}
      <SiteFooter />
    </>
  );
}
