"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/cn";

interface ProductGalleryProps {
  coverImage: string;
  gallery: string[];
  productName: string;
  className?: string;
}

export function ProductGallery({
  coverImage,
  gallery,
  productName,
  className,
}: ProductGalleryProps) {
  const images = gallery?.length ? gallery : [coverImage];
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="relative aspect-square overflow-hidden rounded-lg border border-origo-zinc bg-origo-charcoal">
        <Image
          src={images[selectedIndex] ?? coverImage}
          alt={`${productName} — image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded border transition sm:h-20 sm:w-20",
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
      )}
    </div>
  );
}
