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
  // Help GitHub Pages resolve paths correctly by ensuring folders have trailing slashes
  trailingSlash: true,
};

export default nextConfig;
