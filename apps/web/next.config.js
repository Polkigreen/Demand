/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.CAPACITOR ? "export" : undefined,
  images: {
    unoptimized: process.env.CAPACITOR === "true",
  },
};

module.exports = nextConfig;
