"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import { Button } from "@/shared/components/ui";
import {
  GolfCourseInfo,
  OperationCards,
} from "@/shared/components/golf-course";
import { GolfCourseDetail } from "@/shared/types/golf-course";
import { createOperationCards } from "@/shared/constants/golf-course";

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
  const operationCards = createOperationCards(
    golfCourse.name,
    golfCourse.operationStats
  );

  return (
    <RoleGuard requiredRole="MASTER">
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

          <GolfCourseInfo golfCourse={golfCourse} />
        </div>

        {/* 운영현황 섹션 */}
        <OperationCards cards={operationCards} />
      </div>
    </RoleGuard>
  );
};

export default GolfCourseDetailPage;
