"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button, SearchWithButton } from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle } from "@/shared/hooks";
import { Plus } from "lucide-react";
import {
  EmptyGroupsState,
  GroupCreateModal,
  GroupSection,
} from "@/modules/group";
import { getGolfCourseGroupDetail } from "@/modules/golf-course/api/golf-course-api";
import { GolfCourseGroupDetailResponse } from "@/modules/golf-course/types/golf-course";
import { getCaddieAssignmentOverview } from "@/modules/user/api/user-api";
import {
  CaddieAssignmentOverviewResponse,
  Group,
  UnassignedCaddie,
} from "@/modules/user/types/user";
import { CaddieCard } from "@/modules/work/components";
import { CaddieData } from "@/modules/work/types";
import {
  assignPrimaryGroup,
  removePrimaryGroup,
  reorderPrimaryGroup,
} from "@/modules/group/api/group-api";

interface GroupManagementPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Group을 CaddieGroupManagement 형식으로 변환하는 함수
const transformGroupToGroupSection = (group: Group) => ({
  id: group.id.toString(),
  name: group.name,
  memberCount: group.member_count,
  caddies: group.members.map((member) => ({
    id: parseInt(member.id),
    originalId: member.id, // 원본 UUID string 보존
    name: member.name,
    group: group.id,
    badge: member.is_team_leader ? "팀장" : "캐디",
    status: "active",
    specialBadge: member.is_team_leader ? "팀장" : undefined,
    order: member.order,
    groupName: group.name,
  })),
});

// UnassignedCaddie를 CaddieData 형식으로 변환하는 함수
const transformUnassignedCaddieToCaddieData = (
  caddie: UnassignedCaddie
): CaddieData => {
  return {
    id: parseInt(caddie.id),
    originalId: caddie.id, // 원본 UUID string 보존
    name: caddie.name,
    group: 0, // 미배정
    badge: "일반",
    status: "active",
    specialBadge: undefined,
    order: 1,
    groupName: undefined,
  };
};

