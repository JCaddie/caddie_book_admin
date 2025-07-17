"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import FieldFormSection from "@/modules/field/components/field-form-section";
import FieldForm from "@/modules/field/components/field-form";
import { generateSampleFieldData } from "@/modules/field/utils";

const FieldDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  // 샘플 데이터에서 해당 id 찾기
  const fieldData = useMemo(() => {
    return generateSampleFieldData().find((f) => f.id === id);
  }, [id]);

  if (!fieldData) {
    return <div className="p-8 text-lg">존재하지 않는 필드입니다.</div>;
  }

  // 수정 버튼 클릭 시 edit로 이동
  const handleEdit = () => {
    router.push(`/fields/${id}/edit`);
  };

  return (
    <RoleGuard requiredRole="MASTER">
      <FieldFormSection
        title="필드 상세"
        isSaving={false}
        error={null}
        onCancel={() => router.push("/fields")}
        onSubmit={handleEdit}
        submitLabel="수정"
      >
        <FieldForm formData={fieldData} onInputChange={() => {}} />
      </FieldFormSection>
    </RoleGuard>
  );
};

export default FieldDetailPage;
