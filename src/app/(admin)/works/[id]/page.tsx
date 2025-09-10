// 서버 컴포넌트로 전환 - "use client" 제거
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { WorkDetailClient } from "./work-detail-client";
import { WorkDetailSkeleton } from "./work-detail-skeleton";
import { getWorkDetailData } from "@/modules/work/api/server";

interface WorkDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}

export default async function WorkDetailPage({
  params,
  searchParams,
}: WorkDetailPageProps) {
  const { id: golfCourseId } = await params;
  const { date } = await searchParams;

  // 서버에서 초기 데이터 로드
  const workDetailData = await getWorkDetailData(golfCourseId, date);

  // 에러 처리
  if (!workDetailData) {
    notFound();
  }

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <Suspense fallback={<WorkDetailSkeleton />}>
        <WorkDetailClient
          golfCourseId={golfCourseId}
          initialData={workDetailData}
          initialDate={date}
        />
      </Suspense>
    </div>
  );
}
