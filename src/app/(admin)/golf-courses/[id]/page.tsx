"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import RoleGuard from "@/shared/components/auth/role-guard";
import { Button } from "@/shared/components/ui";

// 골프장 상세 데이터 타입
interface GolfCourseDetail {
  id: string;
  name: string;
  address: string;
  contractStatus: string;
  contractPeriod: string;
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
  operationStats: {
    caddies: number;
    admins: number;
    reservations: number;
    fields: number;
    carts: number;
  };
}

const GolfCourseDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const golfCourseId = params.id as string;

  // 샘플 데이터 (실제로는 API에서 가져옴)
  const golfCourse: GolfCourseDetail = {
    id: golfCourseId,
    name: "제이캐디 아카데미",
    address:
      "충청북도 청주시 청원구 오창읍 양청송대길 10, 406호(청주미래누리터(지식산업센터))",
    contractStatus: "계약",
    contractPeriod: "2025.05.26 ~ 2025.11.26",
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
    operationStats: {
      caddies: 156,
      admins: 6,
      reservations: 156,
      fields: 4,
      carts: 56,
    },
  };

  // 운영현황 카드 데이터
  const operationCards = [
    {
      title: "캐디",
      value: `${golfCourse.operationStats.caddies}명`,
      route: "/caddies",
      searchParam: golfCourse.name,
    },
    {
      title: "관리자",
      value: `${golfCourse.operationStats.admins}명`,
      route: "/users",
      searchParam: golfCourse.name,
    },
    {
      title: "근무",
      value: `예약 ${golfCourse.operationStats.reservations}건`,
      route: "/works",
      searchParam: golfCourse.name,
    },
    {
      title: "필드",
      value: `${golfCourse.operationStats.fields}개`,
      route: "/fields",
      searchParam: golfCourse.name,
    },
    {
      title: "카트",
      value: `${golfCourse.operationStats.carts}대`,
      route: "/carts",
      searchParam: golfCourse.name,
    },
  ];

  // 운영현황 카드 클릭 핸들러
  const handleOperationCardClick = (route: string, searchParam: string) => {
    // 해당 페이지로 이동하면서 골프장 이름으로 검색
    router.push(`${route}?search=${encodeURIComponent(searchParam)}`);
  };

  return (
    <RoleGuard requiredRole="DEVELOPER">
      <div className="bg-white rounded-xl p-8 space-y-8">
        {/* 상단 헤더 - 뒤로가기 버튼 제거 */}
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {golfCourse.name}
          </h1>
        </div>

        {/* 상세정보 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">상세정보</h2>
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push(`/golf-courses/${golfCourseId}/edit`)}
            >
              수정
            </Button>
          </div>

          {/* 기본 정보 */}
          <div className="border border-gray-200 rounded-md overflow-hidden">
            {/* 업체명 */}
            <div className="flex border-b border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">업체명</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <span className="text-sm text-gray-900">{golfCourse.name}</span>
              </div>
            </div>

            {/* 주소 */}
            <div className="flex border-b border-gray-200">
              <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">주소</span>
              </div>
              <div className="flex-1 px-4 py-3">
                <span className="text-sm text-gray-900">
                  {golfCourse.address}
                </span>
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
                <div className="bg-green-400 text-white px-2 py-1 rounded text-sm font-medium">
                  {golfCourse.contractStatus}
                </div>
                <span className="text-sm text-gray-900">
                  {golfCourse.contractPeriod}
                </span>
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
                <span className="text-sm text-gray-900">
                  {golfCourse.phone}
                </span>
              </div>
            </div>
          </div>

          {/* 대표자/담당자 정보 */}
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
                  <span className="text-sm text-gray-900">
                    {golfCourse.representative.name}
                  </span>
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
                  <span className="text-sm text-gray-900">
                    {golfCourse.representative.contact}
                  </span>
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
                  <span className="text-sm text-gray-900">
                    {golfCourse.representative.email}
                  </span>
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
                  <span className="text-sm text-gray-900">
                    {golfCourse.manager.name}
                  </span>
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
                  <span className="text-sm text-gray-900">
                    {golfCourse.manager.contact}
                  </span>
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
                  <span className="text-sm text-gray-900">
                    {golfCourse.manager.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 운영현황 섹션 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">운영현황</h2>

          <div className="grid grid-cols-5 gap-12">
            {operationCards.map((card, index) => (
              <div
                key={index}
                onClick={() =>
                  handleOperationCardClick(card.route, card.searchParam)
                }
                className="bg-white border border-gray-200 rounded-md p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* 카드 헤더 */}
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className="text-base font-bold text-gray-900">
                    {card.title}
                  </span>
                  <ChevronRight size={16} className="text-gray-800" />
                </div>

                {/* 카드 값 */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {card.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default GolfCourseDetailPage;
