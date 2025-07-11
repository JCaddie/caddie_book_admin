"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import {
  Badge,
  Button,
  ConfirmationModal,
  TextField,
} from "@/shared/components/ui";
import { useDocumentTitle } from "@/shared/hooks";
import { useAuth } from "@/shared/hooks/use-auth";
import { mockUsers } from "@/modules/user/utils";

// 상세 페이지에서 사용할 확장된 사용자 타입
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  role: "MASTER" | "ADMIN";
  username?: string;
  phone?: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const { user: authUser } = useAuth();

  const isMyInfo = userId === "me";
  useDocumentTitle({ title: isMyInfo ? "내 정보" : "계정 정보" });

  // 사용자 정보 조회
  const getUserInfo = (): ExtendedUser => {
    if (isMyInfo && authUser) {
      // 내 정보인 경우 현재 로그인한 사용자 정보 사용
      return {
        ...authUser,
        username: "admin", // 실제로는 API에서 가져와야 함
        phone: "010-1234-5678", // 실제로는 API에서 가져와야 함
      };
    } else {
      // 다른 사용자 정보인 경우 mockUsers에서 조회
      const foundUser = mockUsers.find((u) => u.id === userId);
      return foundUser
        ? {
            ...foundUser,
            username: foundUser.username || "admin",
            phone: foundUser.phone || "010-0000-0000",
          }
        : {
            id: userId,
            username: "admin",
            name: "김관리",
            phone: "010-1234-5678",
            email: "adminkim@admin.com",
            role: "MASTER" as const,
          };
    }
  };

  const user = getUserInfo();

  // 편집 상태 관리
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    password: "",
    phone: user.phone || "",
    email: user.email,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleSave = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setIsLoading(true);
    try {
      // 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(
        `${editingField} 수정:`,
        editValues[editingField as keyof typeof editValues]
      );
      setEditingField(null);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("수정 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({
      password: "",
      phone: user.phone || "",
      email: user.email,
    });
  };

  const renderField = (
    label: string,
    value: string,
    field?: string,
    editable = false
  ) => {
    const isEditing = editingField === field;
    const isPassword = field === "password";

    return (
      <div className="flex items-stretch border-b border-gray-300 last:border-b-0 min-h-[64px]">
        {/* 라벨 */}
        <div className="w-32 bg-gray-50 px-4 py-4 border-r border-gray-300 flex items-center justify-center">
          <span className="text-sm font-bold text-black text-center">
            {label}
          </span>
        </div>

        {/* 값 영역 */}
        <div className="flex-1 flex items-center justify-between px-4 py-4">
          {isEditing ? (
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-1 max-w-80">
                <TextField
                  type={isPassword ? "password" : "text"}
                  value={editValues[field as keyof typeof editValues] || ""}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      [field!]: e.target.value,
                    }))
                  }
                  placeholder={isPassword ? "새 비밀번호 입력" : ""}
                  showVisibilityToggle={isPassword}
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="text-gray-600"
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                  loading={isLoading}
                  style={{
                    backgroundColor: "#FEB912",
                  }}
                >
                  저장
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center">
                {field === "role" ? (
                  <Badge
                    variant={user.role === "MASTER" ? "primary" : "secondary"}
                    className="font-medium"
                  >
                    {user.role === "MASTER" ? "마스터" : "관리자"}
                  </Badge>
                ) : (
                  <span className="text-sm text-black">
                    {isPassword ? "*************" : value}
                  </span>
                )}
              </div>
              {editable && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEdit(field!)}
                  style={{
                    backgroundColor: "#FEB912",
                  }}
                >
                  변경
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-10">
      <AdminPageHeader title="계정 정보" />

      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="border border-gray-300 rounded-md overflow-hidden">
            {renderField("아이디", user.username || "")}
            {renderField("비밀번호", "*************", "password", true)}
            {renderField(
              "권한",
              user.role === "MASTER" ? "마스터" : "관리자",
              "role"
            )}
            {renderField("이름", user.name)}
            {renderField("연락처", user.phone || "", "phone", true)}
            {renderField("이메일", user.email, "email", true)}
          </div>
        </div>
      </div>

      {/* 저장 확인 모달 */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title="변경사항 저장"
        message={`${
          editingField === "password"
            ? "비밀번호"
            : editingField === "phone"
            ? "연락처"
            : "이메일"
        }을(를) 변경하시겠습니까?`}
        confirmText="저장"
        cancelText="취소"
        isLoading={isLoading}
      />
    </div>
  );
}
