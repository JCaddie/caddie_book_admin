import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // EC2 서버 API 설정 (HTTPS 직접 연결)
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://3.35.21.201/api",
  },
};

export default nextConfig;
