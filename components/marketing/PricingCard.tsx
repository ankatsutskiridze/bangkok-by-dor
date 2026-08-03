import { LtrText } from "@/components/ui/LtrText";
import { cn } from "@/lib/utils/cn";

type Props = {
  /** "₪79" — the amount and its symbol, already formatted for the locale. */
  price: string;
  /** "lifetime" — the term, already translated. */
  term: string;
  /** The purchase action. Passed in so the card never owns the CTA's behaviour. */
  action: React.ReactNode;
  /** One line of reassurance, e.g. what "lifetime" includes. */
  note?: string;
  className?: string;
};

/**
 * `docs/DESIGN_SYSTEM.md` §4 and `docs/CONTENT.md` §Copy: **₪79 · lifetime,
 * always visible next to the CTA**.
 *
 * The price sits beside the button on purpose, never behind a click. A guide
 * that hides its price until the checkout page is doing the thing
 * `docs/RULES.md` bans elsewhere — earning the click before earning the trust.
 *
 * The price is LTR-isolated: "₪79" inside Hebrew reverses to "79₪" without it.
 * Tabular figures so a price never shifts width between renders.
 */
export function PricingCard({ price, term, action, note, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface-raised p-6",
        className,
      )}
    >
      <p className="flex items-baseline gap-2">
        <LtrText className="text-display-2 tabular-nums text-text">{price}</LtrText>
        <span className="text-small text-text-muted">{term}</span>
      </p>

      {note ? <p className="mt-3 text-small text-text-muted">{note}</p> : null}

      <div className="mt-6">{action}</div>
    </div>
  );
}
