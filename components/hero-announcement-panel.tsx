import Link from "next/link";
import { InfoCard } from "@/components/info-card";

export function ReadersNoteSection() {
  return (
    <section className="page-shell pb-6">
      <InfoCard className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3.5 mb-4 border-b border-[--card-border]/40">
          <span className="text-2xl">💌</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#5c4a42] tracking-wide">
            Reader&apos;s Note
          </h2>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#6d5e56] leading-relaxed">
          <div className="md:col-span-2 space-y-3">
            <p>
              We're currently refining Big Brother and Transmigrated To Be the Villain's Sickly Childhood Friend, chapter by chapter.
            </p>
            <p>
              Raw machine-translated chapters remain available for readers who don't want to wait, while refined chapters are added regularly.
            </p>
          </div>

          <div className="bg-white/60 border border-[--card-border]/40 rounded-xl p-4 flex flex-col justify-between">
            <ul className="space-y-2 text-xs font-medium text-[#7d6f67]">
              <li className="flex items-start gap-2">
                <span className="text-sm">📖</span>
                <span><strong>Raw MTL chapters</strong> available instantly for all novels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm">✨</span>
                <span><strong>Refined chapters</strong> added daily, starting from Ch. 1</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm">🔒</span>
                <span><strong>No abandoned series</strong> — ever</span>
              </li>
            </ul>

            <div className="pt-3 mt-3 border-t border-[--card-border]/40 text-[11px] text-[#8c7d75] italic">
              Spot a translation issue or want to request priority polishing?{" "}
              <Link
                href="/contact"
                className="text-[#e499b3] hover:text-[#c87f9b] transition-colors font-medium underline underline-offset-2 no-underline"
              >
                We read every message.
              </Link>
            </div>
          </div>
        </div>
      </InfoCard>
    </section>
  );
}

// 兼容别名
export const HeroAnnouncementPanel = ReadersNoteSection;
