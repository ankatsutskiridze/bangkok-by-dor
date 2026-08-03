import { cn } from "@/lib/utils/cn";

type Props = {
  /**
   * Decorative dividers are hidden from assistive technology. Set this only
   * when the rule genuinely separates two topics — then it is announced as a
   * separator instead of being skipped.
   */
  semantic?: boolean;
  className?: string;
};

/**
 * A hairline rule. `docs/DESIGN_SYSTEM.md` §1 prefers borders and background
 * contrast over shadows, which makes this a structural element rather than
 * decoration — it does real work in the layout.
 */
export function Divider({ semantic = false, className }: Props) {
  return (
    <hr
      aria-hidden={semantic ? undefined : true}
      role={semantic ? "separator" : "presentation"}
      className={cn("border-0 border-t border-border", className)}
    />
  );
}
