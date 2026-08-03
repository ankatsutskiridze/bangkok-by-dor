import { LtrText } from "@/components/ui/LtrText";
import { cn } from "@/lib/utils/cn";

type Props = {
  /** 1–10, one decimal (`docs/CONTENT.md` §1.1). */
  value: number;
  /** The accessible sentence, already translated. */
  label: string;
  className?: string;
};

const MAX = 10;
const STARS = 5;

/**
 * `docs/BRAND.md` §Iconography: stars **and** the numeric value, always
 * together — "★★★★★ 9.7/10". Neither half is optional. Stars alone lose the
 * precision the ratings depend on; the number alone loses the glance value.
 *
 * The stars are text characters rather than icons, which sidesteps D25
 * entirely — and `docs/DESIGN_SYSTEM.md` §Iconography writes the example in
 * exactly these characters.
 *
 * The whole thing is wrapped LTR: inside Hebrew, "9.7/10" reverses without it.
 */
export function Rating({ value, label, className }: Props) {
  // The star row is a rounded impression; the number carries the precision.
  // 9.7 → 5 stars, matching the worked example in the brand document.
  const filled = Math.round((value / MAX) * STARS);

  return (
    <span
      // One label for the pair. Announcing five stars and then a number is
      // the same fact twice.
      role="img"
      aria-label={label}
    >
      {/*
        The **whole** unit is isolated, not just the number.
        `docs/DESIGN_SYSTEM.md` §3 lists ratings among the things that stay LTR
        inside Hebrew. Isolating only the number left the flex row following the
        document direction, so Hebrew rendered "9.7/10 ★★★★★" — the stars and
        the figure swapped sides. A rating should look the same in both
        languages; it is one atomic value, not a sentence.

        No `aria-hidden` on the children: `role="img"` with a name already makes
        the subtree presentational, and marking them again would hide a real bug
        if the role were ever removed.
      */}
      <LtrText className={cn("inline-flex items-center gap-2", className)}>
        <span className="text-accent">
          {"★".repeat(filled)}
          {"☆".repeat(STARS - filled)}
        </span>
        <span className="tabular-nums">
          {value.toFixed(1)}/{MAX}
        </span>
      </LtrText>
    </span>
  );
}
