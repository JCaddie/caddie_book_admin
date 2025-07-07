"use client";

import { useState } from "react";
import { useAuth } from "@/shared/hooks/use-auth";
import { TextField } from "@/shared/components/ui";

// 테스트 계정 데이터
const TEST_ACCOUNTS = [
  {
    id: "1",
    name: "개발사 관리자",
    email: "dev@example.com",
    password: "dev123",
    role: "DEVELOPER",
  },
  {
    id: "2",
    name: "골프장 관리자",
    email: "golf@example.com",
    password: "golf123",
    role: "BRANCH",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  // 미들웨어에서 인증 상태에 따른 리다이렉트를 처리하므로
  // 클라이언트에서 별도의 인증 체크는 불필요

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", { email, password });

    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // 테스트 계정 확인
      const account = TEST_ACCOUNTS.find(
        (acc) => acc.email === email && acc.password === password
      );

      console.log("계정 찾기 결과:", account);

      if (account) {
        // 간단한 토큰 생성 (실제로는 서버에서 발급받음)
        const token = `mock-token-${account.id}-${Date.now()}`;
        console.log("토큰 생성:", token);

        login(token);
        console.log("로그인 함수 호출 완료");

        // 쿠키 설정 후 잠시 기다린 다음 새로고침
        setTimeout(() => {
          console.log("현재 쿠키:", document.cookie);
          console.log("페이지 새로고침으로 미들웨어 트리거");
          window.location.href = "/dashboard";
        }, 100);
      } else {
        setError("이메일 또는 비밀번호가 잘못되었습니다.");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestAccountLogin = async (
    testEmail: string,
    testPassword: string
  ) => {
    console.log("테스트 계정 로그인:", { testEmail, testPassword });

    setEmail(testEmail);
    setPassword(testPassword);
    setError("");
    setIsSubmitting(true);

    try {
      const account = TEST_ACCOUNTS.find(
        (acc) => acc.email === testEmail && acc.password === testPassword
      );

      console.log("테스트 계정 찾기 결과:", account);

      if (account) {
        const token = `mock-token-${account.id}-${Date.now()}`;
        console.log("테스트 계정 토큰 생성:", token);

        login(token);
        console.log("테스트 계정 로그인 함수 호출 완료");

        // 쿠키 설정 후 잠시 기다린 다음 새로고침
        setTimeout(() => {
          console.log("테스트 계정 현재 쿠키:", document.cookie);
          console.log("테스트 계정 페이지 새로고침으로 미들웨어 트리거");
          window.location.href = "/dashboard";
        }, 100);
      } else {
        setError("계정 정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("테스트 계정 로그인 에러:", error);
      setError("로그인 중 오류가 발생했습니다.");
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
          placeholder="admin@example.com"
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
                    {account.role === "DEVELOPER" ? "개발사" : "골프장"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleTestAccountLogin(account.email, account.password)
                  }
                  className="bg-[#FEB912] hover:bg-[#E5A50F] text-white font-medium py-1 px-3 rounded text-sm transition-colors"
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
