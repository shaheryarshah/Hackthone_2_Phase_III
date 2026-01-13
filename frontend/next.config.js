/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 1. Enable Static Export for GitHub Pages
  output: 'export',
  
  // 2. Add the BasePath for your specific repository
  basePath: '/Hackthone_2_Phase_III',
  
  // 3. Ensure assets like CSS/JS use the same path prefix
  assetPrefix: '/Hackthone_2_Phase_III',

  // 4. Required for static hosting
  images: {
    unoptimized: true,
  },
  trailingSlash: true,

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  },
};

module.exports = nextConfig;
