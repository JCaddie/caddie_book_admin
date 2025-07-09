import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "캐디북 관리자 시스템에 로그인하세요",
  robots: {
    index: false,
    follow: false,
  },
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        {children}
      </div>
    </div>
  );
}
