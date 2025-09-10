import React from "react";
import { notFound } from "next/navigation";
import RoleGuard from "@/shared/components/auth/role-guard";
import {
  EditableGolfCourseInfo,
  OperationCards,
} from "@/shared/components/golf-course";
import { getGolfCourseDetail } from "@/modules/golf-course/api/server";
import type { GolfCourseDetail } from "@/modules/golf-course/types/api";

interface GolfCourseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const GolfCourseDetailPage: React.FC<GolfCourseDetailPageProps> = async ({
  params,
}) => {
  const { id: golfCourseId } = await params;

  // 서버에서 골프장 데이터 fetch
  const response = await getGolfCourseDetail(golfCourseId);

  if (!response?.data) {
    notFound();
  }

  const golfCourse: GolfCourseDetail = response.data;

  // 운영현황 카드 데이터 (API 필드에 맞게 매핑)
  const operationCards = [
    {
      title: "캐디 수",
      value: String(golfCourse.total_caddies),
      route: "/caddies",
      searchParam: golfCourse.name,
    },
    {
      title: "홀 수",
      value: String(golfCourse.total_holes),
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
          </div>

          <EditableGolfCourseInfo golfCourse={golfCourse} />
        </div>

        {/* 운영현황 섹션 */}
        <OperationCards cards={operationCards} />
      </div>
    </RoleGuard>
  );
};

export default GolfCourseDetailPage;
