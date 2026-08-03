import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MapsButton } from "./MapsButton";

const VALID = "https://www.google.com/maps/place/Vertigo+Rooftop";

function renderButton(href: string) {
  return render(
    <MapsButton
      href={href}
      label="Open in Google Maps"
      accessibleLabel="Open Vertigo Rooftop in Google Maps, opens in a new tab"
    />,
  );
}

describe("MapsButton", () => {
  it("is a real link, not a button with a handler", () => {
    // It navigates, so it must be middle-clickable, copyable and announced as
    // a link. A <button> would be none of those.
    renderButton(VALID);

    expect(screen.getByRole("link").tagName).toBe("A");
  });

  it("opens in a new tab without leaking the opener or the referrer", () => {
    renderButton(VALID);
    const link = screen.getByRole("link");

    expect(link.getAttribute("target")).toBe("_blank");
    // `docs/CONTENT.md` asks for noopener. noreferrer is added deliberately:
    // the referrer of a paywalled URL is not ours to hand to a third party.
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(link.getAttribute("rel")).toContain("noreferrer");
  });

  it("says out loud that it opens a new tab", () => {
    renderButton(VALID);

    expect(
      screen.getByRole("link", {
        name: "Open Vertigo Rooftop in Google Maps, opens in a new tab",
      }),
    ).toBeTruthy();
  });

  it("accepts the Google Maps forms that actually appear in the wild", () => {
    for (const href of [
      "https://www.google.com/maps/place/Vertigo+Rooftop",
      "https://maps.google.com/?q=13.7,100.5",
      "https://maps.app.goo.gl/abc123",
      "https://goo.gl/maps/abc123",
    ]) {
      expect(() => renderButton(href)).not.toThrow();
    }
  });

  it("refuses anything that is not a Google Maps link", () => {
    // `docs/RULES.md` §1: the only outbound link on a recommendation is Google
    // Maps. Enforced rather than trusted, so this can never quietly become a
    // general-purpose outbound link — which is how an affiliate link would
    // eventually arrive.
    for (const href of [
      "https://www.tripadvisor.com/Restaurant_Review",
      "https://booking.com/hotel",
      "https://evil.example.com/maps",
      "https://google.com.attacker.test/maps",
      "not a url at all",
    ]) {
      expect(() => renderButton(href)).toThrow(/only outbound link/);
    }
  });

  it("refuses plain http", () => {
    expect(() => renderButton("http://www.google.com/maps/place/X")).toThrow();
  });

  it("refuses a non-map path on a Google host", () => {
    expect(() => renderButton("https://www.google.com/search?q=bangkok")).toThrow();
  });
});
