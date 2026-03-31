/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper trailing slashes
  trailingSlash: false,
  
  // Disable strict mode if causing issues
  reactStrictMode: true,
  
  // Output configuration
  output: 'standalone',
  
  // Image optimization (optional)
  images: {
    domains: [], // Add any external image domains here
  },
}

module.exports = nextConfig
