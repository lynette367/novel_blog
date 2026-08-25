import Link from "next/link";

export function HeroAnnouncementPanel() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-[32px] border-[3.5px] border-[#bfe2ee] bg-[#fffdf2] p-7 shadow-[0_12px_32px_rgba(191,226,238,0.35)] h-full">
      {/* 顶部标题区 */}
      <div className="flex items-center gap-2 pb-3 border-b border-[#bfe2ee]/40">
        <span className="text-[#f4a7b9] text-lg">✦</span>
        <h3 className="font-serif text-lg font-bold text-[#5c4a42]">Dear Readers</h3>
      </div>

      {/* 正文内容 */}
      <div className="my-4 space-y-3.5 text-[0.88rem] leading-relaxed text-[#6d5e56]">
        <p>
          Due to limited staffing and resources, we have released all raw
          machine-translated (Raw MTL) chapters completely for free so you can
          follow the plot without waiting!
        </p>
        <p>
          Our team is working through each novel, chapter by chapter, to create a
          meticulously crafted, refined version. Currently, we are focusing our
          efforts on producing the premium, refined chapters for Big Brother.
        </p>
        <ul className="space-y-1.5 pt-1 text-xs font-medium text-[#7d6f67]">
          <li className="flex items-center gap-2"><span>📖</span> Raw MTL chapters available instantly for all novels</li>
          <li className="flex items-center gap-2"><span>✨</span> Refined chapters added daily, starting from Ch. 1</li>
          <li className="flex items-center gap-2"><span>🔒</span> No abandoned series — ever</li>
        </ul>
      </div>

      {/* 底部小贴士 */}
      <div className="pt-3 border-t border-[#bfe2ee]/40 text-xs text-[#8c7d75] italic">
        Spot a translation issue or want to request priority polishing for a novel you love? We read every message.
      </div>
    </div>
  );
}
