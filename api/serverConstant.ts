const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const getSocketUrl = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://poojawala.com";
  try {
    return new URL(rawUrl).origin;
  } catch (e) {
    return rawUrl;
  }
};

export const SERVER_ENDPOINTS = {
  AUTH_BASEURL: process.env.NEXT_PUBLIC_AUTH_API_URL || BASE_URL,
  USER_BASEURL: process.env.NEXT_PUBLIC_USER_API_URL || BASE_URL,
  PAYMENT_BASEURL: process.env.NEXT_PUBLIC_PAYMENT_API_URL || BASE_URL,
  SOCKET_URL: getSocketUrl(),
};
