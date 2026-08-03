import { getTranslations, setRequestLocale } from "next-intl/server";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { MapsButton } from "@/components/guide/MapsButton";
import { PaywallGate } from "@/components/guide/PaywallGate";
import { ProsConsList } from "@/components/guide/ProsConsList";
import { LtrText } from "@/components/ui/LtrText";
import { PriceLevel } from "@/components/ui/PriceLevel";
import { Prose } from "@/components/ui/Prose";
import { Rating } from "@/components/ui/Rating";
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
  const tRating = await getTranslations("Rating");
  const tPrice = await getTranslations("PriceLevel");

  return (
    <main>
      <Section labelledBy="scaffold-heading">
        <Container width="measure">
          <h1 id="scaffold-heading" className="font-display text-h1">
            {t("heading")}
          </h1>

          <Prose className="mt-6 text-text-muted">
            {/*
              `t.rich` rather than `t`: the Latin fragment inside the Hebrew
              sentence has to be isolated, or the bidi algorithm drags the
              surrounding punctuation into it — verified in the browser, where
              "P2-18." rendered as "P2--18" with the full stop orphaned onto
              the next line. This is the pattern every price, rating and place
              name in the guide will use.
            */}
            <p>{t.rich("note", { ltr: (chunks) => <LtrText>{chunks}</LtrText> })}</p>
            <p className="mt-4 text-small">
              <LtrText className="tabular-nums">
                Bangkok by Dor · ₪79 · 9.7/10
              </LtrText>
            </p>
          </Prose>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Rating value={9.7} label={tRating("label", { value: "9.7" })} />
            <PriceLevel value="$$$" label={tPrice("label", { filled: 3 })} />
          </div>

          <Divider className="my-12" />

          {/*
            Exercises the paywall against a real network response. The string
            below must never appear in the HTML for a logged-out visitor —
            `e2e/paywall.spec.ts` reads the raw body and asserts exactly that,
            which is the test `docs/RULES.md` §2 prescribes. Removed with the
            rest of this scaffold page in Phase 2.
          */}
          <PaywallGate
            shell={<p className="text-small text-text-muted">Paywall probe</p>}
            locked={<p className="text-small text-text-muted">Locked</p>}
            body={async () => (
              <p className="text-small">GATED-CONTENT-MUST-NOT-LEAK</p>
            )}
          />

          <Divider className="my-12" />

          <div className="flex flex-wrap items-center gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>

          <div className="mt-8">
            <MapsButton
              href="https://www.google.com/maps/place/Vertigo+Rooftop"
              label="Open in Google Maps"
              accessibleLabel="Open in Google Maps, opens in a new tab"
            />
          </div>

          <ProsConsList
            className="mt-12"
            prosHeading="Pros"
            consHeading="Cons"
            pros={["The view is genuinely the best in the city", "Staff speak English"]}
            cons={["It is not cheap", "Always full on weekends"]}
          />
        </Container>
      </Section>
    </main>
  );
}
