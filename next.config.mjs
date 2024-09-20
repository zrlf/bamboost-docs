import nextra from "nextra";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your next.js config
  // reactStrictMode: true,
  // productionBrowserSourceMaps: true,
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/@typescript\/vfs\/dist\/vfs\.esm\.js/ },
      { file: /node_modules\/@typescript\/vfs\/dist\/vfs\.esm\.js/ },
    ];
  },
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  latex: true,
  defaultShowCopyCode: true,
});

export default withNextra(nextConfig);
