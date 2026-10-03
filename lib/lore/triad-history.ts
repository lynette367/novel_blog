import type { TriadRank } from "./triad-ranks";

/**
 * Historical layer for the triad-ranks page.
 *
 * triad-ranks.ts keeps the NOVEL layer (summary, story_hint, tiers, gating).
 * This file holds the REAL-WORLD layer, keyed by badge_symbol so it never
 * depends on the ids used in triad-ranks.ts.
 *
 * Every factual line carries an evidence level so readers can tell
 * documented history from society legend from screen folklore.
 */

// ─── Evidence levels ─────────────────────────────────────────────────────────

export type EvidenceLevel = "attested" | "tradition" | "pop";

export const EVIDENCE_LEVELS: Record<EvidenceLevel, { label: string; meaning: string }> = {
  attested: {
    label: "Well attested",
    meaning:
      "Backed by official records, museum collections or several consistent reference works. Dates and figures in this layer can be checked.",
  },
  tradition: {
    label: "Tradition",
    meaning:
      "What the societies' own lore claims: founding legends, ritual symbolism, riddles. Real as culture, but not proof of what happened.",
  },
  pop: {
    label: "Pop lore",
    meaning:
      "Folk explanations, slang and screen conventions, mostly from Hong Kong gangster fiction. Useful for reading the genre, unreliable as history.",
  },
};

export type HistoryClaim = { level: EvidenceLevel; text: string };

// ─── Per-rank history ────────────────────────────────────────────────────────

export type RankHistory = {
  /** Romanised Cantonese title + plain-English function */
  historical_name: string;
  /** One paragraph: what this office was in real Hung Mun / triad tradition */
  archetype: string;
  /** Individually flagged facts and claims */
  claims: HistoryClaim[];
  /** How the role appears in Hong Kong in practice (kept to what sources support) */
  in_the_1970s: string;
  /** Our interpretation of where fiction simplifies. Shown as "Reading note". */
  reading_note: string;
};

