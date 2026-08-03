import { getTranslations, setRequestLocale } from "next-intl/server";

import { LtrText } from "@/components/ui/LtrText";
import type { Locale } from "@/lib/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

/**
 * Placeholder home page. It exists to prove the i18n and RTL foundation works
 * end to end; the real landing page is built across P2-01…P2-11.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Scaffold");

  return (
    <main>
      <h1>{t("heading")}</h1>
      <p>{t("note")}</p>
      <p>
        <LtrText>Bangkok by Dor · ₪79 · 9.7/10</LtrText>
      </p>
    </main>
  );
}
