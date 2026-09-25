// Admin sign-in form backed by Supabase Auth (DEC-025).
//
// Validates input, then signs in with email + password. The session persists
// in cookies so the server middleware can guard /admin/* routes. No password
// is stored anywhere in the application database.

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "../../lib/validation/inquiry";
import { getSupabaseBrowser, isSupabaseConfigured } from "../../lib/supabase/client";
import { AdField, Notice, TextInput } from "./fields";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .refine((value) => EMAIL_RE.test(value), "Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

type LoginInput = z.infer<typeof loginSchema>;

/** Map Supabase auth failures to plain-language messages (never raw errors). */
function friendlyAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) {
    return "Email or password did not match. Try again.";
  }
  if (/email not confirmed/i.test(message)) {
    return "This email address has not been confirmed yet. Check with the site owner.";
  }
  if (/too many requests|rate limit/i.test(message)) {
    return "Too many sign-in attempts. Wait a minute and try again.";
  }
  return "Sign-in failed. Check your details and try again.";
}

export default function LoginForm() {
  const [unavailable, setUnavailable] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    reValidateMode: "onChange",
  });

  // Already signed in (e.g. back-button to /admin/login): skip the form.
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setUnavailable(true);
      return;
    }
    let cancelled = false;
    getSupabaseBrowser()
      .auth.getSession()
      .then(({ data }) => {
        if (!cancelled && data.session) window.location.replace("/admin");
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (unavailable) {
    return (
      <div className="ad-stack">
        <Notice tone="info" title="Sign-in isn't connected yet.">
          <p>Continue to the dashboard to manage website content.</p>
        </Notice>
        <p>
          <a className="ad-button ad-button--primary" href="/admin">
            Continue to dashboard
          </a>
        </p>
      </div>
    );
  }

  async function onValid(input: LoginInput) {
    setAuthError(null);
    setSigningIn(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });
      if (error) {
        setAuthError(friendlyAuthError(error.message));
        return;
      }
      window.location.assign("/admin");
    } catch {
      setAuthError("Sign-in failed. Check your connection and try again.");
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate aria-label="Sign in">
      <div className="ad-stack">
        {authError ? (
          <Notice tone="error" title="Could not sign in.">
            <p>{authError}</p>
          </Notice>
        ) : null}
        <AdField
          id="login-email"
          label="Email address"
          required
          error={isSubmitted ? errors.email?.message : undefined}
        >
          <TextInput
            id="login-email"
            type="email"
            autoComplete="email"
            error={isSubmitted ? errors.email?.message : undefined}
            {...register("email")}
          />
        </AdField>
        <AdField
          id="login-password"
          label="Password"
          required
          error={isSubmitted ? errors.password?.message : undefined}
        >
          <div className="ad-login-field">
            <TextInput
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              error={isSubmitted ? errors.password?.message : undefined}
              {...register("password")}
            />
            <button
              type="button"
              className="ad-login-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </AdField>
        <p>
          <button
            type="submit"
            className="ad-button ad-button--primary ad-login-submit"
            disabled={signingIn}
          >
            <LogIn size={16} aria-hidden="true" />
            {signingIn ? "Signing in…" : "Sign in"}
          </button>
        </p>
      </div>
    </form>
  );
}
