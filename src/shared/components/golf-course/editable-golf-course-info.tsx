"use client";

import React, { useState } from "react";
import { Check, Edit3, X } from "lucide-react";
import { Button, Dropdown, Input } from "@/shared/components/ui";
import { GolfCourseDetail } from "@/modules/golf-course/types/golf-course";
import { updateGolfCourse } from "@/modules/golf-course/api/golf-course-api";
import { useConstantOptions, useConstantValue } from "@/shared/hooks";
import { ConstantCategory } from "@/shared/types/constants";
import { useQueryClient } from "@tanstack/react-query";

interface EditableGolfCourseInfoProps {
  golfCourse: GolfCourseDetail;
}

interface EditingField {
  name: string;
  type: "text" | "dropdown";
  value: string;
  originalValue: string;
  constantCategory?: ConstantCategory;
}

const EditableGolfCourseInfo: React.FC<EditableGolfCourseInfoProps> = ({
  golfCourse,
}) => {
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { getValueById } = useConstantValue();

  // Constants 옵션들
  const { options: contractOptions } = useConstantOptions("contract_statuses");
  const { options: membershipOptions } = useConstantOptions("membership_types");
  const { options: isActiveOptions } = useConstantOptions("is_active_choices");

  // 편집 시작
  const startEditing = (
    fieldName: string,
    fieldType: "text" | "dropdown",
    currentValue: string,
    constantCategory?: ConstantCategory
  ) => {
    setEditingField({
      name: fieldName,
      type: fieldType,
      value: currentValue,
      originalValue: currentValue,
      constantCategory,
    });
    setError(null);
  };

  // 편집 취소
  const cancelEditing = () => {
    setEditingField(null);
    setError(null);
  };

  // 값 변경
  const handleValueChange = (value: string) => {
    if (editingField) {
      setEditingField({ ...editingField, value });
    }
  };

  // 저장
  const saveField = async () => {
    if (!editingField || editingField.value === editingField.originalValue) {
      setEditingField(null);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // API 필드명 매핑
      const apiFieldMap: Record<string, string> = {
        name: "name",
        region: "region",
        address: "address",
        phone: "phone",
        ceo_name: "ceo_name",
        manager_name: "manager_name",
        manager_contact: "manager_contact",
        manager_email: "manager_email",
        contract_status: "contract_status",
        membership_type: "membership_type",
        is_active: "is_active",
      };

      const apiField = apiFieldMap[editingField.name];
      if (!apiField) {
        throw new Error("지원하지 않는 필드입니다.");
      }

      // 값 처리 (boolean 변환)
      let processedValue: string | boolean = editingField.value;
      if (editingField.name === "is_active") {
        processedValue = editingField.value === "true";
      }

      await updateGolfCourse(golfCourse.id, {
        [apiField]: processedValue,
      });

      // 캐시 업데이트
      await queryClient.invalidateQueries({
        queryKey: ["golf-course-detail", golfCourse.id],
      });

      setEditingField(null);
    } catch (error) {
      console.error("저장 중 오류:", error);
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 필드 렌더링
  const renderField = (
    label: string,
    fieldName: string,
    value: string | null,
    type: "text" | "dropdown" = "text",
    constantCategory?: ConstantCategory
  ) => {
    const isEditing = editingField?.name === fieldName;
    const displayValue = value || "";

    // 상수값인 경우 표시용 라벨 가져오기
    let displayLabel = displayValue;
    if (constantCategory && displayValue) {
      displayLabel =
        getValueById(constantCategory, displayValue) || displayValue;
    }

    // 드롭다운 옵션 가져오기
    let options: { label: string; value: string }[] = [];
    if (type === "dropdown" && constantCategory) {
      switch (constantCategory) {
        case "contract_statuses":
          options = contractOptions.map((opt) => ({
            ...opt,
            value: String(opt.value),
          }));
          break;
        case "membership_types":
          options = membershipOptions.map((opt) => ({
            ...opt,
            value: String(opt.value),
          }));
          break;
        case "is_active_choices":
          options = isActiveOptions.map((opt) => ({
            ...opt,
            value: String(opt.value),
          }));
          break;
      }
    }

    return (
      <div className="flex border-b border-gray-200 last:border-b-0">
        <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900">{label}</span>
        </div>
        <div className="flex-1 px-4 py-3 flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              {type === "text" ? (
                <Input
                  value={editingField?.value || ""}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
              ) : (
                <Dropdown
                  options={options}
                  value={editingField?.value || ""}
                  onChange={handleValueChange}
                  containerClassName="flex-1"
                  placeholder={`${label} 선택`}
                />
              )}

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={saveField}
                  disabled={isSaving}
                  className="p-1 h-8 w-8"
                >
                  <Check size={16} className="text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="p-1 h-8 w-8"
                >
                  <X size={16} className="text-red-600" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-gray-900">
                {displayLabel || "-"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  startEditing(fieldName, type, displayValue, constantCategory)
                }
                className="p-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit3 size={16} className="text-gray-400" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* 기본 정보 */}
      <div className="border border-gray-200 rounded-md overflow-hidden group">
        {renderField("골프장명", "name", golfCourse.name)}
        {renderField("지역", "region", golfCourse.region)}
        {renderField("주소", "address", golfCourse.address)}
        {renderField(
          "계약 현황",
          "contract_status",
          golfCourse.contract_status,
          "dropdown",
          "contract_statuses"
        )}
        {renderField(
          "회원제 구분",
          "membership_type",
          golfCourse.membership_type,
          "dropdown",
          "membership_types"
        )}
        {renderField("대표번호", "phone", golfCourse.phone)}
        {renderField(
          "활성 상태",
          "is_active",
          String(golfCourse.is_active),
          "dropdown",
          "is_active_choices"
        )}
      </div>

      {/* 대표자 정보 */}
      <div className="border border-gray-200 rounded-md overflow-hidden group">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900">대표자 정보</h3>
        </div>
        {renderField("대표자명", "ceo_name", golfCourse.ceo_name)}
      </div>

      {/* 매니저 정보 */}
      <div className="border border-gray-200 rounded-md overflow-hidden group">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900">매니저 정보</h3>
        </div>
        {renderField("매니저명", "manager_name", golfCourse.manager_name)}
        {renderField(
          "매니저 연락처",
          "manager_contact",
          golfCourse.manager_contact
        )}
        {renderField(
          "매니저 이메일",
          "manager_email",
          golfCourse.manager_email
        )}
      </div>
    </div>
  );
};

export default EditableGolfCourseInfo;
