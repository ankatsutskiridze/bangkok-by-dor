import { cn } from "@/lib/utils/cn";

type Props = {
  children: React.ReactNode;
  /**
   * `layout` — 1200px, for page layouts.
   * `measure` — the reading measure, for body copy that has to stay readable.
   */
  width?: "layout" | "measure";
  className?: string;
};

const widths = {
  layout: "max-w-layout",
  measure: "max-w-prose",
} as const;

/**
 * Horizontal container. `docs/DESIGN_SYSTEM.md` §2.
 *
 * Gutters are 20px on mobile, 32px on tablet and 48px on desktop. They are
 * padding rather than margin so a full-bleed child can escape them by
 * cancelling the padding, instead of having to fight a centred max-width.
 */
export function Container({ children, width = "layout", className }: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 md:px-8 lg:px-12",
        widths[width],
        className,
      )}
    >
      {children}
    </div>
  );
}
