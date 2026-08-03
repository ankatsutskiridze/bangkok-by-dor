import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "link";

type Props = Omit<React.ComponentProps<"button">, "className"> & {
  variant?: Variant;
  /** Disables the button and marks it busy for assistive technology. */
  isLoading?: boolean;
  className?: string;
};

/**
 * `docs/DESIGN_SYSTEM.md` §4 Button spec.
 *
 * The four variants listed there are the only ones. A design that needs a
 * fifth adds it to that file first — that rule is why this component has no
 * escape hatch for colour.
 */

// 44px mobile, 48px desktop — never below the 44×44 minimum touch target.
const sizing = "inline-flex h-11 items-center justify-center px-6 md:h-12";

const base = cn(
  "rounded-md text-body font-medium",
  "transition duration-fast ease-standard",
  // `docs/DESIGN_SYSTEM.md` §7: always visible on keyboard focus. `outline`
  // rather than `ring` so it is never clipped by an ancestor's overflow.
  "outline-focus focus-visible:outline-2 focus-visible:outline-offset-2",
  // Hover is desktop-only (§6) — Tailwind's `hover` variant already scopes
  // itself to devices that actually support hover, so a tap does not stick.
  "active:scale-pressed",
  "disabled:pointer-events-none disabled:opacity-50",
);

const variants: Record<Variant, string> = {
  // Inverts the canvas. On light that is ink on warm white, exactly as the
  // spec words it; on dark it inverts, which is what the spec means.
  primary: cn(sizing, "bg-action text-on-action hover:opacity-92"),
  secondary: cn(sizing, "border border-border text-text hover:opacity-92"),
  ghost: cn(sizing, "text-text hover:opacity-92"),
  // Inline links keep text metrics rather than a 44px box. WCAG 2.2 §2.5.8
  // exempts targets that sit in a sentence, and forcing the height here would
  // break the line rhythm of the paragraph around it.
  link: "text-link underline underline-offset-4 hover:opacity-92",
};

/**
 * The Button spec's classes, without the `<button>` element.
 *
 * `MapsButton` (P1-22) has to be a real `<a>` — it navigates, so it must be
 * middle-clickable, copyable and announced as a link. Exported rather than
 * duplicated so there is one definition of what a primary button looks like;
 * a second copy would drift the moment either is touched.
 */
export function buttonClasses(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

export function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}: Props) {
  return (
    <button
      // An explicit type: a button inside a form defaults to `submit`, which
      // has surprised every codebase that has ever left it off.
      type="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonClasses(variant, className)}
      {...props}
    >
      {children}
    </button>
  );
}
