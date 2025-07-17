"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import { Button } from "@/shared/components/ui";
import {
  GolfCourseInfo,
  OperationCards,
} from "@/shared/components/golf-course";
import { useGolfCourseDetail } from "@/modules/golf-course/hooks/use-golf-course-detail";

const GolfCourseDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const golfCourseId = params.id as string;

  // API 데이터 fetch
  const {
    data: golfCourse,
    isLoading,
    isError,
  } = useGolfCourseDetail(golfCourseId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg">
        로딩 중...
      </div>
    );
  }
  if (isError || !golfCourse) {
    return (
      <div className="flex justify-center items-center h-96 text-lg text-red-500">
        상세 정보를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  // 운영현황 카드 데이터 (API 필드에 맞게 매핑)
  const operationCards = [
    {
      title: "캐디 수",
      value: String(golfCourse.total_caddies),
      route: "/caddies",
      searchParam: golfCourse.name,
    },
    {
      title: "필드 수",
      value: String(golfCourse.field_count),
      route: "/fields",
      searchParam: golfCourse.name,
    },
    {
      title: "카트 수",
      value: String(golfCourse.cart_count),
      route: "/carts",
      searchParam: golfCourse.name,
    },
    {
      title: "매니저 수",
      value: String(golfCourse.manager_count),
      route: "/users",
      searchParam: golfCourse.name,
    },
    {
      title: "근무 수",
      value: String(golfCourse.work_count),
      route: "/works",
      searchParam: golfCourse.name,
    },
  ];

  return (
    <RoleGuard requiredRoles={["MASTER", "ADMIN"]}>
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
