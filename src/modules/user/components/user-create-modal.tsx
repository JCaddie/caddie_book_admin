"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, Dropdown, Input } from "@/shared/components/ui";
import { useGolfCoursesSimple } from "@/modules/golf-course/hooks/use-golf-courses-simple";
import { CreateAdminRequest } from "../types";
import { UserRole } from "@/shared/types/user";

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateAdminRequest) => Promise<void>;
  isLoading?: boolean;
}

interface UserFormData {
  username: string;
  password: string;
  password_confirm: string;
  name: string;
  email: string;
  role: UserRole;
  golf_course_id: string;
}

// 마스터는 관리자만 생성 가능하므로 역할 고정
const DEFAULT_ROLE: UserRole = "ADMIN";

export const UserCreateModal: React.FC<UserCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  // 골프장 목록 조회
  const { data: golfCoursesData } = useGolfCoursesSimple();

  // 골프장 드롭다운 옵션 생성
  const golfCourseOptions = React.useMemo(() => {
    if (!golfCoursesData?.data) return [];
    return golfCoursesData.data.map((course) => ({
      label: course.name,
      value: course.id,
    }));
  }, [golfCoursesData]);

  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    password: "",
    password_confirm: "",
    name: "",
    email: "",
    role: DEFAULT_ROLE,
    golf_course_id: "",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const [apiError, setApiError] = useState<string>("");

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = "아이디를 입력해주세요.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    if (!formData.password_confirm.trim()) {
      newErrors.password_confirm = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = "비밀번호가 일치하지 않습니다.";
    }

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "이메일 형식이 올바르지 않습니다.";
    }

    // 역할은 기본값으로 고정되므로 검증 불필요

    if (!formData.golf_course_id.trim()) {
      newErrors.golf_course_id = "골프장을 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // API 에러 초기화
    setApiError("");

    const userData: CreateAdminRequest = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirm: formData.password_confirm,
      role: formData.role,
      golf_course_id: formData.golf_course_id,
    };

    try {
      await onSubmit(userData);
    } catch (error) {
      if (error instanceof Error) {
        // 에러 메시지에서 non_field_errors 파싱 시도
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            setApiError(errorData.non_field_errors.join(' '));
          } else {
            setApiError(error.message);
          }
        } catch {
          setApiError(error.message);
        }
      } else {
        setApiError("사용자 생성 중 오류가 발생했습니다.");
      }
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        username: "",
        password: "",
        password_confirm: "",
        name: "",
        email: "",
        role: DEFAULT_ROLE,
        golf_course_id: "",
      });
      setErrors({});
      setApiError("");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-md border border-gray-100 shadow-lg"
        style={{
          width: "400px",
          boxShadow: "0px 1px 8px 1px rgba(99, 108, 132, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            관리자 생성
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* 모달 콘텐츠 */}
        <div className="px-6 pb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="space-y-4">
              {/* 아이디 입력 */}
              <div>
                <Input
                  type="text"
                  placeholder="아이디 입력*"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  disabled={isLoading}
                  error={errors.username}
                  containerClassName="w-full"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <Input
                  type="password"
                  placeholder="비밀번호 입력*"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  disabled={isLoading}
                  error={errors.password}
                  showVisibilityToggle
                  containerClassName="w-full"
                />
              </div>

              {/* 비밀번호 확인 입력 */}
              <div>
                <Input
                  type="password"
                  placeholder="비밀번호 확인*"
                  value={formData.password_confirm}
                  onChange={(e) =>
                    handleInputChange("password_confirm", e.target.value)
                  }
                  disabled={isLoading}
                  error={errors.password_confirm}
                  showVisibilityToggle
                  containerClassName="w-full"
                />
              </div>

              {/* 이름 입력 */}
              <div>
                <Input
                  type="text"
                  placeholder="이름 입력*"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={isLoading}
                  error={errors.name}
                  containerClassName="w-full"
                />
              </div>

              {/* 이메일 입력 */}
              <div>
                <Input
                  type="email"
                  placeholder="이메일 입력*"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isLoading}
                  error={errors.email}
                  containerClassName="w-full"
                />
              </div>

              {/* 골프장 선택 */}
              <div>
                <Dropdown
                  options={golfCourseOptions}
                  value={formData.golf_course_id}
                  onChange={(value) =>
                    handleInputChange("golf_course_id", value)
                  }
                  placeholder="골프장 선택*"
                  disabled={isLoading}
                  containerClassName="w-full"
                />
                {errors.golf_course_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.golf_course_id}
                  </p>
                )}
              </div>
            </div>

            {/* API 에러 메시지 */}
            {apiError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}

            {/* 생성하기 버튼 */}
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                loading={isLoading}
                className="w-full"
                style={{
                  backgroundColor: "#FEB912",
                  boxShadow: "0px 2px 8px 2px rgba(254, 185, 18, 0.42)",
                }}
              >
                생성하기
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
