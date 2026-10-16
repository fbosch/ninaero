import { createElement, type ReactElement } from "react";

import { ninaeroMarkElements, type NinaeroMarkElement } from "@/lib/ninaero-mark.mjs";

function renderElement(element: NinaeroMarkElement, index: number): ReactElement {
  return createElement(
    element.tag,
    { ...element.attributes, key: index },
    element.children?.map(renderElement),
  );
}

export function NinaeroMarkShape({ gradientId }: { gradientId: string }) {
  return <>{ninaeroMarkElements(gradientId).map(renderElement)}</>;
}