export const TRIAD_HISTORY: Record<TriadRank["badge_symbol"], RankHistory> = {
  dice: {
    historical_name: "Sai Gau Jai (四九仔) · Soldier",
    archetype:
      "The rank-and-file member: someone formally sworn into a society but holding no office. In Hung Mun tradition he is the body of the brotherhood, the person who guards, carries, fights and obeys. Code 49 is the lowest number in the system, and 四九仔 became everyday Hong Kong slang for an ordinary gang member.",
    claims: [
      {
        level: "attested",
        text: "Reference works consistently list 49 as the code for the soldier, the lowest sworn rank.",
      },
      {
        level: "attested",
        text: "Membership of a triad society was a criminal offence in Hong Kong almost from the colony's start: Ordinance No. 1 of 1845, the first passed by the Legislative Council, targeted the Triad and other secret societies.",
      },
      {
        level: "tradition",
        text: "Membership was meant to be made by ritual. In Hung Mun tradition the Incense Master presided over an initiation in which the recruit swore oaths of loyalty and secrecy.",
      },
      {
        level: "pop",
        text: "The number is often explained as 4 × 9 = 36, for the thirty-six oaths of the old initiation. It is a popular gloss, not a documented origin.",
      },
      {
        level: "pop",
        text: "蓝灯笼 (Blue Lantern) is commonly described as an associate who follows a big brother on an informal understanding, without a formal initiation, so outside the sworn ranks and below the 49.",
      },
    ],
    in_the_1970s:
      "The foot soldier was the working base of a vice economy. Accounts of the Walled City describe brothels, gambling parlours and opium dens that groups such as the 14K and Sun Yee On controlled from the 1950s, and general accounts of Hong Kong triads list extortion, illegal gambling and prostitution among their core activities. A 2006 PBS profile adds that some groups were highly organised while others were little more than local street gangs, so “a 49” could mean a trusted member of a large society or a loosely attached neighbourhood tough.",
    reading_note:
      "Stories start with the 49 because readers need an entry point, and the neat arc of being sworn in and then promoted is a narrative convenience. Promotion depended on the individual society and what it needed; there was no standard career path.",
  },

  "straw-sandal": {
    historical_name: "Cho Hai (草鞋) · Liaison",
    archetype:
      "The go-between. A straw sandal is a traveller's footwear, and the office is named for the member who walks between lodges, factions and the outside world: carrying messages, arranging meetings and keeping lines open. Reference works call him the messenger or liaison. His code is 432.",
    claims: [
      {
        level: "attested",
        text: "Standard descriptions give the Straw Sandal (432) the job of messenger or liaison, the person who deals with members of other groups or units.",
      },
      {
        level: "attested",
        text: "Hung Mun lodges were spread far apart. A Singapore heritage collection holds Hung seals and fans from the early 1900s, and Hung chapters are also recorded in the Philippines, so a society that spanned regions needed people to carry word between them.",
      },
      {
        level: "tradition",
        text: "The name evokes the wandering courier of the jianghu (江湖) world, someone who lives on the road between one brotherhood and the next.",
      },
      {
        level: "pop",
        text: "In popular Hong Kong crime fiction the Straw Sandal is usually placed just above the 49, as the first officer-level step. Reference descriptions treat the role as a function (liaison), not as a promotion tier.",
      },
    ],
    in_the_1970s:
      "Hong Kong's underworld was never one organisation. The PBS profile counted more than 57 triad groups in the territory in 2006, some allied and some in conflict, and the Walled City itself is described as holding more than one society. Public documentation of how often a formal “Straw Sandal” title was actually conferred, as opposed to the job simply being done by someone, is thin.",
    reading_note:
      "Fiction gives the Straw Sandal the spotlight when two sides need to talk. In a setting like the Walled City, where more than one society was active, that is a plausible dramatic job. Read the title as one office in a network of offices, not as a rung every ambitious member climbs through.",
  },

  "white-paper-fan": {
    historical_name: "Pak Tsz Sin (白纸扇) · Adviser",
    archetype:
      "The strategist and administrator. Reference works describe the White Paper Fan (415) as the society's adviser, the one who handles money, planning and negotiation so that the fighters do not have to. The title comes from the plain white fan that, in Hung Mun tradition, served as a recognition token.",
    claims: [
      {
        level: "attested",
        text: "Descriptions agree on an advisory, administrative or financial role, with the code 415.",
      },
      {
        level: "attested",
        text: "A Singapore heritage collection record on early-1900s Hung Mun objects says members are believed to have carried a white fan to identify one another and to signal through gestures. The fan is a recognition tool before it is a status symbol.",
      },
      {
        level: "pop",
        text: "The image of the adviser with a fan echoes the learned strategist of Chinese popular literature, most famously Zhuge Liang with his feather fan. This is a resemblance in imagery, not a documented origin of the title.",
      },
      {
        level: "pop",
        text: "415 is often explained as 4 × 15 + 4 = 64, the hexagrams of the Book of Changes. Note that this formula differs from the one used for 49, which suggests these are after-the-fact glosses.",
      },
    ],
    in_the_1970s:
      "As Hong Kong groups earned from protection, gambling and vice, someone had to keep accounts and negotiate with the legitimate businesses around them. Tradition assigns that work to the White Paper Fan. For how Hong Kong triad groups actually operated and earned, the standard scholarly text is Yiu Kong Chu, The Triads as Business (2000), listed in the sources below.",
    reading_note:
      "Fiction likes this rank because it gives a story a mind rather than a fist. Historically the office was about administration and counsel, and it sat beside the enforcers rather than above them. An influential adviser is entirely plausible; a secret mastermind who outranks the Dragon Head is a genre convention.",
  },

  "red-pole": {
    historical_name: "Hung Kwan (红棍) · Enforcer",
    archetype:
      "The fighting arm. The Red Pole (426) is the society's military commander or enforcer, responsible for defence and attack: protecting the group's territory and interests, and carrying out its fights and punishments. The title means a red-painted pole or cudgel.",
    claims: [
      {
        level: "attested",
        text: "Reference works agree on 426 as the military or enforcement office, a martial-arts fighter in the society's “military wing”.",
      },
      {
        level: "pop",
        text: "The “pole” is commonly read as the staff of the Shaolin monk-fighters in the founding legend, which gives the title its romance. It is an interpretation, not a documented derivation.",
      },
      {
        level: "pop",
        text: "426 is often explained as 4 × 26 + 4 = 108, the 108 outlaw heroes of Water Margin (水浒传).",
      },
      {
        level: "pop",
        text: "双花红棍 (Double Flower Red Pole) appears chiefly in Hong Kong gangster fiction as an honorific for a Red Pole who excels at both fighting and managing affairs. We have found no reliable documentation of it as a formal historical rank.",
      },
    ],
    in_the_1970s:
      "Enforcement was the core need of the Walled City's economy. A district of brothels, gambling parlours and opium dens that the authorities did not routinely police needed people who could protect premises and settle disputes by force, and police are reported to have entered the enclave only in large groups until the raids of 1973 and 1974.",
    reading_note:
      "Heroes are often Red Poles because the rank carries both glamour and cost: the fighter takes the blows. Real Red Poles were enforcers inside a criminal business. The righteous swordsman of Hung Mun romance belongs to the genre, and the title was probably as much about reputation as about formal command.",
  },

  "dragon-crest": {
    historical_name: "Shan Chu (山主) · Lodge Master",
    archetype:
      "The head of the lodge. The Mountain Master (489) sits at the top of a Hung Mun society. “Mountain” stands for the lodge itself, which tradition calls a mountain hall (山堂), and 龙头 (Dragon Head) is the wider jianghu title for a chief. Authority came from standing among sworn brothers more than from a formal chain of command.",
    claims: [
      {
        level: "attested",
        text: "Reference works agree that 489 is the lodge head, Mountain Master or Dragon Head, and the highest code in the system.",
      },
      {
        level: "tradition",
        text: "The number is a riddle. 4 + 8 + 9 = 21 (廿一), and the character 洪 (Hung) is taken apart as 三, 八 and 廿一, so the leader's code spells the society's own name.",
      },
      {
        level: "attested",
        text: "Lists disagree below the top. 438 is given for the Deputy Mountain Master in some sources and for the Incense Master in others, and some lists give 437 for the Vanguard. Rank numbers are not standardised.",
      },
      {
        level: "pop",
        text: "In Cantonese reporting and fiction the incumbent head is often called 坐馆 (“sitting in the hall”).",
      },
    ],
    in_the_1970s:
      "Real societies were not single kingdoms. The PBS profile says no central command is thought to unify the factions within a triad society, and the Walled City is usually described as divided among groups such as the 14K and Sun Yee On rather than ruled by one head. After the 1973–74 raids, and with the Independent Commission Against Corruption founded in February 1974, the pressure on the societies increased.",
    reading_note:
      "A single Dragon Head ruling a whole enclave is the version stories prefer: one throne, one succession fight. Treat Wo Hing's throne as dramatic compression, useful for the plot but not how most real societies were organised.",
  },
};

