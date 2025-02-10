/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'utfs.io',
      'lh3.googleusercontent.com', 
      'hnklpqevocjiprqdqkef.supabase.co',
      'fal.media',
      'v3.fal.media',
      'figma.com'
    ],
  },
  // Basic security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    // Any webpack config if needed
    return config
  },
}

module.exports = nextConfig 