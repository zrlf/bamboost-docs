import { baseOptions } from "@/app/layout.config";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { ReactNode } from "react";
import { sources } from "@/fumapy/lib/source.api";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const firstSlug = slug ? slug[0] : undefined;

  const source = Object.values(sources).find((source) => {
    return source.baseUrl === firstSlug;
  });

  if (!source) {
    return null;
  }

  return (
    <DocsLayout
      containerProps={{
        ...source.options,
        className: `route-fumapy ${source.options?.className || ""}`,
      }}
      tree={source.fdSource.pageTree}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
