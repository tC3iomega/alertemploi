import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['@alertemploi/core', '@alertemploi/ui'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
