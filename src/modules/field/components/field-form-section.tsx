import React, { ReactNode } from "react";
import { Button } from "@/shared/components/ui";

interface FieldFormSectionProps {
  title: string;
  isSaving: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  children: ReactNode;
}

const FieldFormSection: React.FC<FieldFormSectionProps> = ({
  title,
  isSaving,
  error,
  onCancel,
  onSubmit,
  submitLabel,
  children,
}) => {
  return (
    <div className="bg-white rounded-xl p-8 space-y-8">
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">상세정보</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={onCancel}
              className="border-[#FEB912] text-[#FEB912] hover:bg-[#FEB912] hover:text-white"
              disabled={isSaving}
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={onSubmit}
              disabled={isSaving}
            >
              {isSaving ? "저장 중..." : submitLabel}
            </Button>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {children}
      </div>
    </div>
  );
};

export default FieldFormSection;
