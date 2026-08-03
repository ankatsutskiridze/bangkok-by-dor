import { getTranslations, setRequestLocale } from "next-intl/server";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { LtrText } from "@/components/ui/LtrText";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/lib/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

/**
 * Scaffold page. It exists so the foundation is exercised in a real browser
 * rather than asserted in the abstract — i18n, RTL, the tokens and now the
 * primitives. The real landing page is built across P2-01…P2-11 and replaces
 * this entirely.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Scaffold");

  return (
    <main>
      <Section labelledBy="scaffold-heading">
        <Container width="measure">
          <h1 id="scaffold-heading" className="font-display text-h1">
            {t("heading")}
          </h1>

          <Prose className="mt-6 text-text-muted">
            <p>{t("note")}</p>
            <p className="mt-4 text-small">
              <LtrText className="tabular-nums">
                Bangkok by Dor · ₪79 · 9.7/10
              </LtrText>
            </p>
          </Prose>

          <Divider className="my-12" />

          <div className="flex flex-wrap items-center gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
