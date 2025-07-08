"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import { Button, Input, Dropdown } from "@/shared/components/ui";

// 편집 가능한 골프장 데이터 타입
interface EditableGolfCourse {
  id: string;
  name: string;
  address: string;
  contractStatus: string;
  contractStartDate: string;
  contractEndDate: string;
  phone: string;
  representative: {
    name: string;
    contact: string;
    email: string;
  };
  manager: {
    name: string;
    contact: string;
    email: string;
  };
}

const GolfCourseEditPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const golfCourseId = params.id as string;

  // 편집 가능한 골프장 데이터 상태
  const [formData, setFormData] = useState<EditableGolfCourse>({
    id: golfCourseId,
    name: "제이캐디 아카데미",
    address:
      "충청북도 청주시 청원구 오창읍 양청송대길 10, 406호(청주미래누리터(지식산업센터))",
    contractStatus: "계약",
    contractStartDate: "2025.05.26",
    contractEndDate: "2025.11.26",
    phone: "02 - 123 - 4567",
    representative: {
      name: "홍길동",
      contact: "010-1234-5678",
      email: "cs@daangnservice.com",
    },
    manager: {
      name: "감강찬",
      contact: "010-1234-5678",
      email: "cs@daangnservice.com",
    },
  });

  // 계약 상태 옵션
  const contractStatusOptions = [
    { value: "계약", label: "계약" },
    { value: "대기", label: "대기" },
    { value: "만료", label: "만료" },
    { value: "해지", label: "해지" },
  ];

  // 입력 필드 변경 핸들러
  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[
            parent as keyof Pick<
              EditableGolfCourse,
              "representative" | "manager"
            >
          ],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    router.push(`/golf-courses/${golfCourseId}`);
  };

  // 완료 버튼 핸들러
  const handleSubmit = () => {
    // 실제로는 API 호출하여 저장
    console.log("저장할 데이터:", formData);

    // 저장 후 상세 페이지로 이동
    router.push(`/golf-courses/${golfCourseId}`);
  };

  return (
    <RoleGuard requiredRole="DEVELOPER">
      <div className="bg-white rounded-xl p-8 space-y-8">
        {/* 상단 헤더 - 뒤로가기 버튼 제거 */}
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-gray-900">{formData.name}</h1>
        </div>

        {/* 상세정보 편집 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">상세정보</h2>

            {/* 취소/완료 버튼 */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={handleCancel}
                className="border-[#FEB912] text-[#FEB912] hover:bg-[#FEB912] hover:text-white"
              >
                취소
              </Button>
              <Button variant="primary" size="md" onClick={handleSubmit}>
                완료
              </Button>
            </div>
          </div>

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
                  onChange={(e) => handleInputChange("name", e.target.value)}
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
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full border-gray-200"
                  placeholder="주소를 입력하세요"
                />
              </div>
            </div>

            {/* 계약 현황 */}
            <div className="flex border-b border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  계약 현황
                </span>
              </div>
              <div className="flex-1 px-4 py-3 flex items-center gap-6">
                <Dropdown
                  options={contractStatusOptions}
                  value={formData.contractStatus}
                  onChange={(value) =>
                    handleInputChange("contractStatus", value)
                  }
                  containerClassName="w-[106px]"
                />
                <Input
                  value={formData.contractStartDate}
                  onChange={(e) =>
                    handleInputChange("contractStartDate", e.target.value)
                  }
                  className="w-[200px] border-gray-200"
                  placeholder="시작일"
                />
                <span className="text-sm text-gray-900">~</span>
                <Input
                  value={formData.contractEndDate}
                  onChange={(e) =>
                    handleInputChange("contractEndDate", e.target.value)
                  }
                  className="w-[200px] border-gray-200"
                  placeholder="종료일"
                />
              </div>
            </div>

            {/* 대표번호 */}
            <div className="flex">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  대표번호
                </span>
              </div>
              <div className="flex-1 px-4 py-3">
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
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
                  <span className="text-sm font-bold text-gray-900">
                    대표자
                  </span>
                </div>
                <div className="flex-1 px-4 py-3">
                  <Input
                    value={formData.representative.name}
                    onChange={(e) =>
                      handleInputChange("representative.name", e.target.value)
                    }
                    className="w-full border-gray-200"
                    placeholder="대표자명"
                  />
                </div>
              </div>

              {/* 연락처 */}
              <div className="flex border-b border-gray-200">
                <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">
                    연락처
                  </span>
                </div>
                <div className="flex-1 px-4 py-3">
                  <Input
                    value={formData.representative.contact}
                    onChange={(e) =>
                      handleInputChange(
                        "representative.contact",
                        e.target.value
                      )
                    }
                    className="w-full border-gray-200"
                    placeholder="연락처"
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div className="flex">
                <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">
                    이메일
                  </span>
                </div>
                <div className="flex-1 px-4 py-3">
                  <Input
                    value={formData.representative.email}
                    onChange={(e) =>
                      handleInputChange("representative.email", e.target.value)
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
                  <span className="text-sm font-bold text-gray-900">
                    담당자
                  </span>
                </div>
                <div className="flex-1 px-4 py-3">
                  <Input
                    value={formData.manager.name}
                    onChange={(e) =>
                      handleInputChange("manager.name", e.target.value)
                    }
                    className="w-full border-gray-200"
                    placeholder="담당자명"
                  />
                </div>
              </div>

              {/* 연락처 */}
              <div className="flex border-b border-gray-200">
                <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">
                    연락처
                  </span>
                </div>
                <div className="flex-1 px-4 py-3">
                  <Input
                    value={formData.manager.contact}
                    onChange={(e) =>
                      handleInputChange("manager.contact", e.target.value)
                    }
                    className="w-full border-gray-200"
                    placeholder="연락처"
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div className="flex">
                <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">
                    이메일
                  </span>
                </div>
                <div className="flex-1 px-4 py-3">
                  <Input
                    value={formData.manager.email}
                    onChange={(e) =>
                      handleInputChange("manager.email", e.target.value)
                    }
                    className="w-full border-gray-200"
                    placeholder="이메일"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default GolfCourseEditPage;
