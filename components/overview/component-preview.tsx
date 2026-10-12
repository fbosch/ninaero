"use client";

import type { ComponentType } from "react";
import type { ComponentName, PreviewProps } from "@/lib/component-overview";
import { controlPreviews } from "./control-previews";
import { displayPreviews } from "./display-previews";
import { navigationPreviews } from "./navigation-previews";
import { overlayPreviews } from "./overlay-previews";

const previews = {
  ...controlPreviews,
  ...navigationPreviews,
  ...overlayPreviews,
  ...displayPreviews,
} satisfies Record<ComponentName, ComponentType<PreviewProps>>;

export function ComponentPreview({
  name,
  interactive = false,
}: PreviewProps & { name: ComponentName }) {
  const Preview = previews[name];
  return <Preview interactive={interactive} />;
}
