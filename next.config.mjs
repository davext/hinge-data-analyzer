/** @type {import('next').NextConfig} */
const nextConfig = {
  // No static export - OpenNext handles SSR on Cloudflare
  // Images can be optimized with Cloudflare
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
