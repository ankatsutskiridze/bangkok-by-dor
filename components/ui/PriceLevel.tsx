import { LtrText } from "@/components/ui/LtrText";
import { cn } from "@/lib/utils/cn";

export const PRICE_LEVELS = ["$", "$$", "$$$", "$$$$"] as const;

export type PriceLevelValue = (typeof PRICE_LEVELS)[number];

type Props = {
  value: PriceLevelValue;
  /** The accessible sentence, already translated. */
  label: string;
  className?: string;
};

const MAX = 4;

/**
 * `docs/CONTENT.md` §1.1 — `$` to `$$$$`.
 *
 * Gold marks the filled symbols, but `docs/BRAND.md` is explicit that it is
 * "a seasoning, not a paint" and `docs/DESIGN_SYSTEM.md` §7 measures it at
 * ~2.1:1 on warm white. So the meaning is carried by **how many symbols are
 * filled**, which survives with colour removed, and by the label. The colour
 * is a second, redundant signal — never the only one.
 */
export function PriceLevel({ value, label, className }: Props) {
  const filled = value.length;

  return (
    <span
      role="img"
      aria-label={label}
      className={cn("inline-block", className)}
    >
      <LtrText>
        <span className="text-accent">{"$".repeat(filled)}</span>
        {/* The unfilled remainder keeps the row a constant width, so a
            column of prices does not jitter between rows. */}
        <span className="text-text-muted opacity-40">
          {"$".repeat(MAX - filled)}
        </span>
      </LtrText>
    </span>
  );
}
