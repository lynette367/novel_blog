"use client";
/**
 * Sanity Studio embedded page.
 *
 * Root cause of "useMemo changed size" crash:
 *   next-sanity's NextStudio wraps the actual Studio in React.lazy() + Suspense.
 *   On first render Suspense returns null (plugins=[]), then after lazy-load
 *   Studio renders with plugins=[studio,...] — the useMemo dep array changes size.
 *
 * Fix: use nextDynamic({ ssr: false }) which prevents ANY server render and
 * ensures the component only ever mounts once on the client with the full
 * config already available (static import — not via useState).
 */
import nextDynamic from "next/dynamic";
import config from "@/sanity.config";

export const dynamic = "force-dynamic";

const NextStudio = nextDynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: "1rem", fontSize: "0.875rem", color: "#555" }}>
        Loading Studio...
      </div>
    ),
  }
);

export default function StudioPage() {
  return <NextStudio config={config} />;
}
