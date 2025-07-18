"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import FieldForm from "../../../../modules/field/components/field-form";
import { FieldFormData } from "@/modules/field/types";
import FieldFormSection from "../../../../modules/field/components/field-form-section";
import { useCreateField } from "@/modules/field/hooks";
import { useAuth } from "@/shared/hooks";

const EMPTY_FORM: FieldFormData = {
  name: "",
  golf_course_id: "",
  hole_count: 0,
  is_active: false,
  description: "",
};

const FieldCreatePage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FieldFormData>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const createFieldMutation = useCreateField();

  // ADMIN 권한일 때 자동으로 골프장 ID 설정
  useEffect(() => {
    if (user?.role === "ADMIN" && user.golfCourseId) {
      setFormData((prev) => ({
        ...prev,
        golf_course_id: user.golfCourseId!,
      }));
    }
  }, [user]);

  // 입력값 변경 핸들러
  const handleInputChange = (
    field: keyof FieldFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 취소 버튼
  const handleCancel = () => {
    router.push("/fields");
  };

  // 등록 버튼
  const handleSubmit = async () => {
    setError(null);
    try {
      await createFieldMutation.mutateAsync(formData);
      router.push("/fields");
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <RoleGuard requiredRoles={["MASTER", "ADMIN"]}>
      <FieldFormSection
        title="필드 등록"
        isSaving={createFieldMutation.isPending}
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
