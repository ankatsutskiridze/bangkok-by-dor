import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SkipLink } from "@/components/ui/SkipLink";
import { getDirection, routing } from "@/lib/i18n/routing";
import { CANVAS } from "@/lib/utils/canvas";
import "@/styles/globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Site" });

  // Minimal on purpose. Full metadata, Open Graph and hreflang land in P2-20.
  return { title: t("name") };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Required for static rendering of locale-aware routes.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "A11y" });

  return (
    <html lang={locale} dir={getDirection(locale)} data-canvas={CANVAS}>
      <body>
        {/* First in the tab order, by being first in the document. */}
        <SkipLink label={t("skipToContent")} />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
