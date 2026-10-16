// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/purohit/:path*',
        destination: '/partner/:path*',
        permanent: false,
      },
      {
        source: '/purohit',
        destination: '/partner',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // example fallback if needed
      },
      {
        protocol: 'https',
        hostname: 'hichandra-icons-prod-581145855345-eu-north-1-an.s3.eu-north-1.amazonaws.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000'
      }
    ],
  },
};

module.exports = nextConfig;
