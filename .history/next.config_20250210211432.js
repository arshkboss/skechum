/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.fal.media'
      },
      {
        protocol: 'https',
        hostname: 'utfs.io'
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'hnklpqevocjiprqdqkef.supabase.co'
      },
      {
        protocol: 'https',
        hostname: 'figma.com'
      },
      {
        protocol: 'https',
        hostname: 'authjs.dev'
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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