import { defineDocs, defineConfig, GlobalConfig } from "fumadocs-mdx/config";
import { rehypeCode } from "fumadocs-core/mdx-plugins";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import fumapyOptions from "./fumapy.config";
import remarkGfm from "remark-gfm";

export const { docs, meta } = defineDocs({
  dir: ".docs/docs",
});

const config: GlobalConfig = {
  mdxOptions: {
    rehypePlugins: [
      rehypeKatex,
      // @ts-ignore
      [rehypeCode, { themes: fumapyOptions.shiki.themes }],
    ],
    remarkPlugins: [remarkMath, remarkGfm],
  },
};

export default defineConfig(config);
