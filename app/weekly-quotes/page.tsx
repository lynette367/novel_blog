import { redirect } from "next/navigation";
import { getLatestWeeklyQuote } from "@/lib/novels";

export const dynamic = "force-static";

export default async function WeeklyQuotesIndexPage() {
  const latestQuote = await getLatestWeeklyQuote();
  redirect(`/weekly-quotes/${latestQuote.slug}`);
}
