import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  nextIntlPlugin: createNextIntlPlugin({
    locales: ['pt', 'en', 'fr'],
    defaultLocale: 'pt',
  }),
};

export default nextConfig;
