import React from "react";
import TextField from "@/shared/components/ui/text-field";
import Dropdown from "@/shared/components/ui/dropdown";
import { FieldFormData, FieldStatus } from "../types";
import { FIELD_CONSTANTS } from "../constants";

interface FieldFormProps {
  formData: FieldFormData;
  onInputChange: (field: keyof FieldFormData, value: string | number) => void;
  statusOptions?: { label: string; value: FieldStatus }[];
  statusLoading?: boolean;
}

const FieldForm: React.FC<FieldFormProps> = ({
  formData,
  onInputChange,
  statusOptions = [
    {
      label: FIELD_CONSTANTS.STATUS.OPERATING,
      value: FIELD_CONSTANTS.STATUS.OPERATING,
    },
    {
      label: FIELD_CONSTANTS.STATUS.MAINTENANCE,
      value: FIELD_CONSTANTS.STATUS.MAINTENANCE,
    },
  ],
  statusLoading = false,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <TextField
          label="필드명"
          value={formData.fieldName}
          onChange={(e) => onInputChange("fieldName", e.target.value)}
          required
        />
        <TextField
          label="골프장"
          value={formData.golfCourse}
          onChange={(e) => onInputChange("golfCourse", e.target.value)}
          required
        />
        <TextField
          label="홀수"
          type="number"
          value={formData.capacity}
          onChange={(e) => onInputChange("capacity", Number(e.target.value))}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            운영현황
          </label>
          <Dropdown
            options={statusOptions.map((opt) => ({
              label: opt.label,
              value: opt.value,
            }))}
            value={formData.status}
            onChange={(value) => onInputChange("status", value)}
            placeholder="운영현황 선택"
            disabled={statusLoading}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          상세설명
        </label>
        <textarea
          className="w-full h-28 px-3 border rounded-md text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 border-gray-300"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="상세설명을 입력하세요."
        />
      </div>
    </div>
  );
};

export default FieldForm;
