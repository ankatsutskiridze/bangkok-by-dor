import { cn } from "@/lib/utils/cn";

type Props = {
  children: React.ReactNode;
  /** Renders a landmark-appropriate element. Defaults to `<section>`. */
  as?: "section" | "div" | "article";
  /**
   * A section is a labelled region only if it has an accessible name. Pass the
   * id of its heading, or the section becomes an unnamed landmark that screen
   * reader users have to enter to identify.
   */
  labelledBy?: string;
  className?: string;
};

/**
 * Vertical rhythm. `docs/DESIGN_SYSTEM.md` §1: `py-20` mobile → `py-32` tablet
 * → `py-40` desktop. Every full-width band of the page uses this, so the
 * spacing between sections is a property of the system and not of each page.
 *
 * Horizontal bounds are `Container`'s job — kept separate so a section can
 * hold a full-bleed image and a contained paragraph at the same time.
 */
export function Section({
  children,
  as: Element = "section",
  labelledBy,
  className,
}: Props) {
  return (
    <Element
      aria-labelledby={labelledBy}
      className={cn("py-20 md:py-32 lg:py-40", className)}
    >
      {children}
    </Element>
  );
}
