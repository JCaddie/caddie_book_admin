"use client";

import React from "react";
import { Dropdown, Input } from "@/shared/components/ui";
import { EditableGolfCourse } from "@/shared/types/golf-course";
import { CONTRACT_STATUS_OPTIONS } from "@/shared/constants/golf-course";

interface GolfCourseEditFormProps {
  formData: EditableGolfCourse;
  onInputChange: (field: string, value: string) => void;
}

const GolfCourseEditForm: React.FC<GolfCourseEditFormProps> = ({
  formData,
  onInputChange,
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
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              className="w-full border-gray-200"
              placeholder="업체명을 입력하세요"
            />
          </div>
        </div>

        {/* 주소 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">주소</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <Input
              value={formData.address}
              onChange={(e) => onInputChange("address", e.target.value)}
              className="w-full border-gray-200"
              placeholder="주소를 입력하세요"
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
              options={CONTRACT_STATUS_OPTIONS}
              value={formData.contractStatus}
              onChange={(value) => onInputChange("contractStatus", value)}
              containerClassName="w-[106px]"
            />
            <Input
              value={formData.contractStartDate}
              onChange={(e) =>
                onInputChange("contractStartDate", e.target.value)
              }
              className="w-[200px] border-gray-200"
              placeholder="시작일"
            />
            <span className="text-sm text-gray-900">~</span>
            <Input
              value={formData.contractEndDate}
              onChange={(e) => onInputChange("contractEndDate", e.target.value)}
              className="w-[200px] border-gray-200"
              placeholder="종료일"
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
              value={formData.phone}
              onChange={(e) => onInputChange("phone", e.target.value)}
              className="w-full border-gray-200"
              placeholder="대표번호를 입력하세요"
            />
          </div>
        </div>
      </div>

      {/* 대표자/담당자 정보 편집 */}
      <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded-md overflow-hidden">
        {/* 대표자 정보 */}
        <div className="border-r border-gray-200">
          {/* 대표자 */}
          <div className="flex border-b border-gray-200">
            <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">대표자</span>
            </div>
            <div className="flex-1 px-4 py-3">
              <Input
                value={formData.representative.name}
                onChange={(e) =>
                  onInputChange("representative.name", e.target.value)
                }
                className="w-full border-gray-200"
                placeholder="대표자명"
              />
            </div>
          </div>

          {/* 연락처 */}
          <div className="flex border-b border-gray-200">
            <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">연락처</span>
            </div>
            <div className="flex-1 px-4 py-3">
              <Input
                value={formData.representative.contact}
                onChange={(e) =>
                  onInputChange("representative.contact", e.target.value)
                }
                className="w-full border-gray-200"
                placeholder="연락처"
              />
            </div>
          </div>

          {/* 이메일 */}
          <div className="flex">
            <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">이메일</span>
            </div>
            <div className="flex-1 px-4 py-3">
              <Input
                value={formData.representative.email}
                onChange={(e) =>
                  onInputChange("representative.email", e.target.value)
                }
                className="w-full border-gray-200"
                placeholder="이메일"
              />
            </div>
          </div>
        </div>

        {/* 담당자 정보 */}
        <div>
          {/* 담당자 */}
          <div className="flex border-b border-gray-200">
            <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">담당자</span>
            </div>
            <div className="flex-1 px-4 py-3">
              <Input
                value={formData.manager.name}
                onChange={(e) => onInputChange("manager.name", e.target.value)}
                className="w-full border-gray-200"
                placeholder="담당자명"
              />
            </div>
          </div>

          {/* 연락처 */}
          <div className="flex border-b border-gray-200">
            <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">연락처</span>
            </div>
            <div className="flex-1 px-4 py-3">
              <Input
                value={formData.manager.contact}
                onChange={(e) =>
                  onInputChange("manager.contact", e.target.value)
                }
                className="w-full border-gray-200"
                placeholder="연락처"
              />
            </div>
          </div>

          {/* 이메일 */}
          <div className="flex">
            <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">이메일</span>
            </div>
            <div className="flex-1 px-4 py-3">
              <Input
                value={formData.manager.email}
                onChange={(e) => onInputChange("manager.email", e.target.value)}
                className="w-full border-gray-200"
                placeholder="이메일"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GolfCourseEditForm;
