"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import FieldFormSection from "../../../../modules/field/components/field-form-section";
import FieldForm from "../../../../modules/field/components/field-form";
import { FieldFormData } from "@/modules/field/types";
import { fetchFieldDetail } from "@/modules/field/api/field-api";

const FieldDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [formData, setFormData] = useState<FieldFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchFieldDetail(id)
      .then((data) => {
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

  // 수정 버튼 클릭 시 edit로 이동
  const handleEdit = () => {
    router.push(`/fields/${id}/edit`);
  };

  return (
    <RoleGuard requiredRole="MASTER">
      <FieldFormSection
        title="필드 상세"
        isSaving={false}
        error={error}
        onCancel={() => router.push("/fields")}
        onSubmit={handleEdit}
        submitLabel="수정"
      >
        <FieldForm formData={formData} onInputChange={() => {}} />
      </FieldFormSection>
    </RoleGuard>
  );
};

export default FieldDetailPage;
