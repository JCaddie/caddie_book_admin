import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // EC2 서버 API 설정 (프록시 사용)
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  },
  // Mixed Content 문제 해결을 위한 프록시 설정
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://3.35.21.201:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
