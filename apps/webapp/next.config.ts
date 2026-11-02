import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['@alertemploi/core', '@alertemploi/ui'],
};

export default nextConfig;
