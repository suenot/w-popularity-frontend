export type Platform =
  | "youtube"
  | "x"
  | "telegram"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "habr"
  | "stackoverflow"
  | "tbank_pulse"
  | "smartlab"
  | "reddit";

export const PLATFORMS: Platform[] = [
  "youtube",
  "x",
  "telegram",
  "facebook",
  "instagram",
  "linkedin",
  "habr",
  "stackoverflow",
  "tbank_pulse",
  "smartlab",
  "reddit",
];

export const PLATFORM_NAMES: Record<Platform, string> = {
  youtube: "YouTube",
  x: "X",
  telegram: "Telegram",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  habr: "Habr",
  stackoverflow: "Stack Overflow",
  tbank_pulse: "T-Bank Pulse",
  smartlab: "Smart-Lab",
  reddit: "Reddit",
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: "#ff0000",
  x: "#000000",
  telegram: "#26a5e4",
  facebook: "#1877f2",
  instagram: "#e4405f",
  linkedin: "#0a66c2",
  habr: "#5191cd",
  stackoverflow: "#f48024",
  tbank_pulse: "#ffdd2d",
  smartlab: "#1c4e8c",
  reddit: "#ff4500",
};

// URL → platform regex map. The first capture group is the handle.
const PATTERNS: Record<Platform, RegExp> = {
  youtube: /youtube\.com\/(@[\w-]+|channel\/[\w-]+|c\/[\w-]+)/i,
  x: /(?:twitter|x)\.com\/(\w+)/i,
  telegram: /t\.me\/([\w_]+)/i,
  facebook: /facebook\.com\/([\w.-]+)/i,
  instagram: /instagram\.com\/([\w.]+)/i,
  linkedin: /linkedin\.com\/in\/([\w-]+)/i,
  habr: /habr\.com\/[\w-]+\/users\/([\w-]+)/i,
  stackoverflow: /stackoverflow\.com\/users\/(\d+\/[\w-]+)/i,
  tbank_pulse: /tbank\.ru\/invest\/social\/profile\/([\w_]+)/i,
  smartlab: /smart-lab\.ru\/my\/([\w_-]+)/i,
  reddit: /reddit\.com\/(?:user|u)\/([\w-]+)/i,
};

export interface DetectedChannel {
  platform: Platform;
  handle: string;
  url: string;
}

/** Try to detect platform + handle from a URL. Returns null on no match. */
export function detectChannel(rawUrl: string): DetectedChannel | null {
  const url = rawUrl.trim();
  if (!url) return null;
  for (const platform of PLATFORMS) {
    const m = url.match(PATTERNS[platform]);
    if (m) {
      return { platform, handle: m[1], url };
    }
  }
  return null;
}
