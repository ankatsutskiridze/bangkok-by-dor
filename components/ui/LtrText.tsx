import { cn } from "@/lib/utils/cn";

type Props = {
  children: React.ReactNode;
  /**
   * Allows the run to break across lines. Off by default — see below. Turn it
   * on for long Latin strings such as a full place name, where forcing one
   * line would push the paragraph wider than its measure.
   */
  allowWrap?: boolean;
  className?: string;
};

/**
 * Keeps a run of text left-to-right inside right-to-left copy.
 *
 * `docs/DESIGN_SYSTEM.md` §82 and `docs/CONTENT.md` §137: numbers, prices, THB
 * amounts, ratings, dish names and Latin place names stay LTR inside Hebrew
 * text. Without this they render in the wrong order — "₪79" becomes "79₪" and
 * a rating like "9.7/10" can reverse entirely.
 *
 * Two things make it work, and both were confirmed in the browser rather than
 * assumed:
 *
 * 1. `dir` makes the browser treat the span as a bidirectional isolate, so the
 *    surrounding Hebrew is unaffected by what is inside it. Without it, a
 *    Hebrew sentence ending in "…ב־P2-18." rendered as "P2--18" — the prefix
 *    hyphen was pulled into the Latin run.
 * 2. Not wrapping. Isolation alone still let the line break inside the run,
 *    leaving "P2-" on one line and "18." leading the next. A price split
 *    across two lines is not a price.
 */
export function LtrText({ children, allowWrap = false, className }: Props) {
  return (
    <span
      dir="ltr"
      className={cn(!allowWrap && "whitespace-nowrap", className)}
    >
      {children}
    </span>
  );
}
