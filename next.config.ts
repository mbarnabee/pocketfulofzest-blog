import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/cdn\.sanity\.io\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "sanity-images",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
          },
        },
      },
      {
        urlPattern: /^\/recipes\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "recipe-pages",
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: /^\/api\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache",
          networkTimeoutSeconds: 10,
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
