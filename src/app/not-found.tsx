import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-8">페이지를 찾을 수 없습니다.</p>
        <Link
          href="/"
          className="px-4 py-2 bg-[#FEB912] text-white font-semibold rounded-md hover:bg-[#e5a50f]"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
