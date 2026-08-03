import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { ScaffoldEmailForm } from "./ScaffoldEmailForm";
import { Gallery } from "@/components/guide/Gallery";
import { PricingCard } from "@/components/marketing/PricingCard";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { MapsButton } from "@/components/guide/MapsButton";
import { PaywallGate } from "@/components/guide/PaywallGate";
import { ProsConsList } from "@/components/guide/ProsConsList";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Footer } from "@/components/ui/Footer";
import { LtrText } from "@/components/ui/LtrText";
import { PriceLevel } from "@/components/ui/PriceLevel";
import { Prose } from "@/components/ui/Prose";
import { Rating } from "@/components/ui/Rating";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/lib/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

// A 1×1 transparent GIF. Real images ship with a real blur-up (P5-02); this
// only exists so `Image`'s required `blurDataURL` is satisfied by the scaffold.
const BLUR =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

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
  const tMaps = await getTranslations("Maps");
  const tProsCons = await getTranslations("ProsCons");
  const tLang = await getTranslations("Language");
  const tFooter = await getTranslations("Footer");
  const tFaq = await getTranslations("FAQ");
  const tGallery = await getTranslations("Gallery");
  const tEmail = await getTranslations("Email");
  const tSite = await getTranslations("Site");
  const tHeader = await getTranslations("Header");
  const tPricing = await getTranslations("Pricing");

  return (
    <>
      <Header
        wordmark={tSite("name")}
        navLabel={tHeader("navLabel")}
        languageLabel={tLang("label")}
        localeNames={{ he: tLang("he"), en: tLang("en") }}
        links={[
          { href: "/categories", label: tFooter("categories"), prefetch: false },
          { href: "/about", label: tFooter("about"), prefetch: false },
          { href: "/faq", label: tFooter("faq"), prefetch: false },
        ]}
        action={<Button>{tHeader("unlock")}</Button>}
      />

      {/* `id` is the skip link's target; `pt` clears the fixed header. */}
      <main id="content" className="pt-16 md:pt-20">
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
              label={tMaps("label")}
              accessibleLabel={tMaps("accessibleLabel")}
            />
          </div>

          <ProsConsList
            className="mt-12"
            prosHeading={tProsCons("pros")}
            consHeading={tProsCons("cons")}
            pros={["The view is genuinely the best in the city", "Staff speak English"]}
            cons={["It is not cheap", "Always full on weekends"]}
          />

          {/*
            `Gallery` reads the query string, so Next.js requires a Suspense
            boundary or the whole route drops out of static rendering. The
            images are flat-colour placeholders generated at P1-18, clearly
            marked as such — real photographs are P3-11, blocked on D9.
          */}
          <Suspense fallback={null}>
            <Gallery
              className="mt-12"
              label={tGallery("label")}
              lightboxLabel={tGallery("lightboxLabel")}
              closeLabel={tGallery("close")}
              previousLabel={tGallery("previous")}
              nextLabel={tGallery("next")}
              images={[1, 2, 3].map((n) => ({
                src: `/scaffold/placeholder-${n}.png`,
                alt: tGallery("placeholderAlt", { n }),
                blurDataURL: BLUR,
              }))}
            />
          </Suspense>

          <ScaffoldEmailForm
            className="mt-12"
            label={tEmail("label")}
            submitLabel={tEmail("submit")}
            hint={tEmail("hint")}
            invalidMessage={tEmail("invalid")}
            errorMessage={tEmail("error")}
          />

          <PricingCard
            className="mt-12"
            price={tPricing("price")}
            term={tPricing("term")}
            note={tPricing("note")}
            action={<Button>{tHeader("unlock")}</Button>}
          />

          <FAQAccordion
            className="mt-12"
            items={[
              {
                question: tFaq("firstTimeQuestion"),
                answer: tFaq("firstTimeAnswer"),
              },
              {
                question: tFaq("updatesQuestion"),
                answer: tFaq("updatesAnswer"),
              },
            ]}
          />
        </Container>
      </Section>

      {/*
        The footer belongs in the locale layout once the routes it points at
        exist (P2-14…P2-17). It sits here for now so it can be exercised in a
        browser without the layout pretending those pages are built.
      */}
      <Footer
        navLabel={tFooter("navLabel")}
        legalLabel={tFooter("legalLabel")}
        languageLabel={tLang("label")}
        localeNames={{ he: tLang("he"), en: tLang("en") }}
        links={[
          { href: "/categories", label: tFooter("categories"), prefetch: false },
          { href: "/about", label: tFooter("about"), prefetch: false },
          { href: "/faq", label: tFooter("faq"), prefetch: false },
          { href: "/contact", label: tFooter("contact"), prefetch: false },
        ]}
        legal={[
          { href: "/terms", label: tFooter("terms"), prefetch: false },
          { href: "/privacy", label: tFooter("privacy"), prefetch: false },
          { href: "/refund", label: tFooter("refund"), prefetch: false },
        ]}
      />
      </main>
    </>
  );
}
