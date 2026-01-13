/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 1. Enable Static Export
  output: 'export',
  
  // 2. GitHub Pages requires unoptimized images
  images: {
    unoptimized: true,
  },

  // 3. Ensures paths like /about work correctly on GitHub Pages
  trailingSlash: true,

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  },

  /* Note: Rewrites do not work with 'output: export'. 
     You should use the full URL in your API calls or 
     rely on the NEXT_PUBLIC_API_URL env variable.
  */
};

module.exports = nextConfig;
