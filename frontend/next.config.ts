import { withContentlayer } from "next-contentlayer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,

  // REQUIRED for Next.js 16 + Contentlayer
  turbopack: {},
};

export default withContentlayer(nextConfig);
