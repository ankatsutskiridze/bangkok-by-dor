import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Container } from "./Container";

describe("Container", () => {
  it("defaults to the layout width", () => {
    const { container } = render(<Container>content</Container>);

    expect(container.firstElementChild?.className).toContain("max-w-layout");
  });

  it("switches to the reading measure on request", () => {
    const { container } = render(<Container width="measure">content</Container>);

    expect(container.firstElementChild?.className).toContain("max-w-prose");
  });

  it("uses logical padding so RTL is correct by construction", () => {
    // `docs/RULES.md`: logical properties only. `px-*` is symmetric and
    // therefore safe; `pl-*` / `pr-*` would silently break Hebrew.
    const { container } = render(<Container>content</Container>);
    const classes = container.firstElementChild?.className ?? "";

    expect(classes).not.toMatch(/\b(pl-|pr-|ml-|mr-)/);
  });
});
