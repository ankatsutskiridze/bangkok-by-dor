"use client";

import { useId, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

type Props = {
  /** Visible label. A placeholder is not a label. */
  label: string;
  submitLabel: string;
  /** Shown when the address does not parse. Written in Dor's voice. */
  invalidMessage: string;
  /** Shown when the submit itself fails. Must offer a next action (P1-29). */
  errorMessage: string;
  /** Optional helper text under the field, e.g. why the email is needed. */
  hint?: string;
  onSubmit: (email: string) => Promise<void>;
  className?: string;
};

// Zod rather than a hand-rolled regex — it is already a dependency for env and
// will validate the same address again on the server (P4-04). One definition of
// "valid email" across the codebase, not two that disagree at the edges.
const emailSchema = z.email();

/**
 * `docs/DESIGN_SYSTEM.md` §7 and P1-27.
 *
 * The email is the account. `docs/TECHNICAL.md` §4 keys the whole purchase and
 * magic-link flow on it, so a typo here is a support ticket rather than a
 * validation message. That is why the error is specific and never blames the
 * reader.
 *
 * Validation runs on submit, not on every keystroke: telling someone their
 * address is invalid while they are still typing the third character is noise.
 */
export function EmailForm({
  label,
  submitLabel,
  invalidMessage,
  errorMessage,
  hint,
  onSubmit,
  className,
}: Props) {
  const id = useId();
  const inputId = `${id}-email`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!emailSchema.safeParse(email.trim()).success) {
      setError(invalidMessage);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(email.trim());
    } catch {
      // The message says what to do next, never just that something broke.
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("w-full", className)}>
      {/* A real label, always visible. Placeholder-as-label disappears the
          moment someone starts typing, which is when they most need it. */}
      <label htmlFor={inputId} className="block text-small text-text">
        {label}
      </label>

      {hint ? (
        <p id={hintId} className="mt-1 text-caption text-text-muted">
          {hint}
        </p>
      ) : null}

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          // Latin script regardless of the interface language: an email address
          // is never Hebrew, and an RTL input would put the cursor on the wrong
          // side of it.
          dir="ltr"
          disabled={isSubmitting}
          aria-invalid={error ? true : undefined}
          // Points at whichever of the two exist, so the hint is announced when
          // there is no error and the error replaces it when there is.
          aria-describedby={cn(error && errorId, hint && hintId) || undefined}
          className={cn(
            "h-11 w-full rounded-md border bg-surface px-4 text-body text-text md:h-12",
            "outline-focus focus-visible:outline-2 focus-visible:outline-offset-2",
            "disabled:opacity-50",
            error ? "border-caution" : "border-border",
          )}
        />

        <Button type="submit" isLoading={isSubmitting} className="shrink-0">
          {submitLabel}
        </Button>
      </div>

      {/*
        `role="alert"` so the message is announced when it appears — a screen
        reader user who has already moved past the field would otherwise never
        learn the submit failed. Rendered only when there is something to say,
        so an empty live region cannot announce nothing.
      */}
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-small text-caution">
          {error}
        </p>
      ) : null}
    </form>
  );
}
