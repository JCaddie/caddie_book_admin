"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import FieldFormSection from "../../../../modules/field/components/field-form-section";
import FieldForm from "../../../../modules/field/components/field-form";
import { FieldFormData } from "@/modules/field/types";
import { useUpdateField } from "@/modules/field/hooks";
import { fetchFieldDetail } from "@/modules/field/api/field-api";

const FieldEditPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [formData, setFormData] = useState<FieldFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const updateFieldMutation = useUpdateField();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchFieldDetail(id)
      .then((data) => {
        // id, no, createdAt 등은 제외하고 폼 데이터만 추출
        const { fieldName, golfCourse, capacity, cart, status, description } =
          data;
        setFormData({
          fieldName,
          golfCourse,
          capacity,
          cart,
          status,
          description,
        });
      })
      .catch(() => setError("필드 정보를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-lg">로딩 중...</div>;
  if (!formData)
    return <div className="p-8 text-lg">존재하지 않는 필드입니다.</div>;

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
    setError(null);
    try {
      await updateFieldMutation.mutateAsync({ id, data: formData });
      router.push(`/fields/${id}`);
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <RoleGuard requiredRole="MASTER">
      <FieldFormSection
        title="필드 수정"
        isSaving={updateFieldMutation.isPending}
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
