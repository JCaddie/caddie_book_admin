"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import { Button } from "@/shared/components/ui";
import { useFieldDetail } from "@/modules/field";

const FieldDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const fieldId = params.id as string;

  // API 데이터 fetch
  const { data: field, isLoading, isError } = useFieldDetail(fieldId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg">
        로딩 중...
      </div>
    );
  }
  if (isError || !field) {
    return (
      <div className="flex justify-center items-center h-96 text-lg text-red-500">
        상세 정보를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <RoleGuard requiredRoles={["MASTER", "ADMIN"]}>
      <div className="bg-white rounded-xl p-8 space-y-8">
        {/* 상단 헤더 */}
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-gray-900">{field.name}</h1>
        </div>

        {/* 상세정보 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">상세정보</h2>
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push(`/fields/${fieldId}/edit`)}
            >
              수정
            </Button>
          </div>
          {/* 표 형태의 상세정보 */}
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="flex border-b border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">필드명</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <span className="text-sm text-gray-900">{field.name}</span>
              </div>
            </div>
            <div className="flex border-b border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">골프장</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <span className="text-sm text-gray-900">
                  {field.golf_course_name}
                </span>
              </div>
            </div>
            <div className="flex border-b border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">홀 수</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <span className="text-sm text-gray-900">
                  {field.hole_count}
                </span>
              </div>
            </div>
            <div className="flex border-b border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  활성여부
                </span>
              </div>
              <div className="flex-1 px-4 py-3">
                <span className="text-sm text-gray-900">
                  {field.is_active ? "활성" : "비활성"}
                </span>
              </div>
            </div>
            {field.description && (
              <div className="flex">
                <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">
                    상세설명
                  </span>
                </div>
                <div className="flex-1 px-4 py-3">
                  <span className="text-sm text-gray-900">
                    {field.description}
                  </span>
                </div>
              </div>
            )}
            <div className="flex border-t border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">생성일</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <span className="text-sm text-gray-900">
                  {formatDate(field.created_at)}
                </span>
              </div>
            </div>
            <div className="flex">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">수정일</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <span className="text-sm text-gray-900">
                  {formatDate(field.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

// 날짜 포맷 함수 추가 (YYYY-MM-DD HH:mm)
function formatDate(dateString?: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export default FieldDetailPage;
