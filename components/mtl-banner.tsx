import { InfoCard } from "@/components/info-card";
import siteConfig from "@/site.config";

type Props = {
  novelTitle: string;
  latestPolishedNumber?: number | null;
  /** 当前章节是否已在 Patreon 发布精修版 */
  isCurrentChapterOnPatreon?: boolean;
  /** 当前章节的 Patreon 直链（Mode A 使用） */
  patreonUrl?: string;
  currentChapterNumber?: number;
};

export function MtlBanner({
  novelTitle,
  latestPolishedNumber,
  isCurrentChapterOnPatreon = false,
  patreonUrl,
  currentChapterNumber,
}: Props) {
  const { patreon } = siteConfig.supportLinks;
  const ctaUrl = patreonUrl || patreon;

  // ── Mode A：Patreon 已有精修，网站当前仍是 MTL ──────────────────────────
  if (isCurrentChapterOnPatreon && ctaUrl) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-6">
        <InfoCard className="px-5 py-4 sm:px-6 sm:py-5">
          {/* Warning header */}
          <p className="text-sm font-bold text-[#7a5c1e] mb-3 leading-snug">
            ⚠️{" "}
            <span className="uppercase tracking-wide">Warning</span>: This is
            the Free Raw MTL (Machine Translation) Version.
          </p>

          <p className="text-sm text-[#6b5738] leading-relaxed mb-4">
            Due to our small team&apos;s workload, we release computer
            translations here first. As you may know, raw MTL can be a bit{" "}
            <em>messy, confusing, and hard to digest</em>. 😵
          </p>

          {/* CTA block */}
          <div
            className="rounded-xl p-4 mb-4"
            style={{ backgroundColor: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)" }}
          >
            <p className="text-sm font-semibold text-[#7a5c1e] mb-1">
              ✨ Good News! ✨
            </p>
            <p className="text-sm text-[#6b5738] leading-relaxed mb-3">
              The fully hand-polished, human-edited
              version of{" "}
              {currentChapterNumber ? (
                <>Chapter {currentChapterNumber}</>
              ) : (
                "this exact chapter"
              )}{" "}
              is <strong>already live on our Patreon</strong>! Skip the chaotic
              computer text and enjoy the smooth story right now. 🎉
            </p>
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full font-semibold text-sm text-white no-underline transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ background: "linear-gradient(to right, #c9a96e, #8b7355)" }}
            >
              🚀 👉 Unlock the Polished Version on Patreon Now
            </a>
          </div>

          {/* Free release note */}
          <p className="text-xs text-[#9c8560] leading-relaxed">
            🕒 Note: The hand-polished version will be published here for free
            soon. Stay tuned!
          </p>
        </InfoCard>
      </div>
    );
  }

  // ── Mode B：普通 MTL banner（Patreon 尚无该章节精修）──────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-6">
      <InfoCard className="px-5 py-4 sm:px-6 sm:py-5 text-sm sm:text-[0.95rem] text-[#6b5738] leading-relaxed">
        <p className="mb-2">
          <span className="mr-1.5">📖</span>
          You&apos;re reading the <strong>free Raw MTL</strong> version of this
          chapter. Due to limited staffing and resources, we&apos;ve released
          every chapter of{" "}
          <em className="font-semibold">{novelTitle}</em> as machine translation
          first, so you never have to wait to find out what happens next.
        </p>
        <p className="mb-3">
          Behind the scenes, our small team is working through the story
          chapter by chapter, by hand, to create a meticulously crafted,
          refined version
          {latestPolishedNumber ? (
            <>
              {" "}
              — currently polished up to{" "}
              <strong>Chapter {latestPolishedNumber}</strong>.
            </>
          ) : (
            "."
          )}
        </p>
        {patreon && (
          <p className="text-[#8b6f3f]">
            If you&apos;d like to support that work, a visit to our{" "}
            <a
              href={patreon}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 font-semibold hover:text-[#5d4327] transition-colors"
            >
              Patreon
            </a>{" "}
            means more than you know. 💛
          </p>
        )}
      </InfoCard>
    </div>
  );
}