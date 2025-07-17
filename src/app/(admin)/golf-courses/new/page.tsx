"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import { Button } from "@/shared/components/ui";
import { GolfCourseForm } from "@/shared/components/golf-course";
import { EditableGolfCourse } from "@/modules/golf-course/types/golf-course";
import { PAGE_TITLES, useDocumentTitle } from "@/shared/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useGolfCourseOptions } from "@/shared/hooks/use-golf-course-options";

// 골프장 생성 API 직접 구현 (POST)
const createGolfCourse = async (data: EditableGolfCourse) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${API_BASE_URL}/api/v1/golf-courses/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("골프장 등록에 실패했습니다.");
  return res.json();
};

const EMPTY_FORM: EditableGolfCourse = {
  id: "",
  name: "",
  region: "",
  address: "",
  contractStatus: "",
  contractStartDate: "",
  contractEndDate: "",
  phone: "",
  representative: { name: "", contact: "", email: "" },
  manager: { name: "", contact: "", email: "" },
};

const GolfCourseCreatePage: React.FC = () => {
  const router = useRouter();
  useDocumentTitle({ title: PAGE_TITLES.GOLF_COURSE_EDIT });

  const [formData, setFormData] = useState<EditableGolfCourse>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { contractOptions, loading: optionsLoading } = useGolfCourseOptions();

  const handleInputChange = (field: string, value: string) => {
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

  const handleCancel = () => {
    router.push("/golf-courses");
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await createGolfCourse(formData);
      await queryClient.invalidateQueries({ queryKey: ["golf-courses"] });
      router.push("/golf-courses");
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <RoleGuard requiredRole="MASTER">
      <div className="bg-white rounded-xl p-8 space-y-8">
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-gray-900">골프장 등록</h1>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">상세정보</h2>
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
                {isSaving ? "저장 중..." : "등록"}
              </Button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <GolfCourseForm
            formData={formData}
            onInputChange={handleInputChange}
            contractStatusOptions={contractOptions}
            contractStatusLoading={optionsLoading}
          />
        </div>
      </div>
    </RoleGuard>
  );
};

export default GolfCourseCreatePage;
