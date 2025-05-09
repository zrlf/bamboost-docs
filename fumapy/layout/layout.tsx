"use client";
import { baseOptions } from "@/app/layout.config";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { sources } from "../lib/source.api";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const firstSlug = pathname.split("/")[1];

  const source = Object.values(sources).find((source) => {
    return source.baseUrl === firstSlug;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-route", firstSlug);
  }, [firstSlug]);

  if (!source) {
    return null;
  }

  // I manually add a separator to the page tree
  const treeChildren = source.pageTree.children;

  const modifiedTreeChildren: [] = [];

  for (const child of treeChildren) {
    const isRoot = child.name?.toString().startsWith("bamboost");

    if (isRoot) {
      child.name = child.name?.toString().split("@")[0];

      // @ts-expect-error
      modifiedTreeChildren.push({
        type: "separator",
        // name: `Version: ${version?.replaceAll('\'', '')}`,
        name: (
          <span>
            Version:{" "}
            <code className="bg-muted p-1 rounded-sm border">
              {source.version?.replaceAll("'", "")}
            </code>
          </span>
        ),
      });
      // @ts-expect-error
      modifiedTreeChildren.push(child);
      // @ts-expect-error
      modifiedTreeChildren.push({
        type: "separator",
        name: "Modules",
      });
    } else {
      // @ts-expect-error
      modifiedTreeChildren.push(child);
    }
  }
  const newPageTree = { name: source.pkgName, children: modifiedTreeChildren };

  return (
    <DocsLayout
      containerProps={{
        ...source.options,
        className: `route-fumapy ${source.options?.className || ""}`,
      }}
      tree={newPageTree}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
