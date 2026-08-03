import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Rating } from "./Rating";

describe("Rating", () => {
  it("shows the stars and the number together, never one alone", () => {
    // `docs/BRAND.md`: "★★★★★ 9.7/10" — both halves, always.
    const { container } = render(<Rating value={9.7} label="Rated 9.7 out of 10" />);

    expect(container.textContent).toContain("★");
    expect(container.textContent).toContain("9.7/10");
  });

  it("always renders exactly five star characters", () => {
    for (const value of [1, 4.4, 7.5, 9.7, 10]) {
      const { container } = render(<Rating value={value} label="rating" />);
      const stars = (container.textContent?.match(/[★☆]/g) ?? []).length;
      expect(stars).toBe(5);
    }
  });

  it("rounds 9.7 to five filled stars, as the brand example shows", () => {
    const { container } = render(<Rating value={9.7} label="rating" />);

    expect((container.textContent?.match(/★/g) ?? []).length).toBe(5);
    expect(container.textContent).not.toContain("☆");
  });

  it("keeps one decimal even on a whole number", () => {
    const { container } = render(<Rating value={8} label="rating" />);

    expect(container.textContent).toContain("8.0/10");
  });

  it("carries a single accessible name for the pair", () => {
    render(<Rating value={9.7} label="Rated 9.7 out of 10" />);

    expect(screen.getByRole("img", { name: "Rated 9.7 out of 10" })).toBeTruthy();
  });

  it("isolates the whole unit, not just the number", () => {
    // `docs/DESIGN_SYSTEM.md` §3 lists ratings among the things that stay LTR
    // inside Hebrew. Isolating only the number left the row following the
    // document direction, and Hebrew rendered "9.7/10 ★★★★★" with the halves
    // swapped. The stars must sit inside the isolate too.
    const { container } = render(<Rating value={9.7} label="rating" />);
    const isolate = container.querySelector('[dir="ltr"]');

    expect(isolate).toBeTruthy();
    expect(isolate?.textContent).toContain("★");
    expect(isolate?.textContent).toContain("9.7/10");
  });
});
