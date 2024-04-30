/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "cdn.visitkorea.or.kr",
      "tong.visitkorea.or.kr",
      "conlab.visitkorea.or.kr",
      "lh3.googleusercontent.com",
      "lh5.googleusercontent.com",
      "encrypted-tbn2.gstatic.com",
      "search.pstatic.net",
      "encrypted-tbn0.gstatic.com",
      "encrypted-tbn1.gstatic.com",
      "tripeerbucket.s3.ap-southeast-2.amazonaws.com",
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  // distDir : "build"
  // output: 'export',
};

export default nextConfig;
