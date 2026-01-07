import { docs, blogPosts } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";
import { createElement } from "react";
import { icons } from "lucide-react";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

const docSource = loader({
  baseUrl: "/docs",
  icon(icon) {
    if (!icon) {
      return;
    }
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
  // source: createMDXSource(docs, meta),
  source: docs.toFumadocsSource(),
});

const blog = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blogPosts, []),
});

export { docSource, blog };
