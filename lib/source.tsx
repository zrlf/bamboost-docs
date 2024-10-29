import { docs, meta } from "@/.source";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";
import { createElement } from "react";
import { icons } from "lucide-react";

const docSource = loader({
  baseUrl: "/docs",
  icon(icon) {
    if (!icon) {
      return;
    }
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
  source: createMDXSource(docs, meta),
});

export { docSource };
