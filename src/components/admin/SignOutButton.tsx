// Sidebar sign-out button (DEC-025). Signs out of Supabase Auth (clearing the
// session cookies the middleware reads) and returns to the sign-in page.
// Renders nothing when Supabase is not configured.

import { useState } from "react";
import { LogOut } from "lucide-react";
import { getSupabaseBrowser, isSupabaseConfigured } from "../../lib/supabase/client";

export default function SignOutButton() {
  const [configured] = useState(() => isSupabaseConfigured());
  const [signingOut, setSigningOut] = useState(false);

  if (!configured) return null;

  async function onSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await getSupabaseBrowser().auth.signOut();
    } catch {
      // Session cookies are httpOnly-safe to abandon: the middleware treats
      // a stale session as signed out. Always leave the admin area.
    } finally {
      window.location.assign("/admin/login");
    }
  }

  return (
    <button
      type="button"
      className="ad-button ad-button--tertiary ad-signout-button"
      onClick={onSignOut}
      disabled={signingOut}
    >
      <LogOut size={16} aria-hidden="true" />
      {signingOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
