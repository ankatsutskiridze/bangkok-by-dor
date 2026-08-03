import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FAQAccordion } from "./FAQAccordion";

const ITEMS = [
  { question: "Is it suitable for first-timers?", answer: "Yes." },
  { question: "Are new places added?", answer: "Regularly." },
];

describe("FAQAccordion", () => {
  it("starts closed, with every panel inert", () => {
    const { container } = render(<FAQAccordion items={ITEMS} />);

    for (const button of screen.getAllByRole("button")) {
      expect(button.getAttribute("aria-expanded")).toBe("false");
    }
    expect(container.querySelectorAll("[inert]").length).toBe(ITEMS.length);
  });

  it("ties each button to the panel it controls", () => {
    render(<FAQAccordion items={ITEMS} />);

    for (const button of screen.getAllByRole("button")) {
      const panelId = button.getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      expect(document.getElementById(panelId!)).toBeTruthy();
    }
  });

  it("keeps a collapsed panel out of the tab order", () => {
    // A collapsed panel whose links are still focusable is a keyboard trap:
    // the focus ring disappears into a zero-height box. `inert` removes it from
    // both the accessibility tree and the tab order.
    const { container } = render(<FAQAccordion items={ITEMS} />);
    const panel = container.querySelector("[role='region']");

    expect(panel?.hasAttribute("inert")).toBe(true);
  });

  it("uses collapsible utilities rather than a hardcoded height", () => {
    // The 0fr → 1fr grid technique animates to the content's real height, so
    // it cannot desynchronise from the content the way max-height does.
    const { container } = render(<FAQAccordion items={ITEMS} />);
    const panel = container.querySelector("[role='region']");

    expect(panel?.className).toContain("collapsible");
    expect(panel?.className).toContain("collapsed");
    expect(panel?.className).toContain("duration-base");
  });

  it("gives each question a real heading", () => {
    render(<FAQAccordion items={ITEMS} />);

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(ITEMS.length);
  });
});
