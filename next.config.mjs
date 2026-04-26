/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://gpay.gammingbazaar.com/api/:path*',
      },
      {
        source: '/storage/:path*',
        destination: 'https://gpay.gammingbazaar.com/storage/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        // Existing redirect
        source: '/product/:slug',
        destination: '/topup/:slug',
        permanent: true,
      },
      {
        // www to non-www redirect for all paths
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.freefiretopupbd.com',
          },
        ],
        destination: 'https://freefiretopupbd.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;