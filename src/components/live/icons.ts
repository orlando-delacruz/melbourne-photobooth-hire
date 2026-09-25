// Shared card/service icon glyphs for live islands (DEC-033).
// Verbatim copies of the Card.astro icon map (camera/users/video) plus the
// Hero stat glyphs (clock/qrcode) and the checklist check glyph, so live
// islands resolve the same artwork as SSR at any size.
export type CardIconName = "camera" | "users" | "video" | "clock" | "qrcode";

const CARD_ICON_PATHS: Record<CardIconName, string> = {
  camera:
    '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  video: '<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  qrcode:
    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h7v7h-7z"/>',
};

export function cardIconSvg(name: CardIconName | string | undefined, size = 20): string {
  const inner = (name && CARD_ICON_PATHS[name as CardIconName]) || "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

export const CHECK_SVG_INNER = '<path d="m5 12.5 4.5 4.5L19 7"/>';
