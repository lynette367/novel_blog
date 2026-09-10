import { InfoCard } from "@/components/info-card";
import siteConfig from "@/site.config";

type Props = {
  patreonPublishedCount: number;
  latestPatreonChapterNumber?: number | null;
  latestPatreonUrl?: string;
  currentChapterNumber: number;
};

export function PatreonHookCard({
  patreonPublishedCount,
  latestPatreonChapterNumber,
  latestPatreonUrl,
  currentChapterNumber,
}: Props) {
  const { patreon } = siteConfig.supportLinks;
  const hasAdvanceChapters = patreonPublishedCount > 0;
  const ctaUrl = latestPatreonUrl || patreon;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-12">
      <InfoCard className="p-6 sm:p-8 text-center">
        <div className="text-2xl mb-2">🛑</div>
        <h3 className="font-serif text-xl sm:text-2xl text-[#5d4327] mb-3">
          You&apos;ve Reached the Edge of the Human TL
        </h3>
        <p className="text-sm sm:text-base text-[#6b5738] leading-relaxed mb-4">
          Everything from Chapter {currentChapterNumber + 1} onward is currently raw, unedited machine translation. While it might be a bit rough around the edges, you can still follow the core plot of the story.
        </p>

        {hasAdvanceChapters && ctaUrl && (
          <>
            <p className="text-sm sm:text-base text-[#6b5738] leading-relaxed mb-5">
              Good news — we already have{" "}
              <strong>
                {patreonPublishedCount} chapter{patreonPublishedCount > 1 ? "s" : ""}
              </strong>{" "}
              hand-polished and live on Patreon
              {latestPatreonChapterNumber ? (
                <>
                  {" "}up to <strong>Chapter {latestPatreonChapterNumber}</strong>
                </>
              ) : null}
              .
            </p>

            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-7 bg-gradient-to-r from-[#c9a96e] to-[#8b7355] text-white rounded-full font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline mb-5"
            >
              Read the Latest on Patreon →
            </a>
          </>
        )}

        <p className="text-xs sm:text-sm text-[#9c8560] leading-relaxed">
          Prefer to stay on the free tier? No problem! The polished Chapter 8 will be released here for free soon. Hang tight and stay tuned!
        </p>
      </InfoCard>
    </div>
  );
}