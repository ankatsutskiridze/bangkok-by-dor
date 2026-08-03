import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PaywallGate } from "./PaywallGate";

vi.mock("@/lib/auth/access", () => ({ hasAccess: vi.fn() }));

const { hasAccess } = await import("@/lib/auth/access");
const mockedHasAccess = vi.mocked(hasAccess);

afterEach(() => {
  vi.clearAllMocks();
});

describe("PaywallGate", () => {
  it("never even calls the body loader when access is denied", async () => {
    // The most important assertion in the codebase. `docs/RULES.md` §2: gated
    // content must never be sent to the browser and hidden. If this loader
    // runs, the paid text has been fetched — whether or not it is displayed.
    mockedHasAccess.mockResolvedValue(false);
    const body = vi.fn().mockResolvedValue(<p>The paid body</p>);

    render(await PaywallGate({ shell: <h1>Vertigo Rooftop</h1>, locked: <p>Locked</p>, body }));

    expect(body).not.toHaveBeenCalled();
    expect(screen.queryByText("The paid body")).toBeNull();
  });

  it("renders the public shell whether or not access is granted", async () => {
    for (const granted of [true, false]) {
      mockedHasAccess.mockResolvedValue(granted);

      const { unmount } = render(
        await PaywallGate({
          shell: <h1>Vertigo Rooftop</h1>,
          locked: <p>Locked</p>,
          body: async () => <p>The paid body</p>,
        }),
      );

      expect(screen.getByText("Vertigo Rooftop")).toBeTruthy();
      unmount();
    }
  });

  it("shows the locked surface instead of the body when denied", async () => {
    mockedHasAccess.mockResolvedValue(false);

    render(
      await PaywallGate({
        shell: <h1>Vertigo Rooftop</h1>,
        locked: <p>Locked</p>,
        body: async () => <p>The paid body</p>,
      }),
    );

    expect(screen.getByText("Locked")).toBeTruthy();
  });

  it("renders the body once access is granted", async () => {
    mockedHasAccess.mockResolvedValue(true);
    const body = vi.fn().mockResolvedValue(<p>The paid body</p>);

    render(await PaywallGate({ shell: <h1>Vertigo Rooftop</h1>, locked: <p>Locked</p>, body }));

    expect(body).toHaveBeenCalledOnce();
    expect(screen.getByText("The paid body")).toBeTruthy();
    expect(screen.queryByText("Locked")).toBeNull();
  });
});
