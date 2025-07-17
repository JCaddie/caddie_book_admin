"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import FieldFormSection from "@/modules/field/components/field-form-section";
import FieldForm from "@/modules/field/components/field-form";
import { FieldFormData } from "@/modules/field/types";
import { generateSampleFieldData } from "@/modules/field/utils";

// 샘플 API (실제 구현 시 교체)
const updateField = async (id: string, data: FieldFormData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ...data, id };
};

const FieldEditPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  // 샘플 데이터에서 해당 id 찾기
  const originData = useMemo(() => {
    return generateSampleFieldData().find((f) => f.id === id);
  }, [id]);

  const [formData, setFormData] = useState<FieldFormData | null>(
    originData ?? null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!formData) {
    return <div className="p-8 text-lg">존재하지 않는 필드입니다.</div>;
  }

  // 입력값 변경 핸들러
  const handleInputChange = (
    field: keyof FieldFormData,
    value: string | number
  ) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // 취소 버튼
  const handleCancel = () => {
    router.push(`/fields/${id}`);
  };

  // 저장 버튼
  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await updateField(id, formData);
      router.push(`/fields/${id}`);
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <RoleGuard requiredRole="MASTER">
      <FieldFormSection
        title="필드 수정"
        isSaving={isSaving}
        error={error}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        submitLabel="저장"
      >
        <FieldForm formData={formData} onInputChange={handleInputChange} />
      </FieldFormSection>
    </RoleGuard>
  );
};

export default FieldEditPage;
