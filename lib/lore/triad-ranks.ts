// Static lore data: Wo Hing Society (和兴社) triad hierarchy
// Set in the Kowloon Walled City, 1970s Hong Kong noir.
// Novel: Transmigrated into the Villain's Sickly Childhood Friend.
// Strictly ordered lowest → highest tier. No CMS dependency.

export interface TriadRank {
  id: string;
  term_cn: string;
  term_en: string;
  /** Traditional triad numeric code (e.g. 49, 432, 415, 426, 489) */
  code_number: string;
  /** 1 = lowest foot soldier, 5 = supreme Dragonhead */
  tier: number;
  badge_symbol:
    | "dice"
    | "straw-sandal"
    | "white-paper-fan"
    | "red-pole"
    | "dragon-crest";
  summary: string;
  story_hint: string;
  /** First 3 ranks free; top 2 ranks Patreon-gated */
  is_patreon_gated: boolean;
}

export const TRIAD_RANKS: TriadRank[] = [
  {
    id: "four-nine-boy",
    term_cn: "四九仔",
    term_en: "Four-Nine Boy",
    code_number: "49",
    tier: 1,
    badge_symbol: "dice",
    summary:
      "The foundational foot soldiers and newly initiated members of the society. Bound to street obedience, they are often assigned dirty tasks or expendable distractions with little survival guarantee.",
    story_hint:
      "Chan Ka Nam has lingered here for two years under Brother Four's watch, deliberately hiding his lethal martial arts behind crude street brawling to keep Kiu Man out of danger.",
    is_patreon_gated: false,
  },
  {
    id: "straw-sandal",
    term_cn: "草鞋",
    term_en: "Straw Sandal",
    code_number: "432",
    tier: 2,
    badge_symbol: "straw-sandal",
    summary:
      "The liaison and communications officer of the society. Responsible for relaying orders between bosses, managing local gambling stalls, and handling neighbourhood logistics.",
    story_hint:
      "The rank held by Chiu Ah Four (Brother Four). Despite being Master Leopard's nephew, he remains a humble operator of modest dens who looks after his younger brothers.",
    is_patreon_gated: false,
  },
  {
    id: "white-paper-fan",
    term_cn: "白纸扇",
    term_en: "White Paper Fan",
    code_number: "415",
    tier: 3,
    badge_symbol: "white-paper-fan",
    summary:
      "The strategist and administrator of the syndicate. Managing the ledgers, finances, legal loopholes, and underworld rituals, their sharp mind dictates the society's moves from behind the scenes.",
    story_hint:
      "Represented by Uncle Cho at Chun Hing Martial Arts Hall. A calculating figure in traditional scholar robes who oversees the rules of the underworld and high-stakes duels.",
    is_patreon_gated: false,
  },
  {
    id: "red-pole",
    term_cn: "红棍 / 双花红棍",
    term_en: "Red Pole & Double Flower Red Pole",
    code_number: "426",
    tier: 4,
    badge_symbol: "red-pole",
    summary:
      "The vanguard enforcers and master fighters of the lodge. A standard Red Pole leads district muscle and loanshark rings, while the revered 'Double Flower' marks an undisputed champion of combat.",
    story_hint:
      "Currently held by Brother Fly and former legend Master Leopard. In the original novel timeline, a single successful contract murder served as the bloody stepping stone to this rank.",
    is_patreon_gated: true,
  },
  {
    id: "loong-head",
    term_cn: "龙头 / 坐馆",
    term_en: "Loong-head",
    code_number: "489",
    tier: 5,
    badge_symbol: "dragon-crest",
    summary:
      "The supreme lord and Dragonhead of the entire syndicate. Holds absolute command over the mountain lodge, illicit revenue streams, and territorial boundaries within Hong Kong.",
    story_hint:
      "Currently commanded by Chiu Shan Hoi (Master Leopard). A throne destined to be contested as the Walled City heads toward ruthless crackdowns and territorial expansion.",
    is_patreon_gated: true,
  },
];
