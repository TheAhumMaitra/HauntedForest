import type { NextConfig } from "next";
import createMDX from "@next/mdx"

const withMDX = createMDX({
  extension: /\.mdx?$/
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,

  // REQUIRED for Next.js 16 + Contentlayer
  turbopack: {},
};

export default withMDX(nextConfig);
