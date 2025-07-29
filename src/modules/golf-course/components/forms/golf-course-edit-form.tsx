"use client";

import React from "react";
import { Dropdown, Input } from "@/shared/components/ui";
import { EditableGolfCourse } from "../../types";

export interface GolfCourseFormProps {
  formData: EditableGolfCourse;
  onInputChange: (field: string, value: string) => void;
  contractStatusOptions: { label: string; value: string }[];
  contractStatusLoading: boolean;
  membershipTypeOptions?: { label: string; value: string }[];
  membershipTypeLoading?: boolean;
  isActiveOptions?: { label: string; value: string }[];
}

const GolfCourseForm: React.FC<GolfCourseFormProps> = ({
  formData,
  onInputChange,
  contractStatusOptions,
  contractStatusLoading,
  membershipTypeOptions = [],
  membershipTypeLoading = false,
  isActiveOptions = [],
}) => {
  return (
    <div className="space-y-6">
      {/* 기본 정보 편집 */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        {/* 업체명 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">업체명</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <Input
              value={formData.name ?? ""}
              onChange={(e) => onInputChange("name", e.target.value)}
              className="w-full border-gray-200"
              placeholder="골프장명을 입력하세요"
            />
          </div>
        </div>

        {/* 지역 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">지역</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <Input
              value={formData.region ?? ""}
              onChange={(e) => onInputChange("region", e.target.value)}
              className="w-full border-gray-200"
              placeholder="지역을 입력하세요"
            />
          </div>
        </div>

        {/* 계약 현황 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">계약 현황</span>
          </div>
          <div className="flex-1 px-4 py-3 flex items-center gap-6">
            <Dropdown
              options={contractStatusOptions}
              value={formData.contractStatus}
              onChange={(value) => onInputChange("contractStatus", value)}
              containerClassName="w-[106px]"
              placeholder="계약현황"
              disabled={contractStatusLoading}
            />
          </div>
        </div>

        {/* 회원제 타입 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">회원제 구분</span>
          </div>
          <div className="flex-1 px-4 py-3 flex items-center gap-6">
            <Dropdown
              options={membershipTypeOptions}
              value={formData.membershipType}
              onChange={(value) => onInputChange("membershipType", value)}
              containerClassName="w-[106px]"
              placeholder="회원제 구분"
              disabled={membershipTypeLoading}
            />
          </div>
        </div>

        {/* 활성 상태 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">활성 상태</span>
          </div>
          <div className="flex-1 px-4 py-3 flex items-center gap-6">
            <Dropdown
              options={isActiveOptions}
              value={String(formData.isActive)}
              onChange={(value) => onInputChange("isActive", value)}
              containerClassName="w-[106px]"
              placeholder="활성 상태"
            />
          </div>
        </div>

        {/* 대표번호 */}
        <div className="flex">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">대표번호</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <Input
              value={formData.phone ?? ""}
              onChange={(e) => onInputChange("phone", e.target.value)}
              className="w-full border-gray-200"
              placeholder="대표번호를 입력하세요"
            />
          </div>
        </div>
      </div>

      {/* 주소 정보 */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900">주소 정보</h3>
        </div>
        <div className="flex">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">주소</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <Input
              value={formData.address ?? ""}
              onChange={(e) => onInputChange("address", e.target.value)}
              className="w-full border-gray-200"
              placeholder="주소를 입력하세요"
            />
          </div>
        </div>
      </div>

      {/* 대표자 정보 */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900">대표자 정보</h3>
        </div>
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">대표자명</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <Input
              value={formData.representative.name ?? ""}
              onChange={(e) =>
                onInputChange("representative.name", e.target.value)
              }
              className="w-full border-gray-200"
              placeholder="대표자명을 입력하세요"
            />
          </div>
        </div>
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">연락처</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <Input
              value={formData.representative.contact ?? ""}
              onChange={(e) =>
                onInputChange("representative.contact", e.target.value)
              }
              className="w-full border-gray-200"
              placeholder="연락처를 입력하세요"
            />
          </div>
        </div>
        <div className="flex">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">이메일</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <Input
              value={formData.representative.email ?? ""}
              onChange={(e) =>
                onInputChange("representative.email", e.target.value)
              }
              className="w-full border-gray-200"
              placeholder="이메일을 입력하세요"
            />
          </div>
        </div>
      </div>

      {/* 매니저 정보 */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900">매니저 정보</h3>
        </div>
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">매니저명</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <Input
              value={formData.manager.name ?? ""}
              onChange={(e) => onInputChange("manager.name", e.target.value)}
              className="w-full border-gray-200"
              placeholder="매니저명을 입력하세요"
            />
          </div>
        </div>
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">연락처</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <Input
              value={formData.manager.contact ?? ""}
              onChange={(e) => onInputChange("manager.contact", e.target.value)}
              className="w-full border-gray-200"
              placeholder="연락처를 입력하세요"
            />
          </div>
        </div>
        <div className="flex">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">이메일</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <Input
              value={formData.manager.email ?? ""}
              onChange={(e) => onInputChange("manager.email", e.target.value)}
              className="w-full border-gray-200"
              placeholder="이메일을 입력하세요"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GolfCourseForm;
