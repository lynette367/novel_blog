import { InfoCard } from "@/components/info-card";
import siteConfig from "@/site.config";

type Props = {
  latestPatreonUrl?: string;
};

export function PatreonHookCard({ latestPatreonUrl }: Props) {
  const { patreon } = siteConfig.supportLinks;
  const ctaUrl = latestPatreonUrl || patreon;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-12">
      <InfoCard className="p-6 sm:p-8 text-center">
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm sm:text-base italic text-[#5d4327] hover:text-[#3d2b18] underline transition-colors"
        >
          Access the Remaining Premium Polished Chapters on Patreon
        </a>
      </InfoCard>
    </div>
  );
}