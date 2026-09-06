import siteConfig from "@/site.config";

type Props = {
    novelTitle: string;
    latestPolishedNumber?: number | null;
};

export function MtlBanner({ novelTitle, latestPolishedNumber }: Props) {
    const { patreon } = siteConfig.supportLinks;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-6">
            <div className="rounded-xl border border-[#e9c98a]/60 bg-[#fdf6e8] px-5 py-4 sm:px-6 sm:py-5 text-sm sm:text-[0.95rem] text-[#6b5738] leading-relaxed">
                <p className="mb-2">
                    <span className="mr-1.5">📖</span>
                    You&apos;re reading the <strong>free Raw MTL</strong> version of this
                    chapter. Due to limited staffing and resources, we&apos;ve released
                    every chapter of {novelTitle} as machine translation first, so you
                    never have to wait to find out what happens next.
                </p>
                <p className="mb-3">
                    Behind the scenes, our small team is working through the story
                    chapter by chapter, by hand, to create a meticulously crafted,
                    refined version
                    {latestPolishedNumber ? (
                        <>
                            {" "}
                            — currently polished up to <strong>Chapter {latestPolishedNumber}</strong>.
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
            </div>
        </div>
    );
}