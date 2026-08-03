import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LtrText } from "./LtrText";

// Plain DOM assertions rather than @testing-library/jest-dom — the extra
// matchers would not buy anything these checks cannot express.
describe("LtrText", () => {
  it("forces its content left-to-right", () => {
    render(<LtrText>₪79</LtrText>);

    expect(screen.getByText("₪79").getAttribute("dir")).toBe("ltr");
  });

  it("does not let a price break across lines", () => {
    // Isolation alone was not enough: the browser still broke inside the run,
    // leaving "P2-" on one line and "18." leading the next.
    render(<LtrText>9.7/10</LtrText>);

    expect(screen.getByText("9.7/10").className).toContain("whitespace-nowrap");
  });

  it("allows wrapping for long names that would overflow the measure", () => {
    render(<LtrText allowWrap>Wat Phra Chetuphon Vimolmangklararm</LtrText>);

    const element = screen.getByText("Wat Phra Chetuphon Vimolmangklararm");
    expect(element.className).not.toContain("whitespace-nowrap");
    expect(element.getAttribute("dir")).toBe("ltr");
  });

  it("passes through a className", () => {
    render(<LtrText className="tabular-nums">9.7/10</LtrText>);

    expect(screen.getByText("9.7/10").className).toContain("tabular-nums");
  });
});
