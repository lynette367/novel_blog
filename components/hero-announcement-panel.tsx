import Link from "next/link";

export function HeroAnnouncementPanel() {
  return (
    <aside className="rounded-3xl border border-[#b8d9ff]/50 bg-[#f4f9ff] p-6 sm:p-8 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#b8d9ff]/45">
        <span className="text-[#e499b3] text-base leading-none flex-shrink-0">✦</span>
        <h2 className="font-serif font-semibold text-lg text-[#2b1f2d] leading-snug m-0">
          Dear Readers
        </h2>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col gap-3">
        <p className="text-sm leading-relaxed text-[#302a2f] m-0">
          Due to limited staffing and resources, we have released all raw machine-translated (Raw
          MTL) chapters completely for free so you can follow the plot without waiting!
        </p>

        <p className="text-sm leading-relaxed text-[#302a2f] m-0">
          Our team is working through each novel, chapter by chapter, to create a meticulously
          crafted, refined version. Currently, we are focusing our efforts on producing the premium,
          refined chapters for Big Brother.
        </p>

        <ul className="list-none p-0 m-0 my-1 flex flex-col gap-2">
          <li className="flex items-start gap-2.5 text-sm text-[#2b1f2d] font-medium leading-snug">
            <span className="flex-shrink-0 text-base leading-snug">📖</span>
            Raw MTL chapters available instantly for all novels
          </li>
          <li className="flex items-start gap-2.5 text-sm text-[#2b1f2d] font-medium leading-snug">
            <span className="flex-shrink-0 text-base leading-snug">✨</span>
            Refined chapters added daily, starting from Ch. 1
          </li>
          <li className="flex items-start gap-2.5 text-sm text-[#2b1f2d] font-medium leading-snug">
            <span className="flex-shrink-0 text-base leading-snug">🔒</span>
            No abandoned series — ever
          </li>
        </ul>

        <p className="text-sm leading-relaxed text-[#302a2f] m-0">
          Spot a translation issue or want to request priority polishing for a novel you love? We
          read every message.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-6 pt-4 border-t border-[#b8d9ff]/45">
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#b8d9ff] text-[#2b1f2d] rounded-full font-semibold text-sm hover:bg-[#b8d9ff]/70 transition-all no-underline"
        >
          Send a Message →
        </Link>
      </div>
    </aside>
  );
}
