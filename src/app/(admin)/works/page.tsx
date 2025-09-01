"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import { ConfirmationModal, Pagination } from "@/shared/components/ui";
import { PAGE_TITLES, useDocumentTitle } from "@/shared/hooks";
import { RoundingSettings, Work } from "@/modules/work/types";
import {
  useSpecialSchedule,
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

  const [isCreating, setIsCreating] = useState(false);

  // 특수 스케줄 상태
  const [selectedWorkId, setSelectedWorkId] = useState<string>("");

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

  // 특수 스케줄 훅
  const {
    specialSchedule,
    isLoading: isSpecialScheduleLoading,
    error: specialScheduleError,
    hasNoParts,
    hasNoTimeSettings,
    hasNoMatrix,
    refetch: refetchSpecialSchedule,
  } = useSpecialSchedule(selectedWorkId);

  // 행 클릭 핸들러 - 특수 스케줄 조회 또는 디테일 페이지로 이동
  const handleRowClick = (work: Work) => {
    if (work.isEmpty) {
      return;
    }

    // 특수 스케줄인 경우 API 호출
    if (work.scheduleType === "special") {
      setSelectedWorkId(work.id);
      // 특수 스케줄 상세 정보를 모달이나 사이드 패널로 표시할 수 있음
      return;
    }

    // 일반 스케줄인 경우 기존 로직
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
      await createWorkSchedule(
        selectedGolfCourseId,
        date,
        settings.timeUnit,
        settings.roundTimes.map((roundTime) => ({
          part_number: roundTime.round,
          name: `${roundTime.round}부`,
          start_time: roundTime.startTime,
          end_time: roundTime.endTime,
        }))
      );

      // 모달 닫기
      setIsRoundingSettingsModalOpen(false);

      // 성공 메시지 표시
      alert("근무표가 성공적으로 생성되었습니다.");

      // 화면 이동 대신 데이터 새로고침
      refetch();
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
              onClick={() => refetch()}
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

      {/* 특수 스케줄 상세 정보 */}
      {selectedWorkId && (
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              특수 스케줄 상세 정보
            </h3>
            <button
              onClick={() => setSelectedWorkId("")}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* 로딩 상태 */}
          {isSpecialScheduleLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">특수 스케줄을 불러오는 중...</div>
            </div>
          )}

          {/* 에러 상태 */}
          {specialScheduleError && (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">
                <p>특수 스케줄 조회에 실패했습니다.</p>
                <p className="text-sm mt-2">{specialScheduleError}</p>
                <button
                  onClick={refetchSpecialSchedule}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}

          {/* 특수 스케줄 데이터 */}
          {specialSchedule && !isSpecialScheduleLoading && (
            <div className="space-y-6">
              {/* 골프장 정보 */}
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">골프장:</div>
                <div className="font-medium">
                  {specialSchedule.golf_course.name}
                </div>
                <div className="text-sm text-gray-600">상태:</div>
                <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {specialSchedule.status}
                </div>
              </div>

              {/* 빈 데이터 상태 처리 */}
              {hasNoParts && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">시간표를 설정해주세요</p>
                  <p className="text-sm mt-2">
                    라운딩 설정을 먼저 완료해야 합니다.
                  </p>
                </div>
              )}

              {!hasNoParts && hasNoTimeSettings && (
                <div className="text-center py-8 text-orange-500">
                  <p className="text-lg">시간을 입력해주세요</p>
                  <p className="text-sm mt-2">부별 시간 설정이 필요합니다.</p>
                </div>
              )}

              {!hasNoParts && !hasNoTimeSettings && hasNoMatrix && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">설정 완료 후 배치 가능</p>
                  <p className="text-sm mt-2">
                    시간표 매트릭스가 생성되지 않았습니다.
                  </p>
                </div>
              )}

              {/* 정상 데이터 표시 */}
              {!hasNoParts && !hasNoTimeSettings && !hasNoMatrix && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    시간 간격: {specialSchedule.time_interval}분
                  </div>

                  {/* 부별 정보 */}
                  {specialSchedule.parts.map((part) => (
                    <div key={part.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <h4 className="font-medium">{part.name}</h4>
                        <span className="text-sm text-gray-500">
                          {part.start_time} - {part.end_time}
                        </span>
                        <span className="text-sm text-gray-500">
                          매트릭스: {part.schedule_matrix.length}개 시간대
                        </span>
                      </div>

                      {/* 간단한 매트릭스 미리보기 */}
                      {part.schedule_matrix.length > 0 && (
                        <div className="text-xs text-gray-400">
                          시간대: {part.schedule_matrix[0].time} ~{" "}
                          {
                            part.schedule_matrix[
                              part.schedule_matrix.length - 1
                            ].time
                          }
                        </div>
                      )}
                    </div>
                  ))}

                  {/* 사용 가능한 특수반 */}
                  {specialSchedule.available_special_groups.length > 0 && (
                    <div className="border-t pt-4">
                      <h5 className="font-medium mb-2">사용 가능한 특수반</h5>
                      <div className="flex flex-wrap gap-2">
                        {specialSchedule.available_special_groups.map(
                          (group) => (
                            <div
                              key={group.id}
                              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
                            >
                              {group.name} ({group.member_count}명)
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
      />
    </div>
  );
};

export default WorksPage;
