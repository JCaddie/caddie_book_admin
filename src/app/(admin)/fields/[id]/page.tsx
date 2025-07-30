"use client";

import React from "react";
import { useParams } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import { EditableField } from "@/shared/components/forms/editable-field";
import { useFieldDetail, useUpdateField } from "@/modules/field";
import { useGolfCoursesSimple } from "@/modules/golf-course/hooks/use-golf-courses-simple";
import { GolfCourseSimple } from "@/modules/golf-course/types/api";
import { FieldFormData, UpdateFieldRequest } from "@/modules/field/types";

const FieldDetailPage: React.FC = () => {
  const params = useParams();
  const fieldId = params.id as string;

  // API 데이터 fetch
  const { data: field, isLoading, isError, refetch } = useFieldDetail(fieldId);
  const updateFieldMutation = useUpdateField();
  const { data: golfCoursesResponse } = useGolfCoursesSimple();

  // 골프장 옵션 변환
  const golfCourseOptions =
    golfCoursesResponse?.data?.map((course: GolfCourseSimple) => ({
      value: course.id,
      label: course.name,
    })) || [];

  // 필드 업데이트 공통 함수
  const handleFieldUpdate = async (fieldKey: string, value: string) => {
    if (!field) return;

    try {
      const updateData: Partial<FieldFormData> = {};

      // 필드별로 적절한 데이터 타입으로 변환
      switch (fieldKey) {
        case "name":
          updateData.name = value;
          break;
        case "golf_course_id":
          updateData.golf_course_id = value;
          break;
        case "hole_count":
          updateData.hole_count = parseInt(value, 10);
          break;
        case "is_active":
          updateData.is_active = value === "true";
          break;
        case "description":
          updateData.description = value;
          break;
        default:
          throw new Error("알 수 없는 필드입니다.");
      }

      await updateFieldMutation.mutateAsync({
        id: fieldId,
        data: updateData as UpdateFieldRequest,
      });

      // 성공 시 데이터 새로고침
      await refetch();
    } catch (error) {
      console.error("필드 업데이트 실패:", error);
      throw error;
    }
  };

  // 활성여부 옵션
  const activeStatusOptions = [
    { value: "true", label: "활성" },
    { value: "false", label: "비활성" },
  ];

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
          </div>
          {/* 표 형태의 상세정보 */}
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="flex border-b border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">필드명</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <EditableField
                  label="필드명"
                  value={field.name}
                  hideLabel={true}
                  onSave={async (value) =>
                    await handleFieldUpdate("name", value)
                  }
                  placeholder="필드명을 입력하세요"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">골프장</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <EditableField
                  label="골프장"
                  value={field.golf_course_id}
                  hideLabel={true}
                  type="select"
                  options={golfCourseOptions}
                  onSave={async (value) =>
                    await handleFieldUpdate("golf_course_id", value)
                  }
                />
              </div>
            </div>
            <div className="flex border-b border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">홀 수</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <EditableField
                  label="홀 수"
                  value={String(field.hole_count)}
                  hideLabel={true}
                  type="number"
                  onSave={async (value) =>
                    await handleFieldUpdate("hole_count", value)
                  }
                  placeholder="홀 수를 입력하세요"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  활성여부
                </span>
              </div>
              <div className="flex-1 px-4 py-3">
                <EditableField
                  label="활성여부"
                  value={field.is_active ? "true" : "false"}
                  hideLabel={true}
                  type="select"
                  options={activeStatusOptions}
                  onSave={async (value) =>
                    await handleFieldUpdate("is_active", value)
                  }
                />
              </div>
            </div>
            <div className="flex border-b border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  상세설명
                </span>
              </div>
              <div className="flex-1 px-4 py-3">
                <EditableField
                  label="상세설명"
                  value={field.description}
                  hideLabel={true}
                  onSave={async (value) =>
                    await handleFieldUpdate("description", value)
                  }
                  placeholder="상세설명을 입력하세요"
                />
              </div>
            </div>
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
