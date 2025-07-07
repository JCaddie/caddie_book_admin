"use client";

export default function Home() {
  // 미들웨어에서 인증 상태에 따라 자동으로 리다이렉트하므로
  // 이 페이지는 실제로는 접근되지 않습니다.
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FEB912] mx-auto mb-4"></div>
        <p className="text-gray-600">리다이렉트 중...</p>
      </div>
    </div>
  );
}
