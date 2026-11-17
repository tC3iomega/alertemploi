import type { NextConfig } from 'next';
import BundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
  analyzerMode: 'static',
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['@alertemploi/core', '@alertemploi/ui'],
  experimental: {
    optimizePackageImports: ['lucide-react', '@alertemploi/ui'],
  },
};

export default withBundleAnalyzer(nextConfig);
