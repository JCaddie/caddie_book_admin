"use client";

import { notFound } from "next/navigation";
import { use, useState, useEffect, useCallback } from "react";
import { fetchWorkScheduleByDate } from "@/modules/work/api";
import { useDateNavigation } from "@/modules/work/hooks/use-date-navigation";
import { usePersonnelFilter } from "@/modules/work/hooks/use-personnel-filter";
import { useResetModal } from "@/modules/work/hooks/use-reset-modal";
import { CaddieData, WorkDetailPageProps } from "@/modules/work/types";
import {
  FIELDS,
  generateTimeSlots,
  PERSONNEL_STATS,
} from "@/modules/work/constants/work-detail";
import DateNavigation from "@/modules/work/components/date-navigation";
import WorkSchedule from "@/modules/work/components/work-schedule";
import PersonnelStatus from "@/modules/work/components/personnel-status";
import ConfirmationModal from "@/shared/components/ui/confirmation-modal";

export default function WorkDetailPage({
  params,
  searchParams,
}: WorkDetailPageProps) {
  const { id: golfCourseId } = use(params);
  const { date } = use(searchParams);

  // 드래그 상태 관리
  const [draggedCaddie, setDraggedCaddie] = useState<CaddieData | null>(null);

  // 커스텀 훅들 사용
  const { currentDate, handleDateChange } = useDateNavigation(
    golfCourseId,
    date
  );
  const { filters, filteredCaddies, updateFilter } = usePersonnelFilter();
  const { isResetModalOpen, openResetModal, closeResetModal, handleReset } =
    useResetModal();

  // 골프장 정보 (임시로 하드코딩, 실제로는 API에서 가져와야 함)
  const work = {
    id: golfCourseId,
    golfCourse: "골든베이 골프장",
    golfCourseId: golfCourseId,
  };
  const isLoading = false;
  const error = null;

  // 근무표 데이터 상태
  const [scheduleData, setScheduleData] = useState<{
    date: string;
    golfCourseId: string;
    schedules: Array<{
      id: string;
      golfCourse: string;
      golfCourseName: string;
      scheduleType: string;
      date: string;
      totalStaff: number;
      availableStaff: number;
      status: string;
      createdBy: string;
      createdByName: string;
      partsCount: number;
      timeInterval: number;
      createdAt: string;
      updatedAt: string;
    }>;
    scheduleParts: Array<{
      scheduleId: string;
      partNumber: number;
      startTime: string;
      endTime: string;
    }>;
  } | null>(null);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  // 근무표 데이터 조회
  const fetchScheduleData = useCallback(async () => {
    try {
      setIsScheduleLoading(true);
      setScheduleError(null);
      const data = await fetchWorkScheduleByDate(
        currentDate.toISOString().split("T")[0],
        golfCourseId
      );
      setScheduleData(data);
    } catch (error) {
      console.error("근무표 조회 실패:", error);
      setScheduleError("근무표 조회에 실패했습니다.");
    } finally {
      setIsScheduleLoading(false);
    }
  }, [currentDate, golfCourseId]);

  // 날짜 변경 시 근무표 데이터 조회
  useEffect(() => {
    if (golfCourseId) {
      fetchScheduleData();
    }
  }, [fetchScheduleData]);

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러가 있는 경우
  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">
            <p>데이터 로딩에 실패했습니다.</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 존재하지 않는 근무 정보인 경우
  if (!work) {
    notFound();
  }

  // 시간 슬롯 생성 (API 데이터 기반 또는 기본값)
  const timeSlots = scheduleData?.scheduleParts.length
    ? (() => {
        const result: any = {};
        scheduleData.scheduleParts.forEach((part) => {
          const partKey = `part${part.partNumber}` as keyof typeof result;
          const slots: string[] = [];
          const currentTime = new Date(`2000-01-01T${part.startTime}`);
          const endTime = new Date(`2000-01-01T${part.endTime}`);
          let tempTime = new Date(currentTime);

          while (tempTime < endTime) {
            slots.push(tempTime.toTimeString().slice(0, 5));
            tempTime.setMinutes(
              tempTime.getMinutes() +
                (scheduleData.schedules[0]?.timeInterval || 10)
            );
          }
          result[partKey] = slots;
        });
        return result;
      })()
    : generateTimeSlots();

  // 공통 드래그 이벤트 핸들러
  const handleDragStart = (caddie: CaddieData) => {
    setDraggedCaddie(caddie);
  };

  const handleDragEnd = () => {
    setDraggedCaddie(null);
  };

  // 채우기 핸들러
  const handleFill = () => {
    // TODO: 자동 채우기 로직 구현
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      {/* 최상단 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">제이캐디아카데미</h1>
      </div>

      {/* 날짜 네비게이션 및 검색 섹션 */}
      <DateNavigation
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />

      {/* 부 정보 표시 */}
      {scheduleData?.scheduleParts.length && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">부 정보:</span>
          <div className="flex gap-3">
            {scheduleData.scheduleParts.map((part) => (
              <span
                key={part.partNumber}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium"
              >
                {part.partNumber}부 {part.startTime} ~ {part.endTime}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex gap-8">
        {/* 왼쪽: 라운딩 관리 */}
        <WorkSchedule
          fields={FIELDS}
          timeSlots={timeSlots}
          personnelStats={
            scheduleData?.schedules[0]
              ? {
                  total: scheduleData.schedules[0].totalStaff,
                  available: scheduleData.schedules[0].availableStaff,
                }
              : PERSONNEL_STATS
          }
          draggedCaddie={draggedCaddie}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onFillClick={handleFill}
          onResetClick={openResetModal}
        />

        {/* 오른쪽: 인력 현황 사이드바 */}
        <PersonnelStatus
          filters={filters}
          filteredCaddies={filteredCaddies}
          onFilterUpdate={updateFilter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggedCaddie={draggedCaddie}
        />
      </div>

      {/* 초기화 확인 모달 */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={closeResetModal}
        onConfirm={handleReset}
        title="초기화 하시겠습니까?"
        message="초기화 시 모든 배치 정보가 삭제됩니다."
        confirmText="초기화"
        cancelText="취소"
      />
    </div>
  );
}
