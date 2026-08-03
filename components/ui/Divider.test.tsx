import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Divider } from "./Divider";

describe("Divider", () => {
  it("is hidden from assistive technology by default", () => {
    const { container } = render(<Divider />);
    const rule = container.querySelector("hr");

    expect(rule?.getAttribute("aria-hidden")).toBe("true");
    expect(rule?.getAttribute("role")).toBe("presentation");
  });

  it("announces itself as a separator when it carries meaning", () => {
    const { container } = render(<Divider semantic />);
    const rule = container.querySelector("hr");

    expect(rule?.getAttribute("aria-hidden")).toBeNull();
    expect(rule?.getAttribute("role")).toBe("separator");
  });
});
