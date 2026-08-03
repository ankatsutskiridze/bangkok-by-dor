"use client";

import { EmailForm } from "@/components/ui/EmailForm";

type Props = {
  label: string;
  submitLabel: string;
  hint: string;
  invalidMessage: string;
  errorMessage: string;
  className?: string;
};

/**
 * Scaffold-only wrapper. `EmailForm` takes an `onSubmit` function, and a
 * function cannot be passed from a Server Component to a Client one — so the
 * handler has to be created on the client side of the boundary.
 *
 * Deleted with the rest of the scaffold page in Phase 2. The real submit is
 * wired at P4-04, where it creates the payment session.
 */
export function ScaffoldEmailForm(props: Props) {
  return <EmailForm {...props} onSubmit={async () => {}} />;
}
