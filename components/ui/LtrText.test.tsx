import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LtrText } from "./LtrText";

// Plain DOM assertions rather than @testing-library/jest-dom — the extra
// matchers would not buy anything these two checks cannot express.
describe("LtrText", () => {
  it("forces its content left-to-right", () => {
    render(<LtrText>₪79</LtrText>);

    expect(screen.getByText("₪79").getAttribute("dir")).toBe("ltr");
  });

  it("passes through a className", () => {
    render(<LtrText className="tabular-nums">9.7/10</LtrText>);

    expect(screen.getByText("9.7/10").className).toBe("tabular-nums");
  });
});
