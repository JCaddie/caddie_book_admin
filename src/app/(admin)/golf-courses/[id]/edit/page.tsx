"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import { Button } from "@/shared/components/ui";
import { GolfCourseEditForm } from "@/shared/components/golf-course";
import { EditableGolfCourse } from "@/shared/types/golf-course";
import { PAGE_TITLES, useDocumentTitle } from "@/shared/hooks";

const GolfCourseEditPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const golfCourseId = params.id as string;

  // 페이지 타이틀 설정
  useDocumentTitle({ title: PAGE_TITLES.GOLF_COURSE_EDIT });

  // 편집 가능한 골프장 데이터 상태
  const [formData, setFormData] = useState<EditableGolfCourse>({
    id: golfCourseId,
    name: "제이캐디 아카데미",
    address:
      "충청북도 청주시 청원구 오창읍 양청송대길 10, 406호(청주미래누리터(지식산업센터))",
    contractStatus: "계약",
    contractStartDate: "2025.05.26",
    contractEndDate: "2025.11.26",
    phone: "02 - 123 - 4567",
    representative: {
      name: "홍길동",
      contact: "010-1234-5678",
      email: "cs@daangnservice.com",
    },
    manager: {
      name: "감강찬",
      contact: "010-1234-5678",
      email: "cs@daangnservice.com",
    },
  });

  // 입력 필드 변경 핸들러
  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
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
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    router.push(`/golf-courses/${golfCourseId}`);
  };

  // 완료 버튼 핸들러
  const handleSubmit = () => {
    // 실제로는 API 호출하여 저장
    // TODO: API 호출로 데이터 저장

    // 저장 후 상세 페이지로 이동
    router.push(`/golf-courses/${golfCourseId}`);
  };

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
              >
                취소
              </Button>
              <Button variant="primary" size="md" onClick={handleSubmit}>
                완료
              </Button>
            </div>
          </div>

          <GolfCourseEditForm
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>
      </div>
    </RoleGuard>
  );
};

export default GolfCourseEditPage;
