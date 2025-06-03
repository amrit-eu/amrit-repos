import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.ocean-ops.org',
        pathname: '/static/images/flags_iso/24/**',
      },
    ],
  }
};

export default nextConfig;
