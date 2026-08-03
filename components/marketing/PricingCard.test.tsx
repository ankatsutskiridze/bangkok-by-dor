import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PricingCard } from "./PricingCard";

describe("PricingCard", () => {
  it("shows the price next to the action, never behind a click", () => {
    // `docs/DESIGN_SYSTEM.md` §4: ₪79 · lifetime, always visible next to the
    // CTA. A guide that hides its price until checkout earns the click before
    // it has earned the trust.
    render(
      <PricingCard price="₪79" term="lifetime" action={<button>Unlock</button>} />,
    );

    expect(screen.getByText("₪79")).toBeTruthy();
    expect(screen.getByText("lifetime")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Unlock" })).toBeTruthy();
  });

  it("isolates the price so it does not reverse inside Hebrew", () => {
    const { container } = render(
      <PricingCard price="₪79" term="לכל החיים" action={<button>Unlock</button>} />,
    );

    const isolate = container.querySelector('[dir="ltr"]');
    expect(isolate?.textContent).toBe("₪79");
  });

  it("uses tabular figures so the price never shifts width", () => {
    const { container } = render(
      <PricingCard price="₪79" term="lifetime" action={<button>Unlock</button>} />,
    );

    expect(container.querySelector('[dir="ltr"]')?.className).toContain(
      "tabular-nums",
    );
  });

  it("omits the note entirely when there is nothing to say", () => {
    const { container } = render(
      <PricingCard price="₪79" term="lifetime" action={<button>Unlock</button>} />,
    );

    expect(container.querySelectorAll("p")).toHaveLength(1);
  });
});
