import Link from "next/link";
import { InfoCard } from "@/components/info-card";

export function HeroAnnouncementPanel() {
  return (
    <InfoCard className="relative flex flex-col justify-between overflow-hidden p-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2.5 border-b border-[--card-border]/40">
        <span className="text-[#f4a7b9] text-base">✦</span>
        <h3 className="font-serif text-sm font-bold text-[#5c4a42]">Dear Readers</h3>
      </div>

      {/* Body */}
      <div className="my-3 space-y-2.5 text-xs leading-relaxed text-[#6d5e56]">
        <p>
          Due to limited staffing and resources, we have released all raw
          machine-translated (Raw MTL) chapters completely for free so you can
          follow the plot without waiting!
        </p>
        <p>
          Our team is working through each novel, chapter by chapter, to create a
          meticulously crafted, refined version. Currently, we are focusing our
          efforts on producing the premium, refined chapters for Big Brother and Transmigrated To Be the Villain&apos;s Sickly Childhood Friend.
        </p>
        <ul className="space-y-1 pt-0.5 text-[11px] font-medium text-[#7d6f67]">
          <li className="flex items-center gap-2"><span>📖</span> Raw MTL chapters available instantly for all novels</li>
          <li className="flex items-center gap-2"><span>✨</span> Refined chapters added daily, starting from Ch. 1</li>
          <li className="flex items-center gap-2"><span>🔒</span> No abandoned series — ever</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[--card-border]/40 text-[10px] text-[#8c7d75] italic">
        Spot a translation issue or want to request priority polishing?{" "}
        <Link href="/contact" className="text-[#e499b3] hover:text-[#c87f9b] transition-colors font-medium no-underline">
          We read every message.
        </Link>
      </div>
    </InfoCard>
  );
}
