import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

// Setup MDX
const withMDX = createMDX({
  extension: /\.mdx?$/,
});

// Export using ES module syntax only
export default withMDX(nextConfig);
