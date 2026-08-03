import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Unlock</Button>);

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("is disabled and marked busy while loading", () => {
    render(<Button isLoading>Unlock</Button>);

    const button = screen.getByRole("button");
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
  });

  it("does not claim to be busy when it is not", () => {
    render(<Button>Unlock</Button>);

    expect(screen.getByRole("button").getAttribute("aria-busy")).toBeNull();
  });

  it("keeps the caller's className last so it can win", () => {
    render(<Button className="mt-4">Unlock</Button>);

    const classes = screen.getByRole("button").className;
    expect(classes.endsWith("mt-4")).toBe(true);
  });

  it("never renders gold on any variant", () => {
    // `docs/DESIGN_SYSTEM.md` §7: gold measures ~2.1:1 on warm white and fails
    // the 3:1 UI minimum. It must not reach a border, a focus ring or text.
    for (const variant of ["primary", "secondary", "ghost", "link"] as const) {
      const { container } = render(<Button variant={variant}>Unlock</Button>);
      expect(container.innerHTML).not.toContain("accent");
    }
  });
});
