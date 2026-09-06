import siteConfig from "@/site.config";

type Props = {
  patreonAheadChapter?: number;
  currentChapterNumber: number;
  novelTitle?: string;
};

export function PatreonHookCard({ patreonAheadChapter, currentChapterNumber }: Props) {
  const { patreon } = siteConfig.supportLinks;
  const hasAdvanceChapters =
    !!patreon && !!patreonAheadChapter && patreonAheadChapter > currentChapterNumber;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-12">
      <div className="rounded-2xl border-2 border-[#e9c98a] bg-gradient-to-br from-[#fdf6e8] to-[#f7ecd3] p-6 sm:p-8 text-center shadow-sm">
        <div className="text-2xl mb-2">🛑</div>
        <h3 className="font-serif text-xl sm:text-2xl text-[#5d4327] mb-3">
          You&apos;ve Reached the Edge of the Human TL
        </h3>
        <p className="text-sm sm:text-base text-[#6b5738] leading-relaxed mb-4">
          Everything from Chapter {currentChapterNumber + 1} onward is the
          original, unedited Raw MTL — readable, but not yet polished by our
          team.
        </p>

        {hasAdvanceChapters && patreon && (
          <>
            <p className="text-sm sm:text-base text-[#6b5738] leading-relaxed mb-5">
              Good news — we&apos;ve already hand-polished up to{" "}
              <strong>Chapter {patreonAheadChapter}</strong>, live exclusively
              on Patreon right now.
            </p>

            <a
              href={patreon}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-7 bg-gradient-to-r from-[#c9a96e] to-[#8b7355] text-white rounded-full font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline mb-5"
            >
              Unlock Chapters on Patreon →
            </a>
          </>
        )}

        <p className="text-xs sm:text-sm text-[#9c8560] leading-relaxed">
          If you don&apos;t mind the raw computer translation, feel free to
          keep reading below — thank you for staying with the story!
        </p>
      </div>
    </div>
  );
}