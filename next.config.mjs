import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};
module.exports = nextConfig

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
