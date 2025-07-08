"use client";

import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Search,
  RotateCcw,
  MoreVertical,
} from "lucide-react";
import { useWorkDetail } from "@/modules/work/hooks/use-work-detail";

interface WorkDetailPageContentProps {
  workId: string;
}

interface CaddieCardProps {
  caddie?: {
    id: number;
    name: string;
    group: number;
    badge: string;
    status: string;
    specialBadge?: string;
  };
  isEmpty?: boolean;
  emptyText?: string;
}

// 캐디 카드 컴포넌트
function CaddieCard({
  caddie,
  isEmpty = false,
  emptyText = "미배정",
}: CaddieCardProps) {
  if (isEmpty) {
    return (
      <div className="w-[218px] h-auto flex items-center justify-center px-2 py-1.5 bg-white rounded-md border border-[#DDDDDD]">
        <span className="text-sm font-medium text-[#AEAAAA]">{emptyText}</span>
      </div>
    );
  }

  if (!caddie) return null;

  // 상태별 스타일 정의
  const getCardStyle = () => {
    switch (caddie.status) {
      case "휴무":
        return "shadow-[0_0_4px_2px_rgba(255,0,0,0.25)]";
      case "배치완료":
        return "shadow-[0_0_4px_2px_rgba(254,185,18,0.35)]";
      default:
        return "";
    }
  };

  const getSpecialBadgeStyle = () => {
    switch (caddie.specialBadge) {
      case "조첫":
        return { bg: "#E3E3E3", text: "#2F78FF" };
      case "스페어":
        return { bg: "#E3E3E3", text: "#83BF50" };
      default:
        return null;
    }
  };

  const specialBadgeStyle = getSpecialBadgeStyle();

  return (
    <div
      className={`w-[218px] flex items-center justify-between px-2 py-1.5 bg-white rounded-md border border-[#DDDDDD] ${getCardStyle()}`}
    >
      <div className="flex items-center gap-1.5">
        {/* 조 배지 */}
        <div className="w-9 h-5 bg-[#DDE9FF] text-[#1061F9] text-xs font-bold rounded-xl flex items-center justify-center flex-shrink-0">
          {caddie.group}조
        </div>

        {/* 이름 */}
        <span className="text-sm font-medium text-black flex-shrink-0">
          {caddie.name}
        </span>

        {/* 특수반 배지 - 고정 너비 */}
        <div className="w-12 h-5 bg-[#FFF5E6] text-black/30 text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
          {caddie.badge}
        </div>

        {/* 상태 구분선 및 배지 */}
        {(caddie.status === "휴무" || caddie.specialBadge) && (
          <>
            <div className="w-0.5 h-4 bg-[#E3E3E3] flex-shrink-0"></div>
            {caddie.status === "휴무" && (
              <div className="w-10 h-5 bg-[#FFF5E6] text-[#FEB912] text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                휴무
              </div>
            )}
            {specialBadgeStyle && (
              <div
                className="w-12 h-5 text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: specialBadgeStyle.bg,
                  color: specialBadgeStyle.text,
                }}
              >
                {caddie.specialBadge}
              </div>
            )}
          </>
        )}
      </div>

      {/* 메뉴 아이콘 (hover 시에만 표시) */}
      <div className="opacity-0 hover:opacity-100 transition-opacity flex-shrink-0">
        <MoreVertical className="w-5 h-5 text-black/80" />
      </div>
    </div>
  );
}

