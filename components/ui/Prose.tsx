import { cn } from "@/lib/utils/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Body copy. `docs/BRAND.md` §Typography: 60–75 characters per line, shorter in
 * Hebrew at ~55–65. The measure is a token that changes with `:lang(he)`, so
 * this component does not need to know which language it is rendering.
 *
 * Line height 1.7 comes from the `body` step of the type scale, which is inside
 * the `text-body` utility — it is not restated here.
 */
export function Prose({ children, className }: Props) {
  return (
    <div className={cn("max-w-prose text-body text-text", className)}>
      {children}
    </div>
  );
}
