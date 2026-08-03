import { cn } from "@/lib/utils/cn";

type Props = {
  /** Already translated — "Skip to content". */
  label: string;
  /** The id of the main landmark it jumps to. */
  targetId?: string;
  className?: string;
};

/**
 * `docs/TECHNICAL.md` §2 / P0-09.
 *
 * The first thing in the tab order, and invisible until it has focus. Without
 * it a keyboard reader tabs through the whole header on every page before
 * reaching the content — which on a guide people navigate constantly is dozens
 * of wasted presses a session.
 *
 * Positioned off-screen rather than `display: none` or `visibility: hidden`,
 * because both of those remove it from the tab order and it would never be
 * reachable at all.
 */
export function SkipLink({ label, targetId = "content", className }: Props) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only",
        // `focus:` rather than `focus-visible:` — reaching this link is always
        // a keyboard action, so there is no mouse case to exclude.
        "focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50",
        "focus:rounded-md focus:bg-action focus:px-4 focus:py-2 focus:text-small focus:text-on-action",
        "outline-focus focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
    >
      {label}
    </a>
  );
}
