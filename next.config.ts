import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-optimized.imweb.me',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.imweb.me',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tupvzkekyzgxhwagrvgl.supabase.co',
        pathname: '/**',
      },
    ],
  },
  // Keep only basePath for GitHub Pages sub-directory deployment
  basePath: '/Duit-webside',
};

export default nextConfig;