const GroupManagementPage: React.FC<GroupManagementPageProps> = ({
  params,
}) => {
  const { id } = React.use(params);

  // "me"인 경우 현재 사용자의 골프장 ID 사용, 아니면 전달받은 ID 사용
  const isOwnGolfCourse = id === "me";

  // 상태 관리
  const [data, setData] = useState<GolfCourseGroupDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 캐디 배정 데이터 상태
  const [assignmentData, setAssignmentData] =
    useState<CaddieAssignmentOverviewResponse | null>(null);
  const [caddieLoading, setCaddieLoading] = useState(true);
  const [caddieError, setCaddieError] = useState<string | null>(null);

  // 모달 상태
  const [isGroupCreateModalOpen, setIsGroupCreateModalOpen] = useState(false);

  // 드래그 앤 드롭 상태
  const [draggedCaddie, setDraggedCaddie] = useState<CaddieData | null>(null);

  // 페이지 타이틀 설정
  const pageTitle = isOwnGolfCourse
    ? "내 골프장 그룹현황"
    : data?.golf_course.name
    ? `${data.golf_course.name} 그룹현황`
    : "그룹현황";
  useDocumentTitle({ title: pageTitle });

  // 골프장 그룹 데이터 로드 함수
  const loadData = useCallback(async () => {
    if (isOwnGolfCourse) {
      // TODO: 현재 사용자의 골프장 ID를 가져오는 로직 필요
      console.log("현재 사용자의 골프장 정보 로드");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getGolfCourseGroupDetail(id);
      setData(response);
    } catch (err) {
      console.error("골프장 그룹 상세 조회 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [id, isOwnGolfCourse]);

  // 캐디 배정 데이터 로드 함수
  const loadCaddieAssignments = useCallback(async () => {
    setCaddieLoading(true);
    setCaddieError(null);

    try {
      // MASTER 권한일 때는 golf_course_id 파라미터 전달
      const golfCourseId = isOwnGolfCourse ? undefined : id;
      const response = await getCaddieAssignmentOverview(golfCourseId);
      setAssignmentData(response);
    } catch (err) {
      console.error("캐디 배정 정보 조회 실패:", err);
      setCaddieError("캐디 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setCaddieLoading(false);
    }
  }, [id, isOwnGolfCourse]);

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
    loadCaddieAssignments();
  }, [id, loadData, loadCaddieAssignments]);

  // 모달 제어 함수들
  const openGroupCreateModal = () => setIsGroupCreateModalOpen(true);
  const closeGroupCreateModal = () => setIsGroupCreateModalOpen(false);

  const handleGroupCreateSuccess = async () => {
    // 그룹 생성 완료 후 데이터 다시 로드
    await loadData();
  };

  // 드래그 앤 드롭 핸들러들 (API 연동)
  const handleDragStart = (caddie: CaddieData, groupId: string) => {
    console.log("드래그 시작", caddie, groupId);
    setDraggedCaddie(caddie);
  };

  const handleDragEnd = () => {
    console.log("드래그 종료");
    setDraggedCaddie(null);
  };

  const handleDrop = async (targetGroupId: string, insertIndex?: number) => {
    try {
      console.log("드롭", targetGroupId, insertIndex);
      console.log("드래그된 캐디:", draggedCaddie);

      if (draggedCaddie) {
        if (targetGroupId === "unassigned") {
          // 캐디 배정 해제 (빈 영역으로 드래그)
          const currentGroupId = draggedCaddie.group;
          if (currentGroupId > 0 && draggedCaddie.originalId) {
            console.log("배정 해제 요청:", {
              groupId: currentGroupId,
              caddie_ids: [draggedCaddie.originalId],
            });
            await removePrimaryGroup(currentGroupId, {
              caddie_ids: [draggedCaddie.originalId],
            });
          }
        } else {
          const targetGroupIdNum = parseInt(targetGroupId);

          // 같은 그룹 내에서 순서 변경인지 확인
          if (draggedCaddie.group === targetGroupIdNum) {
            // 같은 그룹 내 순서 변경
            if (draggedCaddie.originalId && insertIndex !== undefined) {
              // 현재 위치와 목표 위치가 다를 때만 순서 변경
              if (draggedCaddie.currentIndex !== insertIndex) {
                console.log("순서 변경 요청:", {
                  groupId: targetGroupIdNum,
                  caddie_id: draggedCaddie.originalId,
                  currentIndex: draggedCaddie.currentIndex,
                  newIndex: insertIndex,
                  new_order: insertIndex + 1, // insertIndex는 0부터 시작하므로 +1
                });
                await reorderPrimaryGroup(targetGroupIdNum, {
                  reorders: [
                    {
                      caddie_id: draggedCaddie.originalId,
                      new_order: insertIndex + 1,
                    },
                  ],
                });
              }
            }
          } else {
            // 다른 그룹으로 이동
            if (draggedCaddie.originalId) {
              console.log("배정 요청:", {
                groupId: targetGroupIdNum,
                caddie_ids: [draggedCaddie.originalId],
                orders: [insertIndex ? insertIndex + 1 : 1],
              });
              await assignPrimaryGroup(targetGroupIdNum, {
                caddie_ids: [draggedCaddie.originalId],
                orders: [insertIndex ? insertIndex + 1 : 1],
              });
            }
          }
        }

        // 데이터 새로고침
        await loadData();
        await loadCaddieAssignments();
      }
    } catch (error) {
      console.error("캐디 그룹 배정/해제/순서 변경 실패:", error);
    } finally {
      setDraggedCaddie(null);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <AdminPageHeader title={pageTitle} />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <AdminPageHeader title={pageTitle} />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!data) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <AdminPageHeader title={pageTitle} />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">데이터가 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <AdminPageHeader title={pageTitle} />
        <div className="flex items-center gap-2">
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-white flex items-center gap-1"
            onClick={openGroupCreateModal}
          >
            <Plus className="w-4 h-4" />
            그룹 생성
          </Button>
        </div>
      </div>

      {/* 골프장 정보 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {data.golf_course.name}
            </h2>
            <p className="text-sm text-gray-600">{data.golf_course.address}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">계약상태</div>
            <div
              className={`text-sm font-medium ${
                data.golf_course.contract_status === "active"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {data.golf_course.contract_status === "active"
                ? "활성"
                : "비활성"}
            </div>
          </div>
        </div>
      </div>

      {/* 그룹 요약 정보 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600">주그룹</div>
          <div className="text-2xl font-bold text-blue-900">
            {data.group_summary.primary_group_count}조
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600">총 캐디수</div>
          <div className="text-2xl font-bold text-green-900">
            {data.caddie_summary.total_caddies}명
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex gap-8">
        {/* 왼쪽: 그룹 관리 */}
        <div className="w-[calc(3*320px+2*16px)]">
          {!assignmentData || assignmentData.groups.length === 0 ? (
            <EmptyGroupsState onCreateGroup={openGroupCreateModal} />
          ) : (
            <>
              {/* 필터 및 액션바 */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      총 {assignmentData.summary.total_assigned_caddies}명
                    </span>
                  </div>

                  {/* 검색창 */}
                  <SearchWithButton placeholder="캐디 검색" />
                </div>
              </div>

              {/* 그룹들 - 최대 3개 고정 너비 + 스크롤 */}
              <div className="overflow-x-auto">
                <div
                  className="flex gap-4"
                  style={{ width: "max-content", minWidth: "100%" }}
                >
                  {assignmentData.groups
                    .sort((a, b) => a.order - b.order)
                    .map((group) => (
                      <div key={group.id} className="w-80 flex-shrink-0">
                        <GroupSection
                          group={transformGroupToGroupSection(group)}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onDrop={handleDrop}
                          draggedCaddie={draggedCaddie}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 오른쪽: 캐디 현황 */}
        <div className="w-96">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              캐디 현황
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">전체 캐디</span>
                <span className="text-sm font-medium">
                  {(assignmentData?.summary.total_assigned_caddies || 0) +
                    (assignmentData?.summary.total_unassigned_caddies || 0)}
                  명
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">배정된 캐디</span>
                <span className="text-sm font-medium">
                  {assignmentData?.summary.total_assigned_caddies || 0}명
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">미배정 캐디</span>
                <span className="text-sm font-medium">
                  {assignmentData?.summary.total_unassigned_caddies || 0}명
                </span>
              </div>
            </div>
          </div>

          {/* 캐디 카드들 */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-900">캐디 목록</h4>
            {caddieLoading ? (
              <div className="text-sm text-gray-500">
                캐디 정보를 불러오는 중...
              </div>
            ) : caddieError ? (
              <div className="text-sm text-red-500">{caddieError}</div>
            ) : !assignmentData ||
              assignmentData.unassigned_caddies.length === 0 ? (
              <div className="text-sm text-gray-500">
                미배정 캐디가 없습니다.
              </div>
            ) : (
              <div
                className="space-y-2 min-h-[200px] p-2 border-2 border-dashed border-gray-300 rounded-lg"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={() => handleDrop("unassigned")}
              >
                <div className="text-xs text-gray-500 mb-2 text-center">
                  캐디를 여기로 드래그하여 배정 해제
                </div>
                {assignmentData.unassigned_caddies
                  .map((caddie) =>
                    transformUnassignedCaddieToCaddieData(caddie)
                  )
                  .map((caddieData) => (
                    <div
                      key={caddieData.originalId}
                      draggable
                      onDragStart={() => handleDragStart(caddieData, "")}
                      onDragEnd={handleDragEnd}
                      className={`cursor-move ${
                        draggedCaddie?.id === caddieData.id ? "opacity-50" : ""
                      }`}
                    >
                      <CaddieCard caddie={caddieData} />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 그룹 생성 모달 */}
      <GroupCreateModal
        isOpen={isGroupCreateModalOpen}
        onClose={closeGroupCreateModal}
        onSuccess={handleGroupCreateSuccess}
        golfCourseId={isOwnGolfCourse ? undefined : id} // MASTER일 때는 URL의 ID, ADMIN일 때는 undefined (자신의 골프장 ID 사용)
      />
    </div>
  );
};

export default GroupManagementPage;
