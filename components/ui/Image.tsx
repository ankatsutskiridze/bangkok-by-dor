import NextImage from "next/image";

import { cn } from "@/lib/utils/cn";

type Ratio = "hero" | "gallery" | "card";

type Props = {
  src: string;
  /**
   * Required, with no default. `docs/DESIGN_SYSTEM.md` §7: meaningful `alt`,
   * or an explicit `alt=""` for decoration. Making it optional is how empty
   * alt text spreads through a codebase by accident.
   */
  alt: string;
  ratio: Ratio;
  /**
   * Base64 placeholder shown while the image loads. `docs/TECHNICAL.md` §6
   * requires one on every image, and it is what keeps CLS at zero.
   */
  blurDataURL: string;
  /** Marks the LCP image. Use on the hero, and nowhere else. */
  priority?: boolean;
  /** `sizes` for the responsive srcset. Defaults to full-bleed. */
  sizes?: string;
  className?: string;
};

// `docs/BRAND.md` §Imagery. The hero narrows to 4:5 on mobile — a 3:2 hero on
// a phone leaves almost nothing of the photograph on screen.
const ratios: Record<Ratio, string> = {
  hero: "aspect-hero-mobile md:aspect-hero",
  gallery: "aspect-gallery",
  card: "aspect-card",
};

/**
 * Wraps `next/image` so that an aspect ratio, a blur placeholder and real alt
 * text are not optional. Every one of those is a requirement somewhere in
 * `/docs`, and each is easy to forget at the call site.
 *
 * The ratio lives on the wrapper and the image fills it, so the space is
 * reserved before the bytes arrive — no layout shift on load.
 */
export function Image({
  src,
  alt,
  ratio,
  blurDataURL,
  priority = false,
  sizes = "100vw",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-surface-raised",
        ratios[ratio],
        className,
      )}
    >
      <NextImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="object-cover"
      />
    </div>
  );
}
