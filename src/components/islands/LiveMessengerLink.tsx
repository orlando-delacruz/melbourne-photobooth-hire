// Live Messenger button (DEC-033).
//
// Mirrors FloatingMessenger.astro with a live destination URL from Site
// Settings. Styles come from styles/live.css.
import type { SiteSettingsContent } from "../../lib/cms/types";
import "../../styles/live.css";
import { useLiveSettings } from "./useLiveSettings";

const CHAT_SVG =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M8.5 11.5h.01"/><path d="M12 11.5h.01"/><path d="M15.5 11.5h.01"/></svg>';

export default function LiveMessengerLink({
  initialSettings,
}: {
  initialSettings: SiteSettingsContent;
}) {
  const settings = useLiveSettings(initialSettings);
  return (
    <a
      className="floating-messenger"
      href={settings.messengerUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on Facebook Messenger (opens in a new tab)"
    >
      <span className="fm-ring" aria-hidden="true" />
      <span className="fm-icon" dangerouslySetInnerHTML={{ __html: CHAT_SVG }} />
      <span className="fm-label" aria-hidden="true">
        Chat with us
      </span>
    </a>
  );
}