// ─── Number codes ────────────────────────────────────────────────────────────

export type TriadCode = {
  code: string;
  en: string;
  cn: string;
  role: string;
  note?: string;
  /** true if this office has its own dossier in the guide */
  in_guide: boolean;
};

export const TRIAD_CODES: TriadCode[] = [
  { code: "489", en: "Mountain Master / Dragon Head", cn: "山主 · 龙头", role: "Head of the lodge", in_guide: true },
  {
    code: "438",
    en: "Deputy Mountain Master / Incense Master",
    cn: "副山主 · 香主",
    role: "Second-in-command; ceremonial duties and initiation",
    note: "Sources give 438 to both offices.",
    in_guide: false,
  },
  {
    code: "437",
    en: "Vanguard",
    cn: "先锋",
    role: "Recruitment and field duties",
    note: "Accounts differ on the exact duties.",
    in_guide: false,
  },
  { code: "426", en: "Red Pole", cn: "红棍", role: "Enforcer, military commander", in_guide: true },
  { code: "415", en: "White Paper Fan", cn: "白纸扇", role: "Adviser, administrator, finance", in_guide: true },
  { code: "432", en: "Straw Sandal", cn: "草鞋", role: "Messenger, liaison with other groups", in_guide: true },
  { code: "49", en: "Soldier (Four-Nine Boy)", cn: "四九仔", role: "Rank-and-file sworn member", in_guide: true },
];

