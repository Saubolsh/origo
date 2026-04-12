"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "@/shared/lib/cn";

interface ProductPageEmblaGalleryProps {
  coverImage: string;
  gallery: string[];
  productName: string;
  className?: string;
}

export function ProductPageEmblaGallery({
  coverImage,
  gallery,
  productName,
  className,
}: ProductPageEmblaGalleryProps) {
  const images = gallery?.length ? gallery : [coverImage];

  if (images.length === 1) {
    return (
      <div className={cn("flex min-w-0 flex-col gap-4", className)}>
        <div className="flex items-center justify-center overflow-hidden rounded-lg border border-origo-zinc bg-origo-charcoal">
          <Image
            src={images[0] ?? coverImage}
            alt={`${productName} — image 1`}
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-auto max-h-[50vh] w-full object-contain sm:max-h-[600px]"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <ProductPageEmblaGalleryMulti
      images={images}
      productName={productName}
      className={className}
    />
  );
}

function ProductPageEmblaGalleryMulti({
  images,
  productName,
  className,
}: {
  images: string[];
  productName: string;
  className?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [mainViewportHeight, setMainViewportHeight] = useState<number | null>(
    null
  );

  const [mainRef, mainApi] = useEmblaCarousel({ align: "start", loop: false });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index);
    },
    [mainApi]
  );

  const scrollPrev = useCallback(() => mainApi?.scrollPrev(), [mainApi]);
  const scrollNext = useCallback(() => mainApi?.scrollNext(), [mainApi]);

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi?.scrollTo(index);
    setPrevDisabled(!mainApi.canScrollPrev());
    setNextDisabled(!mainApi.canScrollNext());
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("reInit", onSelect);
    mainApi.on("select", onSelect);
    return () => {
      mainApi.off("reInit", onSelect);
      mainApi.off("select", onSelect);
    };
  }, [mainApi, onSelect]);

  useLayoutEffect(() => {
    if (!mainApi) return;
    const slides = mainApi.slideNodes();
    const slide = slides[selectedIndex];
    if (!slide) return;
    const inner = slide.querySelector<HTMLElement>("[data-gallery-slide-inner]");
    if (!inner) return;

    const measure = () => {
      const h = Math.ceil(inner.getBoundingClientRect().height);
      if (h > 0) {
        setMainViewportHeight((prev) => (prev === h ? prev : h));
      }
    };

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(inner);
    return () => ro.disconnect();
  }, [mainApi, selectedIndex, images]);

  useEffect(() => {
    if (!mainApi || mainViewportHeight == null) return;
    mainApi.reInit();
  }, [mainApi, mainViewportHeight]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  const total = images.length;

  return (
    <div
      className={cn("flex min-w-0 flex-col gap-4", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${productName} images`}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <p className="sr-only" aria-live="polite">
        Image {selectedIndex + 1} of {total}
      </p>

      <div className="relative">
        <div
          ref={mainRef}
          className="min-h-[12rem] overflow-hidden rounded-lg border border-origo-zinc bg-origo-charcoal"
          style={
            mainViewportHeight != null
              ? { height: mainViewportHeight }
              : undefined
          }
        >
          <div className="flex touch-pan-y items-stretch">
            {images.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="flex min-w-0 shrink-0 grow-0 basis-full flex-col"
                style={
                  mainViewportHeight != null
                    ? { height: mainViewportHeight }
                    : undefined
                }
              >
                <div
                  data-gallery-slide-inner
                  className="flex min-h-0 flex-1 items-center justify-center px-2 py-2 sm:px-4 sm:py-4"
                >
                  <Image
                    src={src}
                    alt={`${productName} — image ${i + 1}`}
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={cn(
                      "w-full object-contain",
                      mainViewportHeight != null
                        ? "h-auto max-h-full"
                        : "h-auto max-h-[50vh] sm:max-h-[600px]"
                    )}
                    priority={i === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden md:block">
          <div className="relative h-full max-w-full">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={prevDisabled}
              aria-label="Previous image"
              className={cn(
                "pointer-events-auto absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-origo-zinc bg-origo-charcoal/90 p-2 text-origo-silver shadow-md backdrop-blur-sm transition hover:border-origo-silver hover:text-white disabled:pointer-events-none disabled:opacity-30"
              )}
            >
              <ChevronIcon className="h-5 w-5 rotate-180" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={nextDisabled}
              aria-label="Next image"
              className={cn(
                "pointer-events-auto absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-origo-zinc bg-origo-charcoal/90 p-2 text-origo-silver shadow-md backdrop-blur-sm transition hover:border-origo-silver hover:text-white disabled:pointer-events-none disabled:opacity-30"
              )}
            >
              <ChevronIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-origo-silver md:hidden">
        <span aria-hidden="true">
          {selectedIndex + 1} / {total}
        </span>
      </div>

      <div
        ref={thumbRef}
        className="overflow-hidden py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-2 px-2">
          {images.map((src, i) => (
            <button
              key={`thumb-${src}-${i}`}
              type="button"
              onClick={() => onThumbClick(i)}
              aria-label={`View image ${i + 1} of ${total}`}
              aria-current={selectedIndex === i ? "true" : undefined}
              className={cn(
                "relative h-16 w-16 shrink-0 grow-0 overflow-hidden rounded border transition sm:h-20 sm:w-20",
                selectedIndex === i
                  ? "border-origo-accent ring-2 ring-origo-accent/50"
                  : "border-origo-zinc hover:border-origo-silver"
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
