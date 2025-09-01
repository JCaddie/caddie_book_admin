// 서버 컴포넌트로 전환 - "use client" 제거
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { GolfCourseListClient } from "./golf-course-list-client";
import { GolfCourseListSkeleton } from "./golf-course-list-skeleton";
import { getGolfCourseList } from "@/modules/golf-course/api/server";
import { getConstantOptions } from "@/shared/lib/server/constants";

interface GolfCoursesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    contract?: string;
    membership_type?: string;
    isActive?: string;
  }>;
}

export default async function GolfCoursesPage({
  searchParams,
}: GolfCoursesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page || 1);
  const searchTerm = params.search || "";

  // 서버에서 초기 데이터 로드
  const [golfCourseData, constantOptions] = await Promise.all([
    getGolfCourseList({
      page: currentPage,
      search: searchTerm || undefined,
      contract: params.contract || undefined,
      membership_type: params.membership_type || undefined,
      isActive: params.isActive || undefined,
    }),
    getConstantOptions([
      "contract_statuses",
      "membership_types",
      "is_active_choices",
    ]),
  ]);

  // 에러 처리
  if (!golfCourseData) {
    notFound();
  }

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <Suspense fallback={<GolfCourseListSkeleton />}>
        <GolfCourseListClient
          initialData={golfCourseData}
          initialConstants={constantOptions}
          searchParams={params}
        />
      </Suspense>
    </div>
  );
}