export const TRIAD_CODE_NOTES: HistoryClaim[] = [
  {
    level: "attested",
    text: "The codes are reported consistently in reference works, but digits for the middle offices vary from source to source. Treat the table as the common version, not an official standard.",
  },
  {
    level: "tradition",
    text: "The leader's code is a character riddle: 4 + 8 + 9 = 21 (廿一), and 洪 (Hung) is read as 三, 八 and 廿一. The numbers are a way of writing the society's name in a form outsiders would not recognise.",
  },
  {
    level: "pop",
    text: "Popular arithmetic explanations (49 as 4 × 9 = 36 oaths, 426 as 4 × 26 + 4 = 108 heroes, 415 as 4 × 15 + 4 = 64 hexagrams) do not follow a single formula. That inconsistency suggests they were attached to the numbers afterwards.",
  },
];

// ─── History vs fiction ──────────────────────────────────────────────────────

export type HistoryDifference = {
  id: string;
  topic: string;
  history: string;
  fiction: string;
};

export const TRIAD_DIFFERENCES: HistoryDifference[] = [
  {
    id: "ladder",
    topic: "A ladder, or a table of offices?",
    history:
      "Reference works describe the Red Pole, White Paper Fan and Straw Sandal as different jobs (enforcement, administration, liaison), each with its own number. The numbers are not a career ladder.",
    fiction:
      "Stories line the offices up as ascending steps because a ladder is easy to follow and gives a hero a path. The tier dots on this page follow the novel's ladder, not a formal real-world one.",
  },
  {
    id: "one-boss",
    topic: "One boss, or many groups?",
    history:
      "A 2006 PBS profile notes that no central command is thought to unify the factions within a society, and that some groups were highly organised while others were little more than local street gangs. In the Walled City, accounts name at least two societies, the 14K and Sun Yee On, holding its vice trade from the 1950s.",
    fiction:
      "One society and one throne make a cleaner plot: a single succession struggle, a single rival, a single line to cross.",
  },
  {
    id: "ideals",
    topic: "Ideals, or business?",
    history:
      "The Heaven and Earth Society began as a brotherhood whose slogan was to oppose the Qing and restore the Ming. After the Qing fell in 1911–12 that cause lost its political purpose, and accounts of the later societies centre on extortion, illegal gambling, vice and drugs.",
    fiction:
      "Oaths about brotherhood, righteousness and loyalty carry real weight in the story. They come from Hung Mun tradition, but in the period itself they sat alongside a criminal economy.",
  },
  {
    id: "initiation",
    topic: "The initiation ceremony",
    history:
      "In Hung Mun tradition the Incense Master presided over a ritual of oaths. Membership became an offence in Hong Kong in 1845, and rites varied widely between societies and periods.",
    fiction:
      "A single staged ceremony with dramatic props marks a character's promotion. Screen versions are built for drama and should not be read as a record of any real rite.",
  },
  {
    id: "walled-city",
    topic: "The Walled City itself",
    history:
      "A legal grey zone that no government fully ran: the 1898 convention left it out, the Qing and then the Republic of China claimed it, and Britain did not govern it. Police are reported to have entered only in large groups until the raids of 1973–74. It was also home to tens of thousands of ordinary residents, with small factories, shops and unlicensed dental clinics.",
    fiction:
      "A walled kingdom with one ruling society, a clear border and a final showdown is easy to dramatise. The real enclave was a crowded neighbourhood, and most of the people in it were not gangsters.",
  },
];

// ─── Walled City timeline ────────────────────────────────────────────────────

export type TimelineEntry = {
  year: string;
  title: string;
  text: string;
  level: EvidenceLevel;
};

