"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks/use-auth";
import { TextField } from "@/shared/components/ui";
import { User } from "@/shared/types";

// 테스트 계정 데이터
const TEST_ACCOUNTS = [
  {
    id: "1",
    name: "master",
    email: "master@caddiebook.com",
    password: "master123!",
    role: "MASTER" as const,
  },
  {
    id: "2",
    name: "admin",
    email: "admin@caddiebook.com",
    password: "admin123!",
    role: "ADMIN" as const,
    golfCourseId: "golf-course-1",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // 이미 인증된 사용자는 대시보드로 리디렉션
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // 약간의 지연을 주어 상태 업데이트가 확실히 완료되도록 함
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FEB912] mx-auto"></div>
          <p className="mt-4 text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 미들웨어에서 인증 상태에 따른 리다이렉트를 처리하므로
  // 클라이언트에서 별도의 인증 체크는 불필요

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // 실제 API 호출
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // 로그인 API 응답 데이터 출력
        console.log("🔍 로그인 API 응답 데이터:", data);
        console.log("📋 응답 데이터 구조:", JSON.stringify(data, null, 2));

        // API 응답에서 토큰과 사용자 정보 추출
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        console.log("🔑 추출된 액세스 토큰:", accessToken);
        console.log("🔄 추출된 리프레시 토큰:", refreshToken);

        // 실제 API 응답 구조에 맞게 사용자 정보 생성
        const user: User = {
          id: data.user.id,
          name: data.user.name || data.user.username,
          email: data.user.email,
          role: data.user.role,
          golfCourseId: data.user.golf_course_id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log("👤 생성된 사용자 정보:", user);

        // 로그인 함수 호출
        login(accessToken, user);
      } else {
        const errorData = await response.json();
        console.log("❌ 로그인 실패 - 응답 상태:", response.status);
        console.log("❌ 로그인 실패 - 에러 데이터:", errorData);
        setError(errorData.detail || "이메일 또는 비밀번호가 잘못되었습니다.");
      }
    } catch (error) {
      console.error("🚨 로그인 네트워크 에러:", error);
      setError("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestAccountLogin = async (
    testEmail: string,
    testPassword: string
  ) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setError("");
    setIsSubmitting(true);

    try {
      // 실제 API 호출
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: testEmail,
          password: testPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // 테스트 계정 로그인 API 응답 데이터 출력
        console.log("🧪 테스트 계정 로그인 API 응답 데이터:", data);
        console.log(
          "📋 테스트 응답 데이터 구조:",
          JSON.stringify(data, null, 2)
        );

        // API 응답에서 토큰과 사용자 정보 추출
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        console.log("🔑 테스트 계정 추출된 액세스 토큰:", accessToken);
        console.log("🔄 테스트 계정 추출된 리프레시 토큰:", refreshToken);

        // 실제 API 응답 구조에 맞게 사용자 정보 생성
        const user: User = {
          id: data.user.id,
          name: data.user.name || data.user.username,
          email: data.user.email,
          role: data.user.role,
          golfCourseId: data.user.golf_course_id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log("👤 테스트 계정 생성된 사용자 정보:", user);

        // 로그인 함수 호출
        login(accessToken, user);
      } else {
        const errorData = await response.json();
        console.log("❌ 테스트 계정 로그인 실패 - 응답 상태:", response.status);
        console.log("❌ 테스트 계정 로그인 실패 - 에러 데이터:", errorData);
        setError(errorData.detail || "계정 정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("🚨 테스트 계정 로그인 네트워크 에러:", error);
      setError("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">관리자 로그인</h1>
        <p className="mt-2 text-sm text-gray-600">
          골프장 관리 시스템에 로그인하세요
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="email"
          type="email"
          label="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="master@caddiebook.com"
          disabled={isSubmitting}
        />

        <TextField
          id="password"
          type="password"
          label="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isSubmitting}
          showVisibilityToggle={true}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#FEB912] hover:bg-[#E5A50F] disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {/* 테스트 계정 섹션 */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
          테스트 계정
        </h3>
        <div className="space-y-3">
          {TEST_ACCOUNTS.map((account, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{account.name}</h4>
                  <p className="text-sm text-gray-600">{account.email}</p>
                  <p className="text-xs text-gray-500">
                    비밀번호: {account.password} | 권한:{" "}
                    {account.role === "MASTER"
                      ? "슈퍼관리자 (모든 권한)"
                      : "스태프 (골프장 관리)"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleTestAccountLogin(account.email, account.password)
                  }
                  disabled={isSubmitting}
                  className="bg-[#FEB912] hover:bg-[#E5A50F] disabled:bg-gray-300 text-white font-medium py-1 px-3 rounded text-sm transition-colors"
                >
                  사용
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
