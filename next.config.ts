import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  experimental: {
    reactCompiler: true
  }
  /* config options here */
};

export default nextConfig;
