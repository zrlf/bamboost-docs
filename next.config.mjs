import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["@/"] = "./";
    return config;
  },
  output: "export",
};

export default withMDX(config);
