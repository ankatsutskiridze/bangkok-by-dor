import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Image } from "./Image";

const BLUR =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

describe("Image", () => {
  it("reserves the aspect ratio on the wrapper so nothing shifts on load", () => {
    const { container } = render(
      <Image src="/x.jpg" alt="A rooftop bar" ratio="gallery" blurDataURL={BLUR} />,
    );

    expect(container.firstElementChild?.className).toContain("aspect-gallery");
  });

  it("narrows the hero to 4:5 on mobile and opens to 3:2 above it", () => {
    // `docs/BRAND.md` §Imagery. A 3:2 hero on a phone shows almost nothing.
    const { container } = render(
      <Image src="/x.jpg" alt="A rooftop bar" ratio="hero" blurDataURL={BLUR} />,
    );
    const classes = container.firstElementChild?.className ?? "";

    expect(classes).toContain("aspect-hero-mobile");
    expect(classes).toContain("md:aspect-hero");
  });

  it("passes alt text through, including a deliberate empty one", () => {
    const meaningful = render(
      <Image src="/x.jpg" alt="A rooftop bar" ratio="card" blurDataURL={BLUR} />,
    );
    expect(
      meaningful.container.querySelector("img")?.getAttribute("alt"),
    ).toBe("A rooftop bar");

    const decorative = render(
      <Image src="/x.jpg" alt="" ratio="card" blurDataURL={BLUR} />,
    );
    expect(decorative.container.querySelector("img")?.getAttribute("alt")).toBe("");
  });
});
