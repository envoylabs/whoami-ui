/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

let config = {
  distDir: 'dist',
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
}

// Only need rewrites for local development
if (process.env.NEXT_PUBLIC_CHAIN_ID === 'testing') {
  config.rewrites = async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:26657/:path*', // Proxy to Backend
      },
    ]
  }
}

module.exports = withBundleAnalyzer(config)
