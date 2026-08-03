"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Image } from "@/components/ui/Image";
import { cn } from "@/lib/utils/cn";

export type GalleryImage = {
  src: string;
  alt: string;
  blurDataURL: string;
};

type Props = {
  /** 3–8 photos (`docs/CONTENT.md` §1.1). */
  images: GalleryImage[];
  /** Accessible name for the grid, already translated. */
  label: string;
  /** Accessible name for the lightbox dialog, already translated. */
  lightboxLabel: string;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  className?: string;
};

/** The lightbox index lives here so a photo can be linked to and shared. */
const PARAM = "photo";

/**
 * `docs/DESIGN_SYSTEM.md` §4 and §6: tap to open a lightbox, swipe on mobile,
 * arrow keys and Escape on desktop, focus trapped, **gallery index in the URL**.
 *
 * The index in the URL is what makes the back button close the lightbox rather
 * than leave the page — on a phone, back is how people close things, and a
 * lightbox that swallows it feels broken.
 *
 * Focus is trapped while it is open and returned to the thumbnail that opened
 * it on close. Without that, a keyboard user closes the lightbox and lands back
 * at the top of the document with no idea where they were.
 *
 * ⚠ Uses `useSearchParams`, so **every page rendering this must wrap it in a
 * `<Suspense>` boundary** or Next.js opts the whole route out of static
 * rendering. That is the price of the URL requirement, and it is worth paying
 * here — it is not worth paying for the language toggle, which is why that one
 * does not read the query string.
 */

/** Below this many pixels a horizontal drag is a tap, not a swipe. */
const SWIPE_THRESHOLD = 50;
export function Gallery({
  images,
  label,
  lightboxLabel,
  closeLabel,
  previousLabel,
  nextLabel,
  className,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Read at the moment of interaction rather than captured once: the language
  // toggle can flip direction without this component remounting.
  const isRtl = () => document.documentElement.dir === "rtl";

  const raw = searchParams.get(PARAM);
  const parsed = raw === null ? null : Number.parseInt(raw, 10);
  const openIndex =
    parsed !== null && Number.isInteger(parsed) && parsed >= 0 && parsed < images.length
      ? parsed
      : null;

  const setIndex = useCallback(
    (index: number | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (index === null) params.delete(PARAM);
      else params.set(PARAM, String(index));

      const query = params.toString();
      // `scroll: false` — reopening the lightbox should not also jump the page
      // back to the top of the gallery behind it.
      router.replace(query ? `?${query}` : "?", { scroll: false });
    },
    [router, searchParams],
  );

  // `showModal()` rather than an `open` attribute: it is what gives a <dialog>
  // the top layer, the inert backdrop and the focus trap, all from the
  // platform. Hand-rolled focus traps are where accessibility bugs live.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (openIndex !== null && !dialog.open) dialog.showModal();
    if (openIndex === null && dialog.open) dialog.close();
  }, [openIndex]);

  /**
   * Arrow keys are bound to the document rather than to the dialog element.
   *
   * On the dialog, the handler only fires while focus is inside it — and there
   * is a window after `showModal()` where focus has not landed yet, so an early
   * key press is simply lost. That showed up as a test failing roughly one run
   * in three; the behaviour was correct whenever focus had settled, which is
   * exactly what makes it the kind of bug that reaches production.
   *
   * A modal dialog makes the rest of the page inert, so nothing else can be
   * listening for these keys while it is open.
   */
  const close = useCallback(() => {
    setIndex(null);
    // Return focus to the thumbnail that opened it, so a keyboard reader
    // resumes where they were instead of at the top of the document.
    openerRef.current?.focus();
  }, [setIndex]);

  const step = useCallback(
    (delta: number) => {
      if (openIndex === null) return;
      setIndex((openIndex + delta + images.length) % images.length);
    },
    [openIndex, images.length, setIndex],
  );

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();

      // Mirrored by reading direction: "next" is the key pointing forward in
      // the script, not the one pointing right.
      const rtl = document.documentElement.dir === "rtl";
      const forward = event.key === (rtl ? "ArrowLeft" : "ArrowRight");
      step(forward ? 1 : -1);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex, step]);

  return (
    <>
      <ul
        aria-label={label}
        className={cn("grid grid-cols-2 gap-4 md:grid-cols-3", className)}
      >
        {images.map((image, index) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setIndex(index);
              }}
              className="block w-full rounded-lg outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Image
                src={image.src}
                alt={image.alt}
                blurDataURL={image.blurDataURL}
                ratio="gallery"
                sizes="(min-width: 768px) 33vw, 50vw"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={lightboxLabel}
        // Escape fires `cancel`; routing through `close` keeps the URL and the
        // dialog from disagreeing about whether it is open.
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          if (start === null) return;

          const delta = (event.changedTouches[0]?.clientX ?? start) - start;
          if (Math.abs(delta) < SWIPE_THRESHOLD) return;

          // Dragging towards the start of the reading direction advances, in
          // both scripts — the same physical gesture, mirrored meaning.
          const forward = isRtl() ? delta > 0 : delta < 0;
          step(forward ? 1 : -1);
        }}
        className="max-h-full max-w-full bg-surface p-0 backdrop:bg-surface/90"
      >
        {openIndex !== null ? (
          <div className="flex flex-col gap-4 p-4">
            <Image
              src={images[openIndex].src}
              alt={images[openIndex].alt}
              blurDataURL={images[openIndex].blurDataURL}
              ratio="gallery"
              priority
              sizes="100vw"
            />

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={previousLabel}
                className="rounded-md px-4 py-2 text-body text-text outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {previousLabel}
              </button>

              <p className="text-small text-text-muted" aria-live="polite">
                <span dir="ltr" className="whitespace-nowrap tabular-nums">
                  {openIndex + 1}/{images.length}
                </span>
              </p>

              <button
                type="button"
                onClick={() => step(1)}
                aria-label={nextLabel}
                className="rounded-md px-4 py-2 text-body text-text outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {nextLabel}
              </button>
            </div>

            <button
              type="button"
              onClick={close}
              aria-label={closeLabel}
              className="rounded-md px-4 py-2 text-small text-text-muted outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {closeLabel}
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
