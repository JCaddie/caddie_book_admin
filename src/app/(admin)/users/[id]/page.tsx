"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import { Badge } from "@/shared/components/ui";
import { useDocumentTitle } from "@/shared/hooks";
import { useUpdateUserPassword, useUserDetail } from "@/modules/user/hooks";
import {
  EditableDropdownField,
  EditableField,
  PasswordChangeField,
} from "@/modules/user/components";
import { useGolfCoursesSimple } from "@/modules/golf-course/hooks/use-golf-courses-simple";

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  useDocumentTitle({ title: "계정 정보" });

  // 사용자 정보 조회
  const { data: user, isLoading, error } = useUserDetail(userId);

  // 골프장 목록 조회
  const { data: golfCoursesData, isLoading: golfCoursesLoading } =
    useGolfCoursesSimple();

  // Mutation 훅들
  // const updateUserMutation = useUpdateUser(); // 현재 사용하지 않음
  const updatePasswordMutation = useUpdateUserPassword();

  // 개별 필드 저장 핸들러들 (임시 주석 처리)
  // const handleSaveName = async (_value: string) => {
  //   await updateUserMutation.mutateAsync();
  // };

  // const handleSavePhone = async (_value: string) => {
  //   await updateUserMutation.mutateAsync();
  // };

  // const handleSaveEmail = async (_value: string) => {
  //   await updateUserMutation.mutateAsync();
  // };

  // const handleSavePassword = async (_passwordData: {
  //   password: string;
  //   password_confirm: string;
  // }) => {
  //   await updatePasswordMutation.mutateAsync();
  // };

  // const handleSaveGolfCourse = async (_golfCourseId: string) => {
  //   await updateUserMutation.mutateAsync();
  // };

  // 골프장 옵션 변환
  const golfCourseOptions =
    golfCoursesData?.data?.map((course) => ({
      value: course.id,
      label: course.name,
    })) || [];

  // 로딩 및 에러 처리
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white rounded-xl p-8">
        <div className="text-center">
          <p className="text-red-600">사용자 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const renderField = (label: string, content: React.ReactNode) => {
    return (
      <div className="flex items-stretch border-b border-gray-300 last:border-b-0 min-h-[64px]">
        {/* 라벨 */}
        <div className="w-32 bg-gray-50 px-4 py-4 border-r border-gray-300 flex items-center justify-center">
          <span className="text-sm font-bold text-black text-center">
            {label}
          </span>
        </div>

        {/* 값 영역 */}
        <div className="flex-1 flex items-center px-4 py-4">{content}</div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-10">
      <AdminPageHeader title="계정 정보" />

      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="border border-gray-300 rounded-md overflow-hidden">
            {renderField(
              "아이디",
              <span className="text-sm text-black">{user.email}</span>
            )}

            {renderField(
              "비밀번호",
              <div className="w-full">
                <PasswordChangeField
                  onSave={async () => {}}
                  isLoading={updatePasswordMutation.isPending}
                  hideLabel={true}
                />
              </div>
            )}

            {renderField(
              "권한",
              <Badge
                variant={user.role === "MASTER" ? "yellow" : "gray"}
                className="font-medium"
              >
                {user.role === "MASTER" ? "마스터" : "관리자"}
              </Badge>
            )}

            {renderField(
              "이름",
              <div className="w-full">
                <EditableField
                  label=""
                  value={user.name}
                  onSave={async () => {}}
                  placeholder="이름을 입력하세요"
                  hideLabel={true}
                />
              </div>
            )}

            {renderField(
              "연락처",
              <div className="w-full">
                <EditableField
                  label=""
                  value={user.phone || ""}
                  type="phone"
                  onSave={async () => {}}
                  placeholder="전화번호를 입력하세요"
                  hideLabel={true}
                />
              </div>
            )}

            {renderField(
              "이메일",
              <div className="w-full">
                <EditableField
                  label=""
                  value={user.email}
                  type="email"
                  onSave={async () => {}}
                  placeholder="이메일을 입력하세요"
                  hideLabel={true}
                />
              </div>
            )}

            {renderField(
              "골프장",
              <div className="w-full">
                <EditableDropdownField
                  label=""
                  value={user.golf_course_id || ""}
                  options={golfCourseOptions}
                  onSave={async () => {}}
                  placeholder="골프장을 선택하세요"
                  optionsLoading={golfCoursesLoading}
                  hideLabel={true}
                />
              </div>
            )}

            {renderField(
              "생성일",
              <span className="text-sm text-black">
                {user.created_at
                  ? new Date(user.created_at).toLocaleString("ko-KR")
                  : "-"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