export default function WorkDetailPageContent({
  workId,
}: WorkDetailPageContentProps) {
  const { work } = useWorkDetail(workId);

  // 존재하지 않는 근무 ID인 경우
  if (!work) {
    notFound();
  }

  // 샘플 캐디 데이터 (다양한 상태 포함)
  const caddies = [
    { id: 1, name: "홍길동", group: 1, badge: "하우스", status: "근무" },
    { id: 2, name: "김철수", group: 1, badge: "하우스", status: "휴무" },
    {
      id: 3,
      name: "박영희",
      group: 2,
      badge: "2•3부",
      status: "근무",
      specialBadge: "조첫",
    },
    {
      id: 4,
      name: "이민수",
      group: 2,
      badge: "3부",
      status: "근무",
      specialBadge: "스페어",
    },
    { id: 5, name: "정수지", group: 3, badge: "마샬", status: "배치완료" },
    { id: 6, name: "최영수", group: 3, badge: "새싹", status: "근무" },
  ];

  // 시간 슬롯 생성 (1부: 06:00-12:30, 2부: 13:00-16:30, 3부: 17:00-18:30)
  const timeSlots = {
    part1: Array.from({ length: 13 }, (_, i) => {
      const hour = Math.floor(i / 2) + 6;
      const minute = i % 2 === 0 ? "00" : "30";
      return `${hour.toString().padStart(2, "0")}:${minute}`;
    }),
    part2: Array.from({ length: 7 }, (_, i) => {
      const hour = Math.floor(i / 2) + 13;
      const minute = i % 2 === 0 ? "00" : "30";
      return `${hour.toString().padStart(2, "0")}:${minute}`;
    }),
    part3: Array.from({ length: 4 }, (_, i) => {
      const hour = Math.floor(i / 2) + 17;
      const minute = i % 2 === 0 ? "00" : "30";
      return `${hour.toString().padStart(2, "0")}:${minute}`;
    }),
  };

  // 필드별 데이터
  const fields = [
    { id: 1, name: "서코스" },
    { id: 2, name: "동코스" },
    { id: 3, name: "남코스" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 최상단 헤더 */}
      <div className="bg-white">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between px-4 py-4">
            <h1 className="text-2xl font-bold text-black">제이캐디아카데미</h1>
          </div>
        </div>
      </div>

      {/* 날짜 네비게이션 및 검색 섹션 */}
      <div className="bg-white">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between pl-4 py-4">
            {/* 왼쪽: 날짜 네비게이션 */}
            <div className="flex items-center gap-4">
              {/* 이전 화살표 */}
              <button className="w-6 h-6 flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 text-[#FEB912]" />
              </button>

              {/* 날짜 및 캘린더 */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-black opacity-80" />
                <span className="text-[22px] font-medium text-black opacity-80">
                  2025.05.26.(월)
                </span>
              </div>

              {/* 다음 화살표 */}
              <button className="w-6 h-6 flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-[#FEB912]" />
              </button>
            </div>

            {/* 오른쪽: 검색창 */}
            <div className="relative w-[400px]">
              <div className="flex items-center gap-2 px-3 py-2 bg-white">
                <Search className="w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="캐디 검색"
                  className="flex-1 text-sm font-medium text-gray-400 bg-transparent outline-none placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-[1920px] mx-auto flex gap-8 p-6">
        {/* 왼쪽: 라운딩 관리 */}
        <div className="flex-1">
          {/* 라운딩 관리 상단 */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h2 className="text-[22px] font-bold text-black">
                  라운딩 관리
                </h2>

                {/* 인원 통계 배지 */}
                <div className="flex items-center gap-4 bg-white rounded-full px-6 py-2">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-[#217F81] text-white text-sm font-bold rounded">
                      총인원
                    </div>
                    <span className="text-sm font-bold">152</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-[#FEB912] text-white text-sm font-bold rounded">
                      가용인원
                    </div>
                    <span className="text-sm font-bold">125</span>
                  </div>
                </div>
              </div>

              {/* 초기화 버튼 */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#FEB912] text-white font-semibold rounded-md hover:bg-[#e5a50f]">
                <RotateCcw className="w-6 h-6" />
                초기화
              </button>
            </div>
          </div>

          {/* 필드별 스케줄 컨테이너 (스크롤 가능) */}
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-fit p-4">
                {/* 필드 컬럼들 */}
                {fields.map((field) => (
                  <div key={field.id} className="w-[314px] flex-shrink-0">
                    {/* 필드 헤더 */}
                    <div className="bg-[#FEB912] rounded-t-lg">
                      <div className="flex items-center justify-center py-2 px-4">
                        <span className="text-[22px] font-bold text-black">
                          {field.name}
                        </span>
                      </div>
                    </div>

                    {/* 1부 */}
                    <div className="bg-[#F7F7F7]">
                      <div className="flex items-center justify-center py-3">
                        <span className="text-[22px] font-bold text-black">
                          1부
                        </span>
                      </div>
                      <div className="p-2">
                        {/* 각 시간대별로 행 생성 */}
                        {timeSlots.part1.map((time, timeIndex) => (
                          <div
                            key={timeIndex}
                            className="flex items-center gap-2 mb-2"
                          >
                            {/* 시간 */}
                            <div className="w-14 h-9 flex items-center justify-center text-sm font-medium text-black/80 flex-shrink-0">
                              {time}
                            </div>
                            {/* 캐디 카드 슬롯 */}
                            <div className="flex-1">
                              {timeIndex < 4 ? (
                                <CaddieCard caddie={caddies[timeIndex]} />
                              ) : (
                                <CaddieCard isEmpty={true} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2부 */}
                    <div className="bg-[#F7F7F7]">
                      <div className="flex items-center justify-center py-3">
                        <span className="text-[22px] font-bold text-black">
                          2부
                        </span>
                      </div>
                      <div className="p-2">
                        {/* 각 시간대별로 행 생성 */}
                        {timeSlots.part2.map((time, timeIndex) => (
                          <div
                            key={timeIndex}
                            className="flex items-center gap-2 mb-2"
                          >
                            {/* 시간 */}
                            <div className="w-14 h-9 flex items-center justify-center text-sm font-medium text-black/80 flex-shrink-0">
                              {time}
                            </div>
                            {/* 캐디 카드 슬롯 */}
                            <div className="flex-1">
                              {timeIndex < 2 ? (
                                <CaddieCard caddie={caddies[timeIndex + 2]} />
                              ) : (
                                <CaddieCard
                                  isEmpty={true}
                                  emptyText="예약없음"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3부 */}
                    <div className="bg-[#F7F7F7] rounded-b-lg">
                      <div className="flex items-center justify-center py-3">
                        <span className="text-[22px] font-bold text-black">
                          3부
                        </span>
                      </div>
                      <div className="p-2">
                        {/* 각 시간대별로 행 생성 */}
                        {timeSlots.part3.map((time, timeIndex) => (
                          <div
                            key={timeIndex}
                            className="flex items-center gap-2 mb-2"
                          >
                            {/* 시간 */}
                            <div className="w-14 h-9 flex items-center justify-center text-sm font-medium text-black/80 flex-shrink-0">
                              {time}
                            </div>
                            {/* 캐디 카드 슬롯 */}
                            <div className="flex-1">
                              {timeIndex < 2 ? (
                                <CaddieCard caddie={caddies[timeIndex + 4]} />
                              ) : (
                                <CaddieCard isEmpty={true} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 인력 현황 사이드바 */}
        <div className="w-[474px] bg-white rounded-lg p-4 h-fit">
          {/* 상단 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[22px] font-bold text-black">인력 현황</h3>
            <div className="flex items-center gap-4">
              <span className="text-base font-medium">휴무 제한 : 4명</span>
              <button className="px-4 py-2 bg-[#FEB912] text-white font-semibold rounded-md text-base">
                설정
              </button>
            </div>
          </div>

          {/* 필터 섹션 */}
          <div className="space-y-8 mb-8">
            {/* 상태 필터 */}
            <div>
              <h4 className="text-xl font-medium mb-2">필터</h4>
              <div className="h-0.5 bg-gray-300 mb-4"></div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-base font-medium w-12">상태</span>
                <div className="flex flex-wrap gap-2">
                  {["전체", "근무", "휴무", "병가", "봉사", "교육"].map(
                    (status, index) => (
                      <button
                        key={status}
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          index === 1
                            ? "bg-[#FEB912] text-white"
                            : "bg-[#E3E3E3] text-black/80"
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* 그룹 필터 */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-base font-medium w-12">그룹</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "전체",
                    "1조",
                    "2조",
                    "3조",
                    "4조",
                    "5조",
                    "6조",
                    "7조",
                    "8조",
                    "9조",
                  ].map((group, index) => (
                    <button
                      key={group}
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        index === 1
                          ? "bg-[#FEB912] text-white"
                          : "bg-[#E3E3E3] text-black/80"
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              {/* 특수반 필터 */}
              <div className="flex items-center gap-4">
                <span className="text-base font-medium w-12">특수반</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "전체",
                    "하우스",
                    "2•3부",
                    "3부",
                    "마샬",
                    "새싹",
                    "실버",
                  ].map((badge, index) => (
                    <button
                      key={badge}
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        index === 1
                          ? "bg-[#FEB912] text-white"
                          : "bg-[#E3E3E3] text-black/80"
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 캐디 목록 */}
          <div>
            <h4 className="text-xl font-medium mb-2">캐디</h4>
            <div className="h-0.5 bg-gray-300 mb-4"></div>
            <div className="space-y-2">
              {/* 첫 번째 줄 */}
              <div className="flex gap-2">
                {caddies.slice(0, 2).map((caddie) => (
                  <CaddieCard key={caddie.id} caddie={caddie} />
                ))}
              </div>

              {/* 두 번째 줄 */}
              <div className="flex gap-2">
                {caddies.slice(2, 4).map((caddie) => (
                  <CaddieCard key={caddie.id} caddie={caddie} />
                ))}
              </div>

              {/* 세 번째 줄 */}
              <div className="flex gap-2">
                {caddies.slice(4, 6).map((caddie) => (
                  <CaddieCard key={caddie.id} caddie={caddie} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
