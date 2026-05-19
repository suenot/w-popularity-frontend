import type { Platform } from "@/lib/platforms";
import { PLATFORM_COLORS, PLATFORM_NAMES } from "@/lib/platforms";
import PlatformIcon from "./PlatformIcon";

interface Props {
  platform: Platform;
  size?: "sm" | "md";
}

export default function PlatformBadge({ platform, size = "sm" }: Props) {
  const cls =
    size === "sm"
      ? "text-xs px-2 py-0.5 gap-1.5"
      : "text-sm px-3 py-1 gap-2";

  // X and GitHub brand colours are near-black, which disappears against a
  // dark app background. Use a theme-aware palette via Tailwind utilities
  // instead of inline `style` — dark-on-light, light-on-dark.
  if (platform === "x" || platform === "github") {
    return (
      <span
        className={
          "inline-flex items-center rounded-full font-medium border " +
          "bg-neutral-900/10 text-neutral-900 border-neutral-900/30 " +
          "dark:bg-neutral-100/10 dark:text-neutral-100 dark:border-neutral-100/30 " +
          cls
        }
      >
        <PlatformIcon platform={platform} size={size === "sm" ? 12 : 14} color="currentColor" />
        {PLATFORM_NAMES[platform]}
      </span>
    );
  }

  const color = PLATFORM_COLORS[platform];
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${cls}`}
      style={{
        backgroundColor: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      <PlatformIcon platform={platform} size={size === "sm" ? 12 : 14} color={color} />
      {PLATFORM_NAMES[platform]}
    </span>
  );
}
