import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  allowedDevOrigins: [
    "192.168.1.28",
    "localhost",
    "app.ntmanh.io.vn",
  ],

  experimental: {
    // các config experimental khác nếu bạn có
  },

  turbopack: {
    root: path.resolve("."),
  },
};

export default nextConfig;