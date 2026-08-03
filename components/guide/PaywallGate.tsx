import { hasAccess } from "@/lib/auth/access";

type Props = {
  /** The public shell: name, hero, category, summary. Always rendered. */
  shell: React.ReactNode;
  /** Shown in place of the body when the check fails. The sales surface. */
  locked: React.ReactNode;
  /**
   * The paid body — a **function**, deliberately, not a node.
   *
   * This is the whole design. If the body were a `React.ReactNode`, the caller
   * would have already fetched and rendered it before this component ever ran,
   * and the gate could only decide whether to *display* content that had
   * already been produced. `docs/RULES.md` §2 forbids exactly that: gated
   * content must never be sent to the browser and hidden.
   *
   * As a thunk, it is not called at all unless the check passes. The paid text
   * is never fetched, never rendered, never serialised.
   */
  body: () => Promise<React.ReactNode>;
};

/**
 * The server-side paywall. `docs/TECHNICAL.md` §3 and §4.
 *
 * Deliberately an **async Server Component**: an async component cannot be a
 * client component, so this cannot accidentally be moved to the browser. That
 * constraint is enforced by the framework rather than by a comment or a lint
 * rule someone can silence.
 *
 * Verify it the way `docs/RULES.md` §2 says to — read the raw network response
 * as a logged-out user. If the paid text is in there, it is broken, regardless
 * of what the rendered page looks like.
 */
export async function PaywallGate({ shell, locked, body }: Props) {
  const unlocked = await hasAccess();

  return (
    <>
      {shell}
      {unlocked ? await body() : locked}
    </>
  );
}
