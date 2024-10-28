import { createPreset } from "fumadocs-ui/tailwind-plugin";
import { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./mdx-components.{ts,tsx}",
    "./node_modules/fumadocs-ui/dist/**/*.js",
    "./lib/source.tsx",
  ],
  presets: [
    createPreset({
      preset: "vitepress",
      addGlobalColors: true,
    }),
  ],
  theme: {
    extend: {
      colors: {
        class: "hsl(var(--class))",
        meth: "hsl(var(--meth))",
        func: "hsl(var(--func))",
      },
      margin: {
        indent: "2rem",
        indent2: "1rem",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-links": "hsl(var(--primary))",
            // Add more custom prose colors as needed
          },
        },
      },
    },
  },
} satisfies Config;
