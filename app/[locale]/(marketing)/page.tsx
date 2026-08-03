import { getTranslations, setRequestLocale } from "next-intl/server";

import { LtrText } from "@/components/ui/LtrText";
import type { Locale } from "@/lib/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

/**
 * Placeholder home page. It exists to prove the i18n, RTL and token foundation
 * works end to end; the real landing page is built across P2-01…P2-11.
 *
 * The classes here are token utilities on purpose — if a token stops generating
 * a utility, this page stops compiling rather than silently losing its styling.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Scaffold");

  return (
    <main className="mx-auto max-w-measure px-5 py-20">
      <h1 className="font-display text-h1">{t("heading")}</h1>
      <p className="mt-6 text-body text-text-muted">{t("note")}</p>
      <p className="mt-4 text-small text-text-muted">
        <LtrText className="tabular-nums">Bangkok by Dor · ₪79 · 9.7/10</LtrText>
      </p>
    </main>
  );
}
