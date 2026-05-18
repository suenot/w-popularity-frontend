import type { Platform } from "@/lib/platforms";
import { PLATFORM_COLORS, PLATFORM_NAMES } from "@/lib/platforms";
import PlatformIcon from "./PlatformIcon";

interface Props {
  platform: Platform;
  size?: "sm" | "md";
}

export default function PlatformBadge({ platform, size = "sm" }: Props) {
  const color = PLATFORM_COLORS[platform];
  const cls =
    size === "sm"
      ? "text-xs px-2 py-0.5 gap-1.5"
      : "text-sm px-3 py-1 gap-2";
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
