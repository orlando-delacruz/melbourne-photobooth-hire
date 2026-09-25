// Central admin alert system (SweetAlert2). Every destructive confirmation,
// success note and operational error in the admin flows through these
// helpers so modals look and behave the same everywhere. SweetAlert2 is
// imported lazily so the admin islands stay SSR-safe; buttons reuse the
// admin `ad-button` classes and destructive confirms get the danger
// treatment. Form validation summaries stay inline and are untouched.
//
// Every dialog is a true centered modal: `MODAL_BASE` below guarantees
// `position: "center"` with the backdrop enabled, so the admin behind is
// dimmed and uninteractable and the dialog renders above all admin layers
// (SweetAlert2's container sits far above the sidebar/topbar/savebar).
// Callers never set position or backdrop themselves.

type SwalModule = typeof import("sweetalert2");

async function swal(): Promise<SwalModule["default"]> {
  const module = await import("sweetalert2");
  return module.default;
}

/** Inherited by every dialog fired from this module. Do not override per call. */
const MODAL_BASE = {
  position: "center",
  backdrop: true,
  buttonsStyling: false,
} as const;

const BUTTON_CLASSES = {
  container: "ad-swal-container",
  confirmButton: "ad-button ad-button--primary",
  cancelButton: "ad-button ad-button--secondary",
} as const;

const DANGER_BUTTON_CLASSES = {
  container: "ad-swal-container",
  confirmButton: "ad-button ad-button--primary ad-button--destructive",
  cancelButton: "ad-button ad-button--secondary",
} as const;

// Icon colors mirror styles/tokens.css (--color-success/warning/error);
// SweetAlert2 needs literals here, so keep both sides in sync by hand.
const ICON_COLORS = {
  success: "#1f6e43",
  warning: "#8a5a00",
  error: "#b3261e",
} as const;

const SUCCESS_CLASSES = {
  container: "ad-swal-container",
} as const;

interface DestructiveOptions {
  title: string;
  text?: string;
  confirmText: string;
}

/**
 * Warning confirmation for irreversible actions. Resolves true only when the
 * admin explicitly confirms; cancel, dismiss and Escape resolve false, with
 * focus starting on Cancel so Enter never destroys.
 */
export async function confirmDestructive({
  title,
  text,
  confirmText,
}: DestructiveOptions): Promise<boolean> {
  const Swal = await swal();
  const result = await Swal.fire({
    ...MODAL_BASE,
    title,
    text,
    icon: "warning",
    iconColor: ICON_COLORS.warning,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
    focusCancel: true,
    customClass: DANGER_BUTTON_CLASSES,
  });
  return result.isConfirmed;
}

/** Destructive confirmation for whole-item deletes. */
export async function confirmDelete(itemLabel: string): Promise<boolean> {
  return confirmDestructive({
    title: `Delete "${itemLabel}"?`,
    text: "This cannot be undone.",
    confirmText: "Delete",
  });
}

/** Confirmation before discarding unsaved form edits. */
export async function confirmDiscardChanges(): Promise<boolean> {
  const Swal = await swal();
  const result = await Swal.fire({
    ...MODAL_BASE,
    title: "Discard unsaved changes?",
    text: "Your edits will be replaced with the saved values.",
    icon: "warning",
    iconColor: ICON_COLORS.warning,
    showCancelButton: true,
    confirmButtonText: "Discard",
    cancelButtonText: "Keep editing",
    focusCancel: true,
    customClass: DANGER_BUTTON_CLASSES,
  });
  return result.isConfirmed;
}

/** Confirmation before resetting a section to the original website content. */
export async function confirmResetSection(): Promise<boolean> {
  return confirmDestructive({
    title: "Reset this section?",
    text: "Saved edits for this section will be removed.",
    confirmText: "Reset section",
  });
}

/**
 * Centered success modal that dismisses itself. A proper modal (backdrop,
 * non-interactable background) rather than a corner toast. Fire and forget:
 * `void notifySuccess(...)`.
 */
export async function notifySuccess(title: string): Promise<void> {
  const Swal = await swal();
  await Swal.fire({
    ...MODAL_BASE,
    title,
    icon: "success",
    iconColor: ICON_COLORS.success,
    showConfirmButton: false,
    timer: 2200,
    customClass: SUCCESS_CLASSES,
  });
}

/**
 * Error modal for failed operations. Takes a human-readable message only;
 * callers must never pass raw errors, stack traces or backend details.
 */
export async function notifyError(title: string, body?: string): Promise<void> {
  const Swal = await swal();
  await Swal.fire({
    ...MODAL_BASE,
    title,
    text: body ?? "Please try again.",
    icon: "error",
    iconColor: ICON_COLORS.error,
    confirmButtonText: "Dismiss",
    customClass: BUTTON_CLASSES,
  });
}
