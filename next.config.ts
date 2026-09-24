import type { NextConfig } from "next";

// Static export: the demo deploys to any static host (Vercel, Netlify, S3, GitHub Pages).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
