"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/ninaero/ui/carousel";

export function CarouselPreview() {
  return (
    <Carousel className="w-full max-w-xs" aria-label="Example slides">
      <CarouselContent>
        {["First", "Second", "Third"].map((label) => (
          <CarouselItem key={label}>
            <div className="flex h-24 items-center justify-center rounded-lg border bg-card text-xl font-medium">
              {label}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex justify-center gap-2">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
}
