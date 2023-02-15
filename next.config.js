/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  pageExtensions: ["mdx", "md", "jsx", "tsx"],
};

module.exports = nextConfig;
