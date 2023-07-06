/** @type {import('next').NextConfig} */
const nextConfig = {
  source: '/api/:path*',
  headers: [
    { key: 'Access-Control-Allow-Credentials', value: 'true' },
    { key: 'Access-Control-Allow-Origin', value: 'https://doctoragenda.app' },
    {
      key: 'Access-Control-Allow-Methods',
      value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    },
    {
      key: 'Access-Control-Allow-Headers',
      value:
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
  ],
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'],
  images: {
    domains: ['https://lh3.googleusercontent.com/'],
  },
}

module.exports = nextConfig
