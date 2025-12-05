/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export as static site for Cloudflare Pages
  output: "export",
  // Optimize images for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
