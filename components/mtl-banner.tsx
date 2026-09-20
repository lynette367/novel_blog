import { InfoCard } from "@/components/info-card";
import siteConfig from "@/site.config";

type Props = {
  novelTitle: string;
  latestPolishedNumber?: number | null;
  /** 当前章节是否已在 Patreon 发布精修版 */
  isCurrentChapterOnPatreon?: boolean;
  /** 当前章节的 Patreon 直链(Mode A 使用) */
  patreonUrl?: string;
  currentChapterNumber?: number;
};

export function MtlBanner({
  isCurrentChapterOnPatreon = false,
  patreonUrl,
  currentChapterNumber,
}: Props) {
  const { patreon } = siteConfig.supportLinks;
  const ctaUrl = patreonUrl || patreon;

  // Mode A ── 如果 Patreon 已有精修，只保留精修版按钮 ──────────────────────────
  if (isCurrentChapterOnPatreon && ctaUrl) {
    return (
      <div className="mt-4 flex justify-center">
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 py-2 px-5 rounded-full font-semibold text-sm text-white no-underline transition-all hover:shadow-md hover:-translate-y-0.5"
          style={{ backgroundColor: "#f4a7b9" }}
        >
          ✨ Unlock the Premium version of{" "}
          {currentChapterNumber ? `Chapter ${currentChapterNumber}` : "this chapter"} on Patreon right now! ✨
        </a>
      </div>
    );
  }

  // Mode B ── 机翻章 
  return (
    <div className="w-full flex justify-center items-center my-5 px-4 text-center">
      <p className="text-xs sm:text-sm text-stone-400 m-0 font-normal leading-relaxed">
        [Free Raw MTL] Discover our Premium chapters on {" "}
        <a
          href={patreon}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-2 transition-colors text-[#f4a7b9] hover:text-[#e092a4]"
        >
          Our Patreon Hub →
        </a>
      </p>
    </div>
  );
}