/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  presets: ["next/babel"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "project-assets.showwcase.com",
      },
      {
        protocol: "https",
        hostname: "assets.showwcase.com",
      },
    ],
    domains: ["project-assets.showwcase.com", "assets.showwcase.com"],
  },
};

module.exports = nextConfig;
