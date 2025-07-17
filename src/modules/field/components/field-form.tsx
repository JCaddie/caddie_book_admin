import React from "react";
import TextField from "@/shared/components/ui/text-field";
import Dropdown from "@/shared/components/ui/dropdown";
import { FieldFormData } from "../types";
import { useGolfCourseOptions } from "../hooks/use-golf-course-options";

interface FieldFormProps {
  formData: FieldFormData;
  onInputChange: (
    field: keyof FieldFormData,
    value: string | number | boolean
  ) => void;
}

const isActiveOptions = [
  { label: "활성", value: "true" },
  { label: "비활성", value: "false" },
];

const FieldForm: React.FC<FieldFormProps> = ({ formData, onInputChange }) => {
  const {
    options: golfCourseOptions,
    isLoading: golfCourseLoading,
    isError: golfCourseError,
  } = useGolfCourseOptions();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            골프장
          </label>
          <Dropdown
            options={golfCourseOptions}
            value={formData.golf_course_id}
            onChange={(value) => onInputChange("golf_course_id", value)}
            placeholder={
              golfCourseLoading
                ? "로딩 중..."
                : golfCourseError
                ? "불러오기 실패"
                : "골프장 선택"
            }
            disabled={golfCourseLoading}
          />
        </div>
        <TextField
          label="필드명"
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          required
        />
        <TextField
          label="홀 수"
          type="number"
          value={formData.hole_count}
          onChange={(e) => onInputChange("hole_count", Number(e.target.value))}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            활성 여부
          </label>
          <Dropdown
            options={isActiveOptions}
            value={String(formData.is_active)}
            onChange={(value) => onInputChange("is_active", value === "true")}
            placeholder="활성 여부 선택"
          />
        </div>
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-800 mb-1">
          상세설명
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          rows={4}
          value={formData.description || ""}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="상세설명을 입력하세요"
        />
      </div>
    </div>
  );
};

export default FieldForm;
