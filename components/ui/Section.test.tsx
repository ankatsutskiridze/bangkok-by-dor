import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Section } from "./Section";

describe("Section", () => {
  it("is an unnamed region until it is given a heading to point at", () => {
    const { container } = render(<Section>content</Section>);

    expect(container.querySelector("section")?.getAttribute("aria-labelledby"))
      .toBeNull();
  });

  it("becomes a labelled landmark when pointed at a heading", () => {
    render(
      <Section labelledBy="why">
        <h2 id="why">Why Bangkok by Dor?</h2>
      </Section>,
    );

    expect(screen.getByRole("region", { name: "Why Bangkok by Dor?" })).toBeTruthy();
  });

  it("can render as another element without losing its rhythm", () => {
    const { container } = render(<Section as="article">content</Section>);
    const element = container.querySelector("article");

    expect(element).toBeTruthy();
    expect(element?.className).toContain("py-20");
  });
});
