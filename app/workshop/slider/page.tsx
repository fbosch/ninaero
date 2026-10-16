import type { Metadata } from "next";

import { SliderSpecimens } from "./slider-specimens";

export const metadata: Metadata = { title: "Slider workshop | Ninaero" };

export default function SliderWorkshopPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl type-display">Sliders</h1>
        <p className="text-muted-foreground">
          Accent-glass ranges and horizontal squircle grabbers.
        </p>
        <p className="text-sm text-muted-foreground">
          These settings are examples and are not saved.
        </p>
        <p className="text-sm text-muted-foreground supports-[corner-shape:squircle]:hidden">
          This browser uses rounded grabbers instead of native squircles.
        </p>
      </header>
      <SliderSpecimens />
    </div>
  );
}
