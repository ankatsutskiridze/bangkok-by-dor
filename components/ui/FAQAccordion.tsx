"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils/cn";

export type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  items: FAQItem[];
  className?: string;
};

/**
 * `docs/DESIGN_SYSTEM.md` §5: smooth height, `duration-base`.
 *
 * Built on a real `<button>` with `aria-expanded` and `aria-controls` rather
 * than `<details>`/`<summary>`. Native details is better semantics but cannot
 * animate its height reliably across browsers today, and the smooth open is in
 * the specification.
 *
 * The height animation is the `grid-template-rows: 0fr → 1fr` technique: it
 * transitions to the content's real height without measuring anything in
 * JavaScript, so it cannot desynchronise from the content the way a hardcoded
 * max-height does.
 *
 * Reduced motion is handled globally in `styles/globals.css` — the transition
 * collapses to near-zero and the panel simply appears.
 *
 * Several panels may be open at once. Closing one to open another hides
 * something the reader was in the middle of, and an FAQ is read by scanning.
 */
export function FAQAccordion({ items, className }: Props) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (!next.delete(index)) next.add(index);
      return next;
    });

  return (
    <div className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 py-5 text-start",
                  "text-h3 text-text",
                  "outline-focus focus-visible:outline-2 focus-visible:outline-offset-2",
                )}
              >
                <span>{item.question}</span>
                {/*
                  A rotating plus rather than a chevron: it needs no icon set,
                  so this component does not wait on D25, and it reads the same
                  in both directions — a chevron would have to mirror in RTL.
                */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 text-text-muted transition duration-base ease-standard",
                    isOpen && "rotate-45",
                  )}
                >
                  +
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              // `hidden` would kill the transition, so the panel is collapsed
              // to zero height and made `inert` instead — which keeps it out of
              // the accessibility tree *and* out of the tab order. Collapsed
              // content that is still focusable is a keyboard trap.
              inert={!isOpen}
              className={cn(
                "collapsible duration-base ease-standard",
                isOpen ? "expanded" : "collapsed",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-body text-text-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
