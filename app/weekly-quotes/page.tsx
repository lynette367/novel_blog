import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLatestWeeklyQuote } from "@/lib/novels";

export const dynamic = "force-static";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default async function WeeklyQuotesIndexPage() {
  const latestQuote = await getLatestWeeklyQuote();
  redirect(`/weekly-quotes/${latestQuote.slug}`);
}
