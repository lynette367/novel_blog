import "./bl-recs.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Shared shell for the BL recs pillar page and every cluster page under it.
export default function BLRecsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader activePath="Recs" />
      {children}
      <SiteFooter />
    </>
  );
}
