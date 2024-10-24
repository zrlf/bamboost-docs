import { defineDocs, defineConfig, GlobalConfig } from 'fumadocs-mdx/config';
import { rehypeCode } from "fumadocs-core/mdx-plugins";
import { shikiTheme } from "./constants";

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
});

const config: GlobalConfig = {
  mdxOptions: {
    rehypePlugins: [[rehypeCode, { themes: {...shikiTheme} }]],
  },
};

export default defineConfig(config);


