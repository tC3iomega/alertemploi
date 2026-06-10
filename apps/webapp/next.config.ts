import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ['app.local.first2apply.com', 'dragos.beastx.ro'],
  transpilePackages: ['@alertemploi/core', '@alertemploi/ui'],
};

export default nextConfig;
