import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "../layout.config";
import { apiSource } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  // I manually add a separator to the page tree
  const treeChildren = apiSource.pageTree.children;
  const modifiedTreeChildren: [] = [];
  for (const child of treeChildren) {
    // @ts-expect-error
    modifiedTreeChildren.push(child);
    if (child.name === "bamboost") {
      // @ts-expect-error
      modifiedTreeChildren.push({
        type: "separator",
        name: "Modules",
      });
    }
  }
  const newPageTree = { name: "bamboost", children: modifiedTreeChildren };

  return (
    <DocsLayout tree={newPageTree} {...baseOptions}>
      {children}
    </DocsLayout>
  );
}
