// Renders a CMS icon key as a Lucide glyph (DEC-045).
//
// One map for every CMS-selectable icon field (hero stats, process steps,
// services). Static imports keep the set tree-shakeable; unknown or blank
// keys render nothing so legacy data can never break a page.
import {
  BadgeCheck,
  Briefcase,
  Cake,
  CalendarDays,
  Camera,
  Car,
  CircleCheckBig,
  Clock,
  Download,
  Flame,
  Gem,
  Gift,
  Heart,
  Info,
  Mail,
  MapPin,
  MessageSquare,
  Music,
  Palette,
  PartyPopper,
  Phone,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Users,
  UtensilsCrossed,
  Video,
  Wifi,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CmsIconName } from "../../lib/cms/icons";

const ICONS: Record<CmsIconName, LucideIcon> = {
  camera: Camera,
  users: Users,
  video: Video,
  clock: Clock,
  qrcode: QrCode,
  star: Star,
  "shield-check": ShieldCheck,
  "badge-check": BadgeCheck,
  sparkles: Sparkles,
  heart: Heart,
  "calendar-days": CalendarDays,
  "map-pin": MapPin,
  phone: Phone,
  mail: Mail,
  "circle-check": CircleCheckBig,
  music: Music,
  "party-popper": PartyPopper,
  gift: Gift,
  ticket: Ticket,
  printer: Printer,
  download: Download,
  wifi: Wifi,
  "utensils-crossed": UtensilsCrossed,
  wine: Wine,
  car: Car,
  briefcase: Briefcase,
  cake: Cake,
  gem: Gem,
  message: MessageSquare,
  palette: Palette,
  info: Info,
  flame: Flame,
};

export default function CmsIcon({
  name,
  size = 20,
  strokeWidth = 1.7,
  className,
}: {
  name?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  if (!name) return null;
  const Icon = ICONS[name as CmsIconName];
  if (!Icon) return null;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
