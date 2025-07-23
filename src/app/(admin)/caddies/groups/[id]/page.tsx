"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle } from "@/shared/hooks";
import { Plus } from "lucide-react";
import { GroupCreateModal } from "@/modules/group";
import { GolfCourseInfo } from "@/modules/group/components/golf-course-info";
import { GroupSummary } from "@/modules/group/components/group-summary";
import { CaddieStatusPanel } from "@/modules/group/components/caddie-status-panel";
import { UnassignedCaddieList } from "@/modules/group/components/unassigned-caddie-list";
import { GroupManagementArea } from "@/modules/group/components/group-management-area";
import { getGolfCourseGroupDetail } from "@/modules/golf-course/api/golf-course-api";
import { GolfCourseGroupDetailResponse } from "@/modules/golf-course/types/golf-course";
import { getCaddieAssignmentOverview } from "@/modules/user/api/user-api";
import {
  CaddieAssignmentOverviewResponse,
  Group,
  UnassignedCaddie,
} from "@/modules/user/types/user";

import { CaddieData } from "@/modules/work/types";
import {
  assignPrimaryGroup,
  deleteGroup,
  removePrimaryGroup,
  reorderPrimaryGroup,
  updateGroup,
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
    await loadCaddieAssignments();
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
            if (draggedCaddie.originalId) {
              // insertIndex가 undefined이면 마지막 위치로 이동
              const newIndex =
                insertIndex !== undefined
                  ? insertIndex
                  : assignmentData?.groups.find(
                      (g) => g.id === targetGroupIdNum
                    )?.member_count || 0;
              const newOrder = newIndex + 1;

              // 현재 위치와 목표 위치가 다를 때만 순서 변경
              if (draggedCaddie.currentIndex !== newIndex) {
                console.log("순서 변경 요청:", {
                  groupId: targetGroupIdNum,
                  caddie_id: draggedCaddie.originalId,
                  currentIndex: draggedCaddie.currentIndex,
                  newIndex: newIndex,
                  new_order: newOrder,
                });
                await reorderPrimaryGroup(targetGroupIdNum, {
                  reorders: [
                    {
                      caddie_id: draggedCaddie.originalId,
                      new_order: newOrder,
                    },
                  ],
                });
              }
            }
          } else {
            // 다른 그룹으로 이동
            if (draggedCaddie.originalId) {
              // insertIndex가 undefined이면 마지막 위치로 이동
              const newIndex =
                insertIndex !== undefined
                  ? insertIndex
                  : assignmentData?.groups.find(
                      (g) => g.id === targetGroupIdNum
                    )?.member_count || 0;
              const newOrder = newIndex + 1;

              console.log("배정 요청:", {
                groupId: targetGroupIdNum,
                caddie_ids: [draggedCaddie.originalId],
                orders: [newOrder],
              });
              await assignPrimaryGroup(targetGroupIdNum, {
                caddie_ids: [draggedCaddie.originalId],
                orders: [newOrder],
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

  // 그룹 수정 핸들러
  const handleEditGroup = async (groupId: string, newName: string) => {
    try {
      console.log("그룹 수정 요청:", { groupId, newName });
      await updateGroup(parseInt(groupId), { name: newName });

      // 데이터 새로고침
      await loadData();
      await loadCaddieAssignments();
    } catch (error) {
      console.error("그룹 수정 실패:", error);
      alert("그룹명 수정에 실패했습니다.");
    }
  };

  // 그룹 삭제 핸들러
  const handleDeleteGroup = async (groupId: string) => {
    try {
      console.log("그룹 삭제 요청:", { groupId });
      await deleteGroup(parseInt(groupId));

      // 데이터 새로고침
      await loadData();
      await loadCaddieAssignments();
    } catch (error) {
      console.error("그룹 삭제 실패:", error);
      alert("그룹 삭제에 실패했습니다.");
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
      <GolfCourseInfo
        name={data.golf_course.name}
        address={data.golf_course.address}
        contractStatus={data.golf_course.contract_status}
      />

      {/* 그룹 요약 정보 */}
      <GroupSummary
        primaryGroupCount={data.group_summary.primary_group_count}
        totalCaddies={data.caddie_summary.total_caddies}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex gap-8">
        {/* 왼쪽: 그룹 관리 */}
        <div className="w-[calc(3*320px+2*16px)]">
          <GroupManagementArea
            groups={assignmentData?.groups || []}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            draggedCaddie={draggedCaddie}
            onCreateGroup={openGroupCreateModal}
            transformGroupToGroupSection={transformGroupToGroupSection}
            onEditGroup={handleEditGroup}
            onDeleteGroup={handleDeleteGroup}
          />
        </div>

        {/* 오른쪽: 캐디 현황 */}
        <div className="w-96">
          <CaddieStatusPanel
            totalAssignedCaddies={
              assignmentData?.summary.total_assigned_caddies || 0
            }
            totalUnassignedCaddies={
              assignmentData?.summary.total_unassigned_caddies || 0
            }
          />

          {/* 캐디 목록 */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-900">캐디 목록</h4>
            <UnassignedCaddieList
              unassignedCaddies={assignmentData?.unassigned_caddies || []}
              isLoading={caddieLoading}
              error={caddieError}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              draggedCaddie={draggedCaddie}
              transformUnassignedCaddieToCaddieData={
                transformUnassignedCaddieToCaddieData
              }
            />
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
