import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  experimental: {
    reactCompiler: true
  },
  images: {unoptimized: true}
};

export default nextConfig;
