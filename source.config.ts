import { defineDocs, defineConfig, GlobalConfig } from "fumadocs-mdx/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import fumapyOptions from "./fumapy.config";
import remarkGfm from "remark-gfm";

export const { docs, meta } = defineDocs({
  dir: ".docs/docs",
});

const config: GlobalConfig = {
  mdxOptions: {
    rehypePlugins: (v) => [
      rehypeKatex,
      ...v,
    ],
    remarkPlugins: [remarkMath, remarkGfm],
    rehypeCodeOptions: { themes: fumapyOptions.shiki.themes },
  },
};

export default defineConfig(config);
