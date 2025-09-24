import type {NextConfig} from "next";

const repoName = "image-studio-demo"
const isGithubPages = process.env.GITHUB_PAGES === "true"

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  basePath: isGithubPages ? `/${repoName}` : undefined,
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
  trailingSlash: true,
  experimental: {
    reactCompiler: true
  },
  images: {unoptimized: true}
};

export default nextConfig;
