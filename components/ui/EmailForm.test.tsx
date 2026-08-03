import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EmailForm } from "./EmailForm";

const LABELS = {
  label: "Your email",
  submitLabel: "Continue",
  invalidMessage: "That does not look like an email address.",
  errorMessage: "Something went wrong. Try again, or email me directly.",
};

function setup(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  render(<EmailForm {...LABELS} onSubmit={onSubmit} />);
  return {
    onSubmit,
    input: screen.getByLabelText("Your email"),
    submit: screen.getByRole("button", { name: "Continue" }),
  };
}

describe("EmailForm", () => {
  it("has a real label tied to the field", () => {
    // A placeholder is not a label — it disappears the moment someone starts
    // typing, which is when they most need it.
    const { input } = setup();

    expect(input.tagName).toBe("INPUT");
    expect(input.getAttribute("type")).toBe("email");
  });

  it("keeps the field left-to-right whatever the interface language", () => {
    // An email address is never Hebrew, and an RTL input puts the cursor on
    // the wrong side of it.
    const { input } = setup();

    expect(input.getAttribute("dir")).toBe("ltr");
  });

  it("does not nag while the reader is still typing", () => {
    const { input } = setup();

    fireEvent.change(input, { target: { value: "d" } });

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("rejects an invalid address on submit and links the error to the field", async () => {
    const { input, submit, onSubmit } = setup();

    fireEvent.change(input, { target: { value: "not-an-email" } });
    fireEvent.click(submit);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe(LABELS.invalidMessage);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toContain(alert.id);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("trims surrounding whitespace before submitting", async () => {
    // Pasted addresses arrive with a trailing space more often than not, and
    // the email is the account key — a stray space is a lost purchase.
    const { input, submit, onSubmit } = setup();

    fireEvent.change(input, { target: { value: "  dor@example.com  " } });
    fireEvent.click(submit);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith("dor@example.com"));
  });

  it("surfaces a failed submit with a message that offers a next action", async () => {
    const failing = vi.fn().mockRejectedValue(new Error("network"));
    const { input, submit } = setup(failing);

    fireEvent.change(input, { target: { value: "dor@example.com" } });
    fireEvent.click(submit);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe(LABELS.errorMessage);
  });

  it("re-enables itself after a failure so the reader can retry", async () => {
    const failing = vi.fn().mockRejectedValue(new Error("network"));
    const { input, submit } = setup(failing);

    fireEvent.change(input, { target: { value: "dor@example.com" } });
    fireEvent.click(submit);

    await screen.findByRole("alert");
    await waitFor(() => expect((submit as HTMLButtonElement).disabled).toBe(false));
  });

  it("announces the hint when there is no error", () => {
    render(
      <EmailForm
        {...LABELS}
        hint="I only use it to send your access link."
        onSubmit={vi.fn()}
      />,
    );

    const input = screen.getByLabelText("Your email");
    const describedBy = input.getAttribute("aria-describedby");

    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)?.textContent).toBe(
      "I only use it to send your access link.",
    );
  });
});
