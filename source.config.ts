import { defineDocs, defineConfig, GlobalConfig } from "fumadocs-mdx/config";
import { rehypeCode } from "fumadocs-core/mdx-plugins";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import fumapyOptions from "./fumapy.config";
import remarkGfm from "remark-gfm";
import remarkJupyterAdmonitions from "./plugins/remark-jupyter-admonitions";
import remarkAlerts from "./plugins/remark-alerts";

export const { docs, meta } = defineDocs({
  dir: "content/docs",
});

const config: GlobalConfig = {
  mdxOptions: {
    rehypePlugins: [
      rehypeKatex,
      // @ts-ignore
      [rehypeCode, { themes: fumapyOptions.shiki.themes }],
    ],
    remarkPlugins: [remarkAlerts, remarkMath, remarkGfm],
  },
};

export default defineConfig(config);
