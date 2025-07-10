"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDocumentTitle, PAGE_TITLES } from "@/shared/hooks";

import {
  useDashboardData,
  DashboardHeader,
  AnnouncementSection,
  StatsSection,
  WorkHoursSection,
  TeamCountSection,
  WorkerRankingSection,
  CONTRACT_STATS_CONFIG,
  USER_STATS_CONFIG,
} from "@/modules/dashboard";

const DashboardPage: React.FC = () => {
  const router = useRouter();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: PAGE_TITLES.DASHBOARD });

  // 대시보드 데이터
  const { data, isLoading, role } = useDashboardData();

  // 공지사항 목록으로 이동 (제이캐디만 타입 필터링)
  const handleNavigateToAnnouncements = (type: "JCADDIE" | "GOLF_COURSE") => {
    if (type === "JCADDIE") {
      router.push(`/announcements?type=${type}`);
    } else {
      router.push("/announcements");
    }
  };

  // 공지사항 상세 페이지로 이동
  const handleAnnouncementClick = (announcementId: string) => {
    router.push(`/announcements/${announcementId}`);
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">대시보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      {/* 헤더 */}
      <DashboardHeader />

      {/* 공통 공지사항 */}
      <div className="flex flex-row gap-6">
        <div className="flex-1">
          <AnnouncementSection
            type="JCADDIE"
            announcements={data.announcements.jcaddie}
            onNavigate={() => handleNavigateToAnnouncements("JCADDIE")}
            onAnnouncementClick={handleAnnouncementClick}
          />
        </div>

        {/* Admin인 경우 골프장 공지사항 추가 */}
        {role === "ADMIN" && data.announcements.golfCourse && (
          <div className="flex-1">
            <AnnouncementSection
              type="GOLF_COURSE"
              announcements={data.announcements.golfCourse}
              onNavigate={() => handleNavigateToAnnouncements("GOLF_COURSE")}
              onAnnouncementClick={handleAnnouncementClick}
            />
          </div>
        )}
      </div>

      {/* 역할별 섹션 */}
      {role === "MASTER" && data.master && (
        <div className="flex flex-row gap-6">
          <div className="flex-1">
            <StatsSection data={data.master} config={CONTRACT_STATS_CONFIG} />
          </div>
          <div className="flex-1">
            <StatsSection data={data.master} config={USER_STATS_CONFIG} />
          </div>
        </div>
      )}

      {role === "ADMIN" && data.admin && (
        <div className="space-y-6">
          {/* 상단 영역: 근무 횟수 + 팀 수 차트 */}
          <div className="flex flex-row gap-6">
            <div className="flex-1">
              <WorkHoursSection data={data.admin} />
            </div>
            <div className="flex-1">
              <TeamCountSection />
            </div>
          </div>

          {/* 하단 영역: 근무자 현황 */}
          <WorkerRankingSection data={data.admin} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
