import type { Platform } from "@/lib/platforms";
import { PLATFORM_COLORS } from "@/lib/platforms";
import {
  Youtube,
  Twitter,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Hash,
  Code2,
  Wallet,
  LineChart,
  MessageCircle,
  Github,
  ShieldCheck,
} from "lucide-react";

const ICON_MAP: Record<Platform, React.ComponentType<{ size?: number; color?: string }>> = {
  youtube: Youtube,
  x: Twitter,
  telegram: Send,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  habr: Hash,
  stackoverflow: Code2,
  tbank_pulse: Wallet,
  smartlab: LineChart,
  reddit: MessageCircle,
  github: Github,
  marketmaker_auth: ShieldCheck,
};

interface Props {
  platform: Platform;
  size?: number;
  color?: string;
}

export default function PlatformIcon({ platform, size = 16, color }: Props) {
  const Icon = ICON_MAP[platform];
  return <Icon size={size} color={color ?? PLATFORM_COLORS[platform]} />;
}
