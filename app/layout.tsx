import type { Metadata } from "next";
import "./globals.css";

// Placeholder metadata. Real metadata lands in P0-09, and these strings move
// into the translation files in P0-08 — nothing user-facing stays hardcoded.
export const metadata: Metadata = {
  title: "Bangkok by Dor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `lang` and `dir` are driven by the active locale in P0-08; `he`/`rtl`
    // becomes the default there. This is scaffold state, not a decision.
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
