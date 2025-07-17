"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import FieldForm from "@/modules/field/components/field-form";
import { FieldFormData } from "@/modules/field/types";
import { useQueryClient } from "@tanstack/react-query";
import { FIELD_CONSTANTS } from "@/modules/field/constants";
import FieldFormSection from "../../../../modules/field/components/field-form-section";

// 필드 생성 API (예시)
const createField = async (data: FieldFormData) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${API_BASE_URL}/api/v1/fields/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("필드 등록에 실패했습니다.");
  return res.json();
};

const EMPTY_FORM: FieldFormData = {
  fieldName: "",
  golfCourse: "",
  capacity: 0,
  cart: "",
  status: FIELD_CONSTANTS.STATUS.OPERATING,
  description: "",
};

const FieldCreatePage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FieldFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // 입력값 변경 핸들러
  const handleInputChange = (
    field: keyof FieldFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 취소 버튼
  const handleCancel = () => {
    router.push("/fields");
  };

  // 등록 버튼
  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await createField(formData);
      await queryClient.invalidateQueries({ queryKey: ["fields"] });
      router.push("/fields");
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <RoleGuard requiredRole="MASTER">
      <FieldFormSection
        title="필드 등록"
        isSaving={isSaving}
        error={error}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        submitLabel="등록"
      >
        <FieldForm formData={formData} onInputChange={handleInputChange} />
      </FieldFormSection>
    </RoleGuard>
  );
};

export default FieldCreatePage;
