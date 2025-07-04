"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks/use-auth";
import { Button, TextField } from "@/shared/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, testAccounts } = useAuth();
  const router = useRouter();

  // 이미 로그인된 경우 대시보드로 리다이렉션
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.message);
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
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
      const result = await login(testEmail, testPassword);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.message);
      }
    } catch {
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

        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          variant="primary"
          size="md"
          className="w-full"
        >
          로그인
        </Button>
      </form>

      {/* 테스트 계정 섹션 */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
          테스트 계정
        </h3>
        <div className="space-y-3">
          {testAccounts.map((account, index) => (
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
                <Button
                  type="button"
                  onClick={() =>
                    handleTestAccountLogin(account.email, account.password)
                  }
                  variant="primary"
                  size="sm"
                >
                  사용
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
