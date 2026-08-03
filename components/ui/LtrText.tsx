type Props = {
  children: React.ReactNode;
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
 * The `dir` attribute also makes the browser treat the span as a bidirectional
 * isolate, so the surrounding Hebrew is unaffected by what is inside it.
 */
export function LtrText({ children, className }: Props) {
  return (
    <span dir="ltr" className={className}>
      {children}
    </span>
  );
}
