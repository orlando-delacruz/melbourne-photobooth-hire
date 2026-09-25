// Occasion chips mirror for live islands (DEC-033).
// Matches index.astro: ul.chip-list (global) + .chip-icon (live.css).
import { eventIconSvg } from "./eventIcons";

export default function LiveChips({ labels }: { labels: string[] }) {
  return (
    <ul className="chip-list">
      {labels.map((label) => (
        <li key={label}>
          <span
            className="chip-icon"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: eventIconSvg(label) }}
          />
          {label}
        </li>
      ))}
    </ul>
  );
}
