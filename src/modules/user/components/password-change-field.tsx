"use client";

import React, { useState } from "react";
import { Check, Edit2, X } from "lucide-react";
import { Button, Input } from "@/shared/components/ui";

export interface PasswordChangeFieldProps {
  isLoading?: boolean;
  onSave: (passwordData: {
    password: string;
    password_confirm: string;
  }) => Promise<void>;
  disabled?: boolean;
  hideLabel?: boolean;
}

export const PasswordChangeField: React.FC<PasswordChangeFieldProps> = ({
  isLoading = false,
  onSave,
  disabled = false,
  hideLabel = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [passwords, setPasswords] = useState({
    password: "",
    password_confirm: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    password_confirm: "",
  });
  const [apiError, setApiError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setPasswords({ password: "", password_confirm: "" });
    setErrors({ password: "", password_confirm: "" });
    setApiError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setPasswords({ password: "", password_confirm: "" });
    setErrors({ password: "", password_confirm: "" });
    setApiError("");
    setIsEditing(false);
  };

  const validatePasswords = (): boolean => {
    const newErrors = { password: "", password_confirm: "" };
    let isValid = true;

    // 비밀번호 검증
    if (!passwords.password.trim()) {
      newErrors.password = "새 비밀번호를 입력해주세요.";
      isValid = false;
    } else if (passwords.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
      isValid = false;
    }

    // 비밀번호 확인 검증
    if (!passwords.password_confirm.trim()) {
      newErrors.password_confirm = "비밀번호 확인을 입력해주세요.";
      isValid = false;
    } else if (passwords.password !== passwords.password_confirm) {
      newErrors.password_confirm = "비밀번호가 일치하지 않습니다.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validatePasswords()) return;

    setIsSaving(true);
    setApiError("");
    try {
      await onSave({
        password: passwords.password,
        password_confirm: passwords.password_confirm,
      });
      setIsEditing(false);
      setPasswords({ password: "", password_confirm: "" });
      setApiError("");
    } catch (error) {
      console.error("비밀번호 변경 중 오류:", error);
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
        setApiError("비밀번호 변경 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = (
    field: "password" | "password_confirm",
    value: string
  ) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-2">
      {!hideLabel && (
        <label className="block text-sm font-medium text-gray-700">
          비밀번호
        </label>
      )}

      {isEditing ? (
        <div className="space-y-4">
          {/* 새 비밀번호 입력 */}
          <div>
            <Input
              type="password"
              value={passwords.password}
              onChange={(e) => handlePasswordChange("password", e.target.value)}
              placeholder="새 비밀번호를 입력해주세요"
              disabled={isSaving}
              error={errors.password}
              containerClassName="w-full"
            />
          </div>

          {/* 비밀번호 확인 입력 */}
          <div>
            <Input
              type="password"
              value={passwords.password_confirm}
              onChange={(e) =>
                handlePasswordChange("password_confirm", e.target.value)
              }
              placeholder="비밀번호를 다시 입력해주세요"
              disabled={isSaving}
              error={errors.password_confirm}
              containerClassName="w-full"
            />
          </div>

          {/* API 에러 메시지 */}
          {apiError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{apiError}</p>
            </div>
          )}

          {/* 저장/취소 버튼 */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={
                isSaving || !passwords.password || !passwords.password_confirm
              }
              loading={isSaving}
            >
              <Check size={16} className="mr-2" />
              변경
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X size={16} className="mr-2" />
              취소
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between group">
          <div className="flex-1">
            <span className="text-gray-900">••••••••</span>
          </div>

          {!disabled && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEdit}
              disabled={isLoading}
              className="opacity-0 group-hover:opacity-100 transition-opacity px-3"
            >
              <Edit2 size={16} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
