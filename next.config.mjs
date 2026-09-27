/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Set to "/repo-name" in GitHub Actions when serving from https://<org>.github.io/repo-name/
  // (a custom domain, or a *.github.io root repo, needs neither and can leave this unset).
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",
};
export default nextConfig;
