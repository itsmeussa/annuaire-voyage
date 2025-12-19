/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    unoptimized: true,
  },
  trailingSlash: true,
  // Increase static generation timeout for large sites
  staticPageGenerationTimeout: 180,
};

export default nextConfig;
