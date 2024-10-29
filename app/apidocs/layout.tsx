import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "../layout.config";
import { sources } from "@/lib/source.api";

const source = sources.bamboost;

export default function Layout({ children }: { children: ReactNode }) {
  // I manually add a separator to the page tree
  const treeChildren = source.pageTree.children;

  const modifiedTreeChildren: [] = [];

  for (const child of treeChildren) {
    const isRoot = child.name?.toString().startsWith("bamboost");

    if (isRoot) {
      child.name = "bamboost";

      // @ts-expect-error
      modifiedTreeChildren.push({
        type: "separator",
        // name: `Version: ${version?.replaceAll('\'', '')}`,
        name: (
          <span>
            Version:{" "}
            <code className="bg-muted p-1 rounded border">
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
  const newPageTree = { name: "bamboost", children: modifiedTreeChildren };

  return (
    <DocsLayout tree={newPageTree} {...baseOptions}>
      {children}
    </DocsLayout>
  );
}
