"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import { ConfirmationModal, Pagination } from "@/shared/components/ui";
import { PAGE_TITLES, useDocumentTitle } from "@/shared/hooks";
import { RoundingSettings, Work } from "@/modules/work/types";
import {
  useWorksData,
  useWorksDelete,
  useWorksSelection,
} from "@/modules/work/hooks";
import { WorksActionBar, WorksTable } from "@/modules/work/components";
import RoundingSettingsModal from "@/modules/work/components/rounding-settings-modal";
import { createWorkSchedule } from "@/modules/work/api";
import { useAuth } from "@/shared/hooks/use-auth";
import { useGolfCoursesSimple } from "@/modules/golf-course/hooks/use-golf-courses-simple";

const WorksPage: React.FC = () => {
  const router = useRouter();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: PAGE_TITLES.WORKS });

  // 권한 및 골프장 데이터
  const { user, hasRole } = useAuth();
  const { data: golfCoursesData, isLoading: isGolfCoursesLoading } =
    useGolfCoursesSimple();

  // 라운딩 설정 모달 상태
  const [isRoundingSettingsModalOpen, setIsRoundingSettingsModalOpen] =
    useState(false);
  const [selectedGolfCourseId, setSelectedGolfCourseId] = useState<string>("");
  const [selectedGolfCourseName, setSelectedGolfCourseName] =
    useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  // 커스텀 훅들 사용
  const {
    worksList,
    setWorksList,
    filteredWorks,
    currentData,
    totalPages,
    isLoading,
    error,
    refetch,
  } = useWorksData();

  const { selectedRowKeys, selectedRows, handleSelectChange, clearSelection } =
    useWorksSelection();

  const {
    isDeleteModalOpen,
    isDeleting,
    handleDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
  } = useWorksDelete(selectedRowKeys);

  // 행 클릭 핸들러 - 디테일 페이지로 이동
  const handleRowClick = (work: Work) => {
    if (work.isEmpty) {
      return;
    }

    // 날짜가 있는 경우에만 날짜 파라미터 추가
    let dateParam = "";
    if (work.date && work.date !== "미정") {
      // "YYYY.MM.DD" 형식을 "YYYY-MM-DD" 형식으로 변환
      const formattedDate = work.date
        .replace(/\s+/g, "") // 모든 공백 제거
        .replace(/\./g, "-") // 점을 하이픈으로 변환
        .replace(/-+$/, ""); // 끝에 있는 하이픈 제거
      dateParam = `?date=${formattedDate}`;
    }

    router.push(`/works/${work.golfCourseId}${dateParam}`);
  };

  // 생성 핸들러 - 라운딩 설정 모달 열기
  const handleCreate = () => {
    // 현재 날짜를 기본값으로 설정
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);

    // 권한에 따라 골프장 설정
    if (hasRole("MASTER")) {
      // MASTER: 골프장 선택 가능
      setSelectedGolfCourseId("");
      setSelectedGolfCourseName("");
    } else if (hasRole("ADMIN") && user?.golfCourseId) {
      // ADMIN: 고정된 골프장 사용
      setSelectedGolfCourseId(user.golfCourseId);
      // 골프장 이름은 API에서 가져온 데이터에서 찾기
      const golfCourse = golfCoursesData?.data.find(
        (gc) => gc.id === user.golfCourseId
      );
      setSelectedGolfCourseName(golfCourse?.name || "");
    }

    setIsRoundingSettingsModalOpen(true);
  };

  // 라운딩 설정 모달 핸들러
  const handleCloseRoundingSettings = () => {
    setIsRoundingSettingsModalOpen(false);
    setSelectedGolfCourseId("");
    setSelectedDate("");
  };

  const handleGolfCourseSelect = (golfCourseId: string) => {
    setSelectedGolfCourseId(golfCourseId);
    // API에서 가져온 골프장 데이터에서 이름 찾기
    const golfCourse = golfCoursesData?.data.find(
      (gc) => gc.id === golfCourseId
    );
    setSelectedGolfCourseName(golfCourse?.name || "");
  };

  const handleSaveRoundingSettings = async (
    settings: RoundingSettings,
    date: string
  ) => {
    try {
      setIsCreating(true);

      // 근무표 생성 API 호출
      const result = await createWorkSchedule(
        selectedGolfCourseId,
        date,
        settings.timeUnit,
        settings.roundTimes.map((roundTime) => ({
          part_number: roundTime.round,
          start_time: roundTime.startTime,
          end_time: roundTime.endTime,
        }))
      );

      // 모달 닫기
      setIsRoundingSettingsModalOpen(false);

      // 성공 메시지 표시
      alert("근무표가 성공적으로 생성되었습니다.");

      // 상세 페이지로 이동
      router.push(`/works/${result.golfCourseId}?date=${result.date}`);
    } catch (error) {
      console.error("근무표 생성 실패:", error);
      alert("근무표 생성에 실패했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  // 삭제 확인 핸들러
  const handleConfirmDeleteWrapper = () => {
    handleConfirmDelete(
      selectedRowKeys,
      selectedRows,
      worksList,
      setWorksList,
      clearSelection
    );
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      {/* 페이지 헤더 */}
      <AdminPageHeader title="근무" />

      {/* 상단 액션 바 */}
      <WorksActionBar
        totalCount={filteredWorks.length}
        selectedCount={selectedRowKeys.length}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">데이터를 불러오는 중...</div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">
            <p>데이터 로딩에 실패했습니다.</p>
            <p className="text-sm mt-2">{error}</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 테이블 */}
      {!isLoading && !error && (
        <WorksTable
          data={currentData}
          onRowClick={handleRowClick}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectChange}
          totalCount={filteredWorks.length}
        />
      )}

      {/* 페이지네이션 */}
      {!isLoading && !error && <Pagination totalPages={totalPages} />}

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteWrapper}
        title="삭제할까요?"
        message={`선택한 ${selectedRowKeys.length}개의 근무 스케줄을 삭제하시겠습니까?\n삭제 시 복원이 불가합니다.`}
        confirmText="삭제"
        cancelText="취소"
        isLoading={isDeleting}
      />

      {/* 라운딩 설정 모달 */}
      <RoundingSettingsModal
        isOpen={isRoundingSettingsModalOpen}
        onClose={handleCloseRoundingSettings}
        onSave={handleSaveRoundingSettings}
        isLoading={isCreating}
        showGolfCourseSelect={hasRole("MASTER")}
        onGolfCourseSelect={handleGolfCourseSelect}
        golfCourseName={selectedGolfCourseName}
        golfCourses={golfCoursesData?.data || []}
        isGolfCoursesLoading={isGolfCoursesLoading}
        initialDate={selectedDate}
      />
    </div>
  );
};

export default WorksPage;
