import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['utfs.io', 'lh3.googleusercontent.com', 'hnklpqevocjiprqdqkef.supabase.co'],
  },
  // Add this to allow connections from ngrok and other external sources
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          }
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    // Any webpack config if needed
    return config
  },
};

export default nextConfig;
