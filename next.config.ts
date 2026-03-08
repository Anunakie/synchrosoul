import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.trycloudflare.com'],
    },
  },
  allowedDevOrigins: ['*.trycloudflare.com'],
}

export default nextConfig
