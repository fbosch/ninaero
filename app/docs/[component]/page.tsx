import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComponentContent } from "@/components/docs/component-content";
import { docsRegistryUrl, getComponentDocumentation } from "@/lib/component-documentation";
import { componentTitle, isComponentName, overviewItems } from "@/lib/component-overview";

export const dynamicParams = false;

export function generateStaticParams() {
  return overviewItems.map((item) => ({ component: item.name }));
}

type Props = { params: Promise<{ component: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { component } = await params;
  if (!isComponentName(component)) notFound();
  const item = overviewItems.find((entry) => entry.name === component);
  return {
    title: `${componentTitle(component)} | Ninaero`,
    description: item?.description,
  };
}

export default async function ComponentDocsPage({ params }: Props) {
  const { component } = await params;
  if (!isComponentName(component)) notFound();
  const item = overviewItems.find((entry) => entry.name === component);
  if (!item) notFound();

  return (
    <ComponentContent
      name={component}
      description={item.description}
      documentation={getComponentDocumentation(component)}
      registryUrl={docsRegistryUrl}
    />
  );
}
