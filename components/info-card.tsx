import { type ReactNode } from "react";

type InfoCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Shared card style: warm background + sky-blue border + soft shadow.
 * Matches the "Dear Readers" hero panel aesthetic.
 * Use this for inline chapter notices, hero panels, and any similar callouts.
 */
export function InfoCard({ children, className = "" }: InfoCardProps) {
  return (
    <div
      className={`rounded-2xl border-[5px] ${className}`}
      style={{
        borderColor: "var(--card-border)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      {children}
    </div>
  );
}
