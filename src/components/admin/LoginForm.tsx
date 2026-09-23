// Admin sign-in form. Authentication is not connected in this stage: the
// form validates input, then explains that sign-in is not available yet and
// links to the dashboard. No fake signed-in state is created.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { LogIn } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "../../lib/validation/inquiry";
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

export default function LoginForm() {
  const [phase, setPhase] = useState<"editing" | "unavailable">("editing");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    reValidateMode: "onChange",
  });

  if (phase === "unavailable") {
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

  return (
    <form onSubmit={handleSubmit(() => setPhase("unavailable"))} noValidate aria-label="Sign in">
      <div className="ad-stack">
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
          <TextInput
            id="login-password"
            type="password"
            autoComplete="current-password"
            error={isSubmitted ? errors.password?.message : undefined}
            {...register("password")}
          />
        </AdField>
        <p>
          <button type="submit" className="ad-button ad-button--primary ad-login-submit">
            <LogIn size={16} aria-hidden="true" />
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
}