export const TRIAD_TIMELINE: TimelineEntry[] = [
  {
    year: "1760s",
    title: "The Heaven and Earth Society appears",
    text: "The Tiandihui (天地会), also called Hung Mun (洪门) and Sam Hop Wui (三合会, the source of the word “triad”), emerges in southern China as a sworn brotherhood offering mutual aid and protection. Historians place its founding around 1760 or 1769; the exact date and founder remain debated.",
    level: "attested",
  },
  {
    year: "Legend",
    title: "The Shaolin foundation story",
    text: "The society's own origin story says Shaolin monks who had served the Qing court were betrayed and their monastery burned, and a handful of survivors, the Five Ancestors, founded the brotherhood to oppose the Qing and restore the Ming (反清复明). Versions differ; one popular telling has 128 monks, of whom 110 died. Historians treat it as a foundation myth, not a documented event.",
    level: "tradition",
  },
  {
    year: "1845",
    title: "Hong Kong outlaws the triads",
    text: "On 8 January 1845 the colony's Legislative Council passed Ordinance No. 1, the first of its sessions, for the suppression of the Triad and other secret societies. An amending ordinance that October added exceptions for people who had joined in ignorance or under duress.",
    level: "attested",
  },
  {
    year: "1898",
    title: "The Walled City is left out",
    text: "The Convention for the Extension of Hong Kong Territory leased the New Territories to Britain for 99 years but excluded the Walled City, then home to roughly 700 people. Britain soon moved against the Chinese officials stationed there, yet the enclave's legal status stayed unresolved.",
    level: "attested",
  },
  {
    year: "1912–45",
    title: "A claim nobody enforced",
    text: "After the Qing fell in 1912 the Republic of China protested and claimed jurisdiction, while Britain did not govern the enclave in practice. During the Japanese occupation (1941–45) the old wall was demolished to supply building material for the nearby airport.",
    level: "attested",
  },
  {
    year: "1950s",
    title: "The societies take the vice trade",
    text: "Groups such as the 14K and Sun Yee On gained control of the Walled City's brothels, gambling parlours and opium dens, and police are reported to have entered only in large groups. One estimate puts triad membership across the colony as high as 300,000 in the 1950s.",
    level: "attested",
  },
  {
    year: "1973–74",
    title: "The raids and the ICAC",
    text: "A series of more than 3,500 police raids in 1973 and 1974 produced over 2,500 arrests and about 1,800 kg of seized drugs, and the societies' hold began to weaken. In the same period, on 8 June 1973, Chief Superintendent Peter Godber slipped out of Hong Kong while under corruption investigation, provoking a public outcry. The Independent Commission Against Corruption was founded on 15 February 1974.",
    level: "attested",
  },
  {
    year: "1983–95",
    title: "Declared under control, then demolished",
    text: "In 1983 the Kowloon City police commander declared the enclave's crime under control. Demolition was announced in 1987, ran from March 1993 to April 1994, and Kowloon Walled City Park opened on the site in December 1995.",
    level: "attested",
  },
];

// ─── Glossary of supporting terms ────────────────────────────────────────────

export type GlossaryEntry = { cn: string; en: string; text: string; level: EvidenceLevel };

export const TRIAD_GLOSSARY: GlossaryEntry[] = [
  {
    cn: "香主",
    en: "Heung Chu · Incense Master",
    text: "Responsible for ceremony and ritual, and traditionally the officer who presided over initiation. Code 438, which some lists also give to the Deputy Mountain Master (副山主).",
    level: "attested",
  },
  {
    cn: "先锋",
    en: "Sin Fung · Vanguard",
    text: "An officer associated with recruiting and, in some accounts, field operations. Code 437 in many lists; descriptions of the exact duties differ.",
    level: "attested",
  },
  {
    cn: "蓝灯笼",
    en: "Blue Lantern",
    text: "Commonly described as an associate who follows a big brother on a verbal understanding, without a formal initiation. Outside the sworn ranks.",
    level: "pop",
  },
  {
    cn: "二五仔",
    en: "Yi Ng Zai · “Two-Five Boy”",
    text: "Cantonese slang for a traitor or informer. The number 25 is said to denote an undercover officer or a spy planted by another society, though explanations of the code vary.",
    level: "pop",
  },
  {
    cn: "坐馆",
    en: "Zo Gun · “Sitting in the hall”",
    text: "A Cantonese term for the incumbent head of a society, common in Hong Kong reporting and gangster films.",
    level: "pop",
  },
  {
    cn: "扎职",
    en: "Jaat Zik · Taking office",
    text: "The ceremony at which a member is formally promoted to an office. Familiar mostly from Hong Kong screen fiction; actual rites varied.",
    level: "pop",
  },
];

// ─── FAQ (also emitted as FAQPage JSON-LD) ───────────────────────────────────

export type FaqEntry = { q: string; a: string };

