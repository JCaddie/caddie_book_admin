"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, Dropdown, Input } from "@/shared/components/ui";
import { useConstantOptions } from "@/shared/hooks";
import { apiClient } from "@/shared/lib/api-client";

interface GolfCourseCreateData {
  name: string;
  region: string;
  contractStatus: string;
  membershipType: string;
  isActive: boolean;
  phone: string;
}

interface GolfCourseCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const GolfCourseCreateModal: React.FC<GolfCourseCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<GolfCourseCreateData>({
    name: "",
    region: "",
    contractStatus: "",
    membershipType: "",
    isActive: true,
    phone: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 백엔드 상수값들 조회
  const { options: contractOptionsRaw, isLoading: contractLoading } =
    useConstantOptions("contract_statuses");
  const { options: membershipOptionsRaw, isLoading: membershipLoading } =
    useConstantOptions("membership_types");
  const { options: isActiveOptionsRaw } =
    useConstantOptions("is_active_choices");

  // value를 string으로 변환
  const contractOptions = contractOptionsRaw.map((opt) => ({
    ...opt,
    value: String(opt.value),
  }));
  const membershipOptions = membershipOptionsRaw.map((opt) => ({
    ...opt,
    value: String(opt.value),
  }));
  const isActiveOptions = isActiveOptionsRaw.map((opt) => ({
    ...opt,
    value: String(opt.value),
  }));

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (
    field: keyof GolfCourseCreateData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!formData.name.trim()) {
      setError("업체명을 입력해주세요.");
      return;
    }
    if (!formData.region.trim()) {
      setError("지역을 입력해주세요.");
      return;
    }
    if (!formData.contractStatus) {
      setError("계약현황을 선택해주세요.");
      return;
    }
    if (!formData.membershipType) {
      setError("회원제 구분을 선택해주세요.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("대표번호를 입력해주세요.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // API 요청 데이터 구성
      const apiData = {
        name: formData.name,
        region: formData.region,
        contract_status: formData.contractStatus,
        membership_type: formData.membershipType,
        is_active: formData.isActive,
        phone: formData.phone,
        // 필수 필드들을 빈 값으로 설정
        address: "",
        representative: { name: "", contact: "", email: "" },
        manager: { name: "", contact: "", email: "" },
      };

      await apiClient.post("/v1/golf-courses/", apiData);

      // 성공 시 폼 리셋 및 콜백 호출
      setFormData({
        name: "",
        region: "",
        contractStatus: "",
        membershipType: "",
        isActive: true,
        phone: "",
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("골프장 생성 중 오류:", error);
      setError("골프장 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving) return;
    setError(null);
    setFormData({
      name: "",
      region: "",
      contractStatus: "",
      membershipType: "",
      isActive: true,
      phone: "",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-xl flex flex-col"
        style={{
          width: "500px",
          maxHeight: "80vh",
        }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">골프장 등록</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* 업체명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                업체명 <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="골프장명을 입력하세요"
                disabled={isSaving}
              />
            </div>

            {/* 지역 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지역 <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.region}
                onChange={(e) => handleInputChange("region", e.target.value)}
                placeholder="지역을 입력하세요"
                disabled={isSaving}
              />
            </div>

            {/* 계약현황 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                계약현황 <span className="text-red-500">*</span>
              </label>
              <Dropdown
                options={contractOptions}
                value={formData.contractStatus}
                onChange={(value) => handleInputChange("contractStatus", value)}
                placeholder="계약현황을 선택하세요"
                disabled={contractLoading || isSaving}
                containerClassName="w-full"
              />
            </div>

            {/* 회원제 구분 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                회원제 구분 <span className="text-red-500">*</span>
              </label>
              <Dropdown
                options={membershipOptions}
                value={formData.membershipType}
                onChange={(value) => handleInputChange("membershipType", value)}
                placeholder="회원제 구분을 선택하세요"
                disabled={membershipLoading || isSaving}
                containerClassName="w-full"
              />
            </div>

            {/* 활성 상태 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                활성 상태
              </label>
              <Dropdown
                options={isActiveOptions}
                value={String(formData.isActive)}
                onChange={(value) =>
                  handleInputChange("isActive", value === "true")
                }
                placeholder="활성 상태를 선택하세요"
                disabled={isSaving}
                containerClassName="w-full"
              />
            </div>

            {/* 대표번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대표번호 <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="대표번호를 입력하세요"
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSaving}
            className="border-[#FEB912] text-[#FEB912] hover:bg-[#FEB912] hover:text-white"
          >
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "등록 중..." : "등록"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GolfCourseCreateModal;
