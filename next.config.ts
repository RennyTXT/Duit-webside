import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
