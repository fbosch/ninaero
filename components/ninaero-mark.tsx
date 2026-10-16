import { useId, type ComponentProps } from "react";

import { NinaeroMarkShape } from "@/components/ninaero-mark-shape";
import { ninaeroMarkViewBox } from "@/lib/ninaero-mark.mjs";

export function NinaeroMark(props: ComponentProps<"svg">) {
  const gradientId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox={ninaeroMarkViewBox}
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <NinaeroMarkShape gradientId={gradientId} />
    </svg>
  );
}
