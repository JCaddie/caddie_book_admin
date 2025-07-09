"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { useWorkDetail } from "@/modules/work/hooks/use-work-detail";
import { useDateNavigation } from "@/modules/work/hooks/use-date-navigation";
import { usePersonnelFilter } from "@/modules/work/hooks/use-personnel-filter";
import { useResetModal } from "@/modules/work/hooks/use-reset-modal";
import { WorkDetailPageProps } from "@/modules/work/types/work-detail";
import {
  FIELDS,
  PERSONNEL_STATS,
  generateTimeSlots,
} from "@/modules/work/constants/work-detail";
import DateNavigation from "@/modules/work/components/date-navigation";
import WorkSchedule from "@/modules/work/components/work-schedule";
import PersonnelStatus from "@/modules/work/components/personnel-status";
import DeleteConfirmationModal from "@/shared/components/ui/delete-confirmation-modal";

export default function WorkDetailPage({
  params,
  searchParams,
}: WorkDetailPageProps) {
  const { id: golfCourseId } = use(params);
  const { date } = use(searchParams);

  // 커스텀 훅들 사용
  const { currentDate, handleDateChange } = useDateNavigation(
    golfCourseId,
    date
  );
  const { filters, filteredCaddies, updateFilter } = usePersonnelFilter();
  const { isResetModalOpen, openResetModal, closeResetModal, handleReset } =
    useResetModal(golfCourseId, currentDate);

  // TODO: 나중에 hook을 수정하여 golfCourseId와 date를 받도록 변경
  // 현재는 임시로 golfCourseId를 workId로 사용
  const { work } = useWorkDetail(golfCourseId);

  // 존재하지 않는 근무 정보인 경우
  if (!work) {
    notFound();
  }

  // 시간 슬롯 생성
  const timeSlots = generateTimeSlots();

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
      <DateNavigation
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />

      {/* 메인 콘텐츠 */}
      <div className="max-w-[1920px] mx-auto flex gap-8 p-6">
        {/* 왼쪽: 라운딩 관리 */}
        <WorkSchedule
          fields={FIELDS}
          timeSlots={timeSlots}
          personnelStats={PERSONNEL_STATS}
          onResetClick={openResetModal}
        />

        {/* 오른쪽: 인력 현황 사이드바 */}
        <PersonnelStatus
          filters={filters}
          filteredCaddies={filteredCaddies}
          onFilterUpdate={updateFilter}
        />
      </div>

      {/* 초기화 확인 모달 */}
      <DeleteConfirmationModal
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
