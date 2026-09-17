// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
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
