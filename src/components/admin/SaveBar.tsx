// Sticky save bar for admin section editors: dirty state, save, discard
// and reset-to-original actions. Save persists to the local mock store;
// discard and reset ask for confirmation before throwing work away.

import { RotateCcw, Save } from "lucide-react";

interface SaveBarProps {
  dirty: boolean;
  saving: boolean;
  savedAt: string | null;
  onSave: () => void;
  onDiscard: () => void;
  onResetSection: () => void;
}

function formatSavedAt(savedAt: string): string {
  try {
    return new Date(savedAt).toLocaleString("en-AU", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return savedAt;
  }
}

export default function SaveBar({
  dirty,
  saving,
  savedAt,
  onSave,
  onDiscard,
  onResetSection,
}: SaveBarProps) {
  return (
    <div className="ad-savebar" role="group" aria-label="Save actions">
      <p className={`ad-dirty${dirty ? "" : " ad-dirty--clean"}`}>
        <span className="ad-dirty-dot" aria-hidden="true" />
        {dirty ? "Unsaved changes" : "All changes saved"}
      </p>
      {savedAt && !dirty ? (
        <span className="ad-saved-at">Saved {formatSavedAt(savedAt)}</span>
      ) : null}
      <button
        type="button"
        className="ad-button ad-button--tertiary"
        onClick={onResetSection}
        disabled={saving}
      >
        <RotateCcw size={15} aria-hidden="true" />
        Reset section
      </button>
      <button
        type="button"
        className="ad-button ad-button--secondary"
        onClick={onDiscard}
        disabled={!dirty || saving}
      >
        Discard
      </button>
      <button
        type="button"
        className="ad-button ad-button--primary"
        onClick={onSave}
        disabled={!dirty || saving}
      >
        <Save size={16} aria-hidden="true" />
        {saving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}