export const TRIAD_FAQ: FaqEntry[] = [
  {
    q: "What do the numbers 489, 438, 426, 415, 432 and 49 mean?",
    a: "They are the traditional triad rank codes. 489 is the Mountain Master or Dragon Head, 438 the Deputy Mountain Master (also given to the Incense Master in some lists), 426 the Red Pole or enforcer, 415 the White Paper Fan or adviser, 432 the Straw Sandal or liaison, and 49 the rank-and-file soldier. Sources disagree on some digits, and the numbers are best read as ritual code rather than an official career ladder.",
  },
  {
    q: "Is the Wo Hing Society a real triad?",
    a: "As the novel presents it, the Wo Hing Society is fictional. Its rank titles, numbers and ritual vocabulary come from real Hung Mun and triad tradition, and its name follows the pattern of real societies such as Wo Shing Wo (和胜和) and Wo Hop To (和合图).",
  },
  {
    q: "Did triads really control Kowloon Walled City?",
    a: "From the 1950s, groups such as the 14K and Sun Yee On controlled much of the enclave's brothels, gambling parlours and opium dens, and police are reported to have entered only in large groups. A series of more than 3,500 raids in 1973 and 1974 weakened that hold, and the Walled City was demolished between 1993 and 1994.",
  },
  {
    q: "Is the triad hierarchy a ladder you climb?",
    a: "Not strictly. The Red Pole, White Paper Fan and Straw Sandal are usually described as different jobs, covering enforcement, administration and liaison, rather than successive promotions. Popular fiction often lines them up as a ladder because it makes a story easy to follow.",
  },
  {
    q: "Where does the word “triad” come from?",
    a: "From the Cantonese name Sam Hop Wui (三合会), meaning the Three United or Three Harmonies Society. It is one of several names, alongside Tiandihui (Heaven and Earth Society) and Hung Mun, for the southern Chinese brotherhood that Hong Kong's societies trace themselves back to.",
  },
];

// ─── Sources ─────────────────────────────────────────────────────────────────

export type SourceEntry = { label: string; note: string; href?: string };

export const TRIAD_SOURCES: SourceEntry[] = [
  {
    label: "Historical Laws of Hong Kong Online (HKU Libraries): Triad and Secret Societies Ordinance, No. 1 of 1845",
    note: "The colony's first ordinance against triad membership.",
    href: "https://oelawhk.lib.hku.hk/items/show/27",
  },
  {
    label: "Independent Commission Against Corruption: history of the ICAC",
    note: "Godber's escape on 8 June 1973 and the founding of the ICAC in February 1974.",
    href: "https://www.icac.org.hk/en/about/history",
  },
  {
    label: "Kowloon Walled City (Wikipedia)",
    note: "The 1898 convention, 1950s triad control, the 1973–74 raids and the 1993–94 demolition.",
    href: "https://en.wikipedia.org/wiki/Kowloon_Walled_City",
  },
  {
    label: "Triad (organised crime) (Wikipedia)",
    note: "Numeric rank codes and the 1760s founding of the Tiandihui.",
    href: "https://en.wikipedia.org/wiki/Triad_(organised_crime)",
  },
  {
    label: "PBS Wide Angle: Chinese Triads, At Home and Abroad (2006)",
    note: "Structure of Hong Kong triad groups, the Tiandihui origin legend and the post-1911 turn to crime.",
    href: "https://www.pbs.org/wnet/wideangle/uncategorized/18-with-a-bullet-china-chinese-triads/1537/",
  },
  {
    label: "Roots.gov.sg (Singapore National Heritage Board): Hung fan record",
    note: "The white fan as a recognition token among Hung Mun members.",
    href: "https://www.roots.gov.sg/Collection-Landing/listing/1118878",
  },
  {
    label: "Dian Murray and Qin Baoqi, The Origins of the Tiandihui (Stanford University Press, 1994)",
    note: "On the Tiandihui in legend and history. Best starting point for separating the two.",
  },
  {
    label: "Yiu Kong Chu, The Triads as Business (Routledge, 2000)",
    note: "How Hong Kong triad groups actually operated and earned.",
  },
  {
    label: "Greg Girard and Ian Lambot, City of Darkness (1993; revised as City of Darkness Revisited, 2014)",
    note: "Photography and documentation of daily life inside the Walled City.",
  },
];
