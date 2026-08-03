import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProsConsList } from "./ProsConsList";

const PROS = ["The view is genuinely the best in the city", "Staff speak English"];
const CONS = ["It is not cheap", "Always full on weekends"];

describe("ProsConsList", () => {
  it("refuses to render without at least one con", () => {
    // `docs/RULES.md` §1: a place with no downsides does not get published.
    // Degrading quietly into a pros-only list would turn a recommendation into
    // an advertisement, which is the one thing the product cannot do.
    expect(() =>
      render(
        <ProsConsList pros={PROS} cons={[]} prosHeading="Pros" consHeading="Cons" />,
      ),
    ).toThrow(/at least one honest downside/);
  });

  it("gives both columns the same heading treatment", () => {
    // The equal visual weight is the point (`docs/DESIGN_SYSTEM.md` §4). If a
    // later change makes the cons heading smaller or quieter, this fails.
    render(
      <ProsConsList pros={PROS} cons={CONS} prosHeading="Pros" consHeading="Cons" />,
    );

    const [prosHeading, consHeading] = screen.getAllByRole("heading", { level: 3 });
    expect(prosHeading.className).toBe(consHeading.className);
  });

  it("renders every item from both sides", () => {
    render(
      <ProsConsList pros={PROS} cons={CONS} prosHeading="Pros" consHeading="Cons" />,
    );

    for (const item of [...PROS, ...CONS]) {
      expect(screen.getByText(item)).toBeTruthy();
    }
  });

  it("marks cons with the caution tone and never with red", () => {
    // `docs/DESIGN_SYSTEM.md` §4: cons use the muted caution earth tone, never
    // red. Cons are information, not warnings.
    const { container } = render(
      <ProsConsList pros={PROS} cons={CONS} prosHeading="Pros" consHeading="Cons" />,
    );

    expect(container.querySelectorAll(".bg-caution").length).toBe(CONS.length);
    expect(container.querySelectorAll(".bg-positive").length).toBe(PROS.length);
    expect(container.innerHTML).not.toMatch(/\bred\b/);
  });
});
