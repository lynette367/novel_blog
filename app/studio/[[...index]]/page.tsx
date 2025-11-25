"use client";

import nextDynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Config } from "sanity";

export const dynamic = "force-dynamic";

const NextStudio = nextDynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false }
);

export default function StudioPage() {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    let isMounted = true;

    import("@/sanity.config")
      .then((mod) => {
        if (isMounted) {
          setConfig(mod.default);
        }
      })
      .catch((error) => {
        console.error("Failed to load Sanity config", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!config) {
    return (
      <div style={{ padding: "1rem", fontSize: "0.875rem", color: "#555" }}>
        Loading Studio...
      </div>
    );
  }

  return <NextStudio config={config} />;
}
