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
  basePath: '/Duit-webside',
  assetPrefix: '/Duit-webside',
};

export default nextConfig;
