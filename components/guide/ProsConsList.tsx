import { cn } from "@/lib/utils/cn";

type Props = {
  /** 3–5 items (`docs/CONTENT.md` §1.1). */
  pros: string[];
  /**
   * 1–3 items, **never empty**. `docs/RULES.md` §1: a place with no downsides
   * does not get published. The type cannot express "non-empty array", so the
   * component refuses to render instead — see below.
   */
  cons: string[];
  prosHeading: string;
  consHeading: string;
  className?: string;
};

/**
 * `docs/DESIGN_SYSTEM.md` §4 and `docs/RULES.md` §1.
 *
 * **Cons carry the same visual weight as pros.** Not smaller, not collapsed,
 * not below a fold, not in a lighter grey. The honesty of the cons column is
 * the reason a reader believes the pros column — quietly de-emphasising it
 * would take the trust with it.
 *
 * Cons use the muted caution earth tone, never red. They are information, not
 * warnings; a red list reads as a hazard notice and makes every place look
 * like a mistake.
 */
export function ProsConsList({
  pros,
  cons,
  prosHeading,
  consHeading,
  className,
}: Props) {
  // Fails loudly rather than rendering a one-sided page. A recommendation with
  // no cons is an advertisement, and `docs/RULES.md` §1 says it does not get
  // published — so this must never degrade quietly into a pros-only list.
  if (cons.length === 0) {
    throw new Error(
      "ProsConsList: `cons` is empty. Every recommendation must carry at least " +
        "one honest downside (docs/RULES.md §1). Fix the content, not this check.",
    );
  }

  return (
    <div className={cn("grid gap-12 md:grid-cols-2 md:gap-16", className)}>
      <Column heading={prosHeading} items={pros} tone="positive" />
      <Column heading={consHeading} items={cons} tone="caution" />
    </div>
  );
}

function Column({
  heading,
  items,
  tone,
}: {
  heading: string;
  items: string[];
  tone: "positive" | "caution";
}) {
  return (
    <section>
      {/* Identical heading treatment on both sides — the equal weight is the
          point, and it has to survive someone restyling one column later. */}
      <h3 className="text-h3 text-text">{heading}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-body text-text">
            <span
              aria-hidden="true"
              className={cn(
                "mt-2 size-1.5 shrink-0 rounded-full",
                tone === "positive" ? "bg-positive" : "bg-caution",
              )}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
