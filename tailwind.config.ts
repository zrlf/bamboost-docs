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
      preset: "default",
      addGlobalColors: true,
    }),
  ],
  theme: {
    extend: {
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
