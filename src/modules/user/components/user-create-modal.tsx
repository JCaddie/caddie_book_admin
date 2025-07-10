"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, Input, Dropdown } from "@/shared/components/ui";

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserFormData) => void;
  isLoading?: boolean;
}

interface UserFormData {
  username: string;
  password: string;
  name: string;
  phone: string;
  phonePrefix: string;
  email: string;
}

const PHONE_PREFIX_OPTIONS = [
  { label: "010", value: "010" },
  { label: "011", value: "011" },
  { label: "016", value: "016" },
  { label: "017", value: "017" },
  { label: "018", value: "018" },
  { label: "019", value: "019" },
];

export const UserCreateModal: React.FC<UserCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    password: "",
    name: "",
    phone: "",
    phonePrefix: "010",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

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

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "전화번호를 입력해주세요.";
    } else if (!/^\d{7,8}$/.test(formData.phone)) {
      newErrors.phone = "전화번호 형식이 올바르지 않습니다.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "이메일 형식이 올바르지 않습니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const userData = {
      ...formData,
      phone: `${formData.phonePrefix}-${formData.phone}`,
    };

    onSubmit(userData);
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        username: "",
        password: "",
        name: "",
        phone: "",
        phonePrefix: "010",
        email: "",
      });
      setErrors({});
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
            관리자 계정 생성
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
          <div className="space-y-4">
            {/* 아이디 입력 */}
            <div>
              <Input
                type="text"
                placeholder="아이디 입력*"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
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
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isLoading}
                error={errors.password}
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

            {/* 전화번호 입력 */}
            <div>
              <div className="flex gap-2">
                <Dropdown
                  options={PHONE_PREFIX_OPTIONS}
                  value={formData.phonePrefix}
                  onChange={(value) => handleInputChange("phonePrefix", value)}
                  disabled={isLoading}
                  containerClassName="w-20"
                />
                <Input
                  type="tel"
                  placeholder="숫자만 입력해주세요.(예.12345678)*"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    handleInputChange("phone", value);
                  }}
                  disabled={isLoading}
                  error={errors.phone}
                  containerClassName="flex-1"
                />
              </div>
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
          </div>

          {/* 생성하기 버튼 */}
          <div className="flex justify-end mt-6">
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
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
        </div>
      </div>
    </div>
  );
};
