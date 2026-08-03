import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PRICE_LEVELS, PriceLevel } from "./PriceLevel";

describe("PriceLevel", () => {
  it("renders a constant four symbols so a column does not jitter", () => {
    for (const value of PRICE_LEVELS) {
      const { container } = render(<PriceLevel value={value} label="price" />);
      expect((container.textContent?.match(/\$/g) ?? []).length).toBe(4);
    }
  });

  it("fills as many symbols as the level says", () => {
    const { container } = render(<PriceLevel value="$$" label="price" />);
    const filled = container.querySelector(".text-accent");

    expect(filled?.textContent).toBe("$$");
  });

  it("never lets colour be the only carrier of meaning", () => {
    // `docs/DESIGN_SYSTEM.md` §7. Gold measures ~2.1:1 and cannot be relied on.
    // The count of filled symbols and the label both survive without it.
    const cheap = render(<PriceLevel value="$" label="Inexpensive" />);
    const dear = render(<PriceLevel value="$$$$" label="Very expensive" />);

    expect(cheap.container.querySelector(".text-accent")?.textContent).toBe("$");
    expect(dear.container.querySelector(".text-accent")?.textContent).toBe("$$$$");
    expect(screen.getByRole("img", { name: "Inexpensive" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Very expensive" })).toBeTruthy();
  });

  it("isolates the symbols so they do not reverse inside Hebrew", () => {
    const { container } = render(<PriceLevel value="$$$" label="price" />);

    expect(container.querySelector('[dir="ltr"]')).toBeTruthy();
  });
});
