import { baseOptions } from "@/lib/layout.shared";
import { docSource } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { type ReactNode } from "react";
import "katex/dist/katex.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      containerProps={{ className: "route-docs" }}
      tree={docSource.pageTree}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
