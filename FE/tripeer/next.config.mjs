/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.visitkorea.or.kr",
      },
      {
        protocol: "https",
        hostname: "conlab.visitkorea.or.kr",
      },
      {
        protocol: "https",
        hostname: "search.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn1.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn2.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "tripeerbucket.s3.ap-southeast-2.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "tong.visitkorea.or.kr",
      },
    ],
  },
  reactStrictMode: false,

  eslint: {
    ignoreDuringBuilds: true,
  },
  // distDir : "build"
  // output: 'export',
};

export default nextConfig;
