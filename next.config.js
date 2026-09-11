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
  async rewrites() {
    const AUTH_SERVER = process.env.NEXT_SERVER_URL;
    const USER_SERVER = process.env.NEXT_SERVER_URL;
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
    const PAYMENT_SERVER = process.env.NEXT_SERVER_URL;

    return [
      {
        source: "/auth-proxy/:path*",
        destination: `${AUTH_SERVER}/:path*`,
      },
      {
        source: "/user-proxy/:path*",
        destination: `${USER_SERVER}/:path*`,
      },
      {
        source: "/payment-proxy/:path*",
        destination: `${PAYMENT_SERVER}/:path*`,
      },
      {
        source: "/socket.io/:path*",
        destination: `${SOCKET_URL}/socket.io/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
