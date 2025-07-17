"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import { Button } from "@/shared/components/ui";
import { GolfCourseForm } from "@/shared/components/golf-course";
import { EditableGolfCourse } from "@/modules/golf-course/types/golf-course";
import { PAGE_TITLES, useDocumentTitle } from "@/shared/hooks";
import { updateGolfCourse } from "@/modules/golf-course/api/golf-course-api";
import { useGolfCourseDetail } from "@/modules/golf-course/hooks/use-golf-course-detail";
import { useQueryClient } from "@tanstack/react-query";
import { useContractStatusOptions } from "@/shared/hooks/use-contract-status-options";

// PATCH 요청용 변환 함수
function toApiPayload(formData: EditableGolfCourse) {
  return {
    name: formData.name,
    region: formData.region,
    address: formData.address,
    contract_status: formData.contractStatus,
    contract_start_date: formData.contractStartDate,
    contract_end_date: formData.contractEndDate,
    phone: formData.phone,
    ceo_name: formData.representative.name,
    manager_name: formData.manager.name,
    manager_contact: formData.manager.contact,
    manager_email: formData.manager.email,
  };
}

const GolfCourseEditPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const golfCourseId = params.id as string;

  // 페이지 타이틀 설정
  useDocumentTitle({ title: PAGE_TITLES.GOLF_COURSE_EDIT });

  // 상세 데이터 패칭
  const {
    data: detail,
    isLoading,
    isError,
  } = useGolfCourseDetail(golfCourseId);

  // formData 상태
  const [formData, setFormData] = useState<EditableGolfCourse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { options: contractStatusOptions, loading: contractStatusLoading } =
    useContractStatusOptions();

  // 상세 데이터 받아오면 formData 초기화
  React.useEffect(() => {
    if (detail) {
      setFormData({
        id: detail.id,
        name: detail.name,
        region: detail.region,
        address: detail.address,
        contractStatus: detail.contract_status,
        contractStartDate: detail.contract_start_date,
        contractEndDate: detail.contract_end_date,
        phone: detail.phone,
        representative: {
          name: detail.ceo_name,
          contact: "",
          email: "",
        },
        manager: {
          name: detail.manager_name,
          contact: detail.manager_contact,
          email: detail.manager_email,
        },
      });
    }
  }, [detail]);

  // 입력 필드 변경 핸들러
  const handleInputChange = (field: string, value: string) => {
    if (!formData) return;
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              [parent]: {
                ...prev[
                  parent as keyof Pick<
                    EditableGolfCourse,
                    "representative" | "manager"
                  >
                ],
                [child]: value,
              },
            }
          : prev
      );
    } else {
      setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    router.push(`/golf-courses/${golfCourseId}`);
  };

  // 완료 버튼 핸들러
  const handleSubmit = async () => {
    if (!formData) return;
    setIsSaving(true);
    setError(null);
    try {
      await updateGolfCourse(golfCourseId, toApiPayload(formData));
      // 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: ["golf-course-detail", golfCourseId],
      });
      await queryClient.invalidateQueries({ queryKey: ["golf-courses"] });
      router.push(`/golf-courses/${golfCourseId}`);
    } catch (e: unknown) {
      if (e && typeof e === "object" && "message" in e) {
        setError(
          (e as { message?: string }).message || "저장 중 오류가 발생했습니다."
        );
      } else {
        setError("저장 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center items-center h-96 text-lg">
        로딩 중...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center h-96 text-lg text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <RoleGuard requiredRole="MASTER">
      <div className="bg-white rounded-xl p-8 space-y-8">
        {/* 상단 헤더 - 뒤로가기 버튼 제거 */}
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-gray-900">{formData.name}</h1>
        </div>

        {/* 상세정보 편집 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">상세정보</h2>

            {/* 취소/완료 버튼 */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={handleCancel}
                className="border-[#FEB912] text-[#FEB912] hover:bg-[#FEB912] hover:text-white"
                disabled={isSaving}
              >
                취소
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? "저장 중..." : "완료"}
              </Button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

          <GolfCourseForm
            formData={formData}
            onInputChange={handleInputChange}
            contractStatusOptions={contractStatusOptions}
            contractStatusLoading={contractStatusLoading}
          />
        </div>
      </div>
    </RoleGuard>
  );
};

export default GolfCourseEditPage;
