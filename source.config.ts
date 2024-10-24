import { defineDocs, defineConfig, GlobalConfig } from "fumadocs-mdx/config";
import { rehypeCode } from "fumadocs-core/mdx-plugins";
import { shikiTheme } from "./constants";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export const { docs, meta } = defineDocs({
  dir: "content/docs",
});

const config: GlobalConfig = {
  mdxOptions: {
    rehypePlugins: [rehypeKatex, [rehypeCode, { themes: { ...shikiTheme } }]],
    remarkPlugins: [remarkMath],
  },
};

export default defineConfig(config);
