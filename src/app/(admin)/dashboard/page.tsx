"use client";

import React from "react";
import { useDocumentTitle, PAGE_TITLES } from "@/shared/hooks";

import {
  useDashboardData,
  DashboardHeader,
  AnnouncementSection,
  ContractStatusSection,
  UserStatusSection,
  WorkHoursSection,
  TeamCountSection,
  WorkerRankingSection,
} from "@/modules/dashboard";

const DashboardPage: React.FC = () => {
  // 페이지 타이틀 설정
  useDocumentTitle({ title: PAGE_TITLES.DASHBOARD });

  // 대시보드 데이터
  const { data, isLoading, role } = useDashboardData();

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnnouncementSection
          type="JCADDIE"
          announcements={data.announcements.jcaddie}
          onNavigate={() => console.log("Navigate to announcements")}
        />

        {/* Admin인 경우 골프장 공지사항 추가 */}
        {role === "ADMIN" && data.announcements.golfCourse && (
          <AnnouncementSection
            type="GOLF_COURSE"
            announcements={data.announcements.golfCourse}
            onNavigate={() =>
              console.log("Navigate to golf course announcements")
            }
          />
        )}
      </div>

      {/* 역할별 섹션 */}
      {role === "MASTER" && data.master && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContractStatusSection data={data.master} />
          <UserStatusSection data={data.master} />
        </div>
      )}

      {role === "ADMIN" && data.admin && (
        <div className="space-y-6">
          {/* 상단 영역: 근무 횟수 + 팀 수 차트 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <WorkHoursSection data={data.admin} />
            <div className="lg:col-span-2">
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
