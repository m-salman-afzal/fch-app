/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**'
      }
    ]
  },
  reactStrictMode: true,
  transpilePackages: ['vs-design-components'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false
      }
    ];
  }
};

module.exports = nextConfig;
