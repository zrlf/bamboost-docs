import {
  defineDocs,
  defineConfig,
  GlobalConfig,
  defineCollections,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import fumapyOptions from "./fumapy.config";
import remarkGfm from "remark-gfm";
import { remarkSteps } from "fumadocs-core/mdx-plugins";
import { z } from "zod";

export const docs = defineDocs({
  dir: ".docs/docs",
});

export const blogPosts = defineCollections({
  type: "doc",
  dir: "blog",
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.iso.date().or(z.date()),
  }),
});

const config: GlobalConfig = {
  mdxOptions: {
    rehypePlugins: (v) => [rehypeKatex, ...v],
    remarkPlugins: (v) => [remarkMath, remarkGfm, remarkSteps, ...v],
    // @ts-ignore
    rehypeCodeOptions: { themes: fumapyOptions.shiki.themes },
  },
};

export default defineConfig(config);
