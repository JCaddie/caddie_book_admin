"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useAuth, useDocumentTitle } from "@/shared/hooks";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { GroupCreateModal, GroupTypeToggle } from "@/modules/group";
import { GolfCourseInfo } from "@/modules/group/components/golf-course-info";
import { GroupSummary } from "@/modules/group/components/group-summary";
import { CaddieStatusPanel } from "@/modules/group/components/caddie-status-panel";
import { UnassignedCaddieList } from "@/modules/group/components/unassigned-caddie-list";
import { GroupManagementArea } from "@/modules/group/components/group-management-area";
import type { GroupType } from "@/modules/group/components/group-type-toggle";
import { fetchGolfCourseGroupDetail } from "@/modules/golf-course/api/golf-course-api";
import { GolfCourseGroupDetailResponse } from "@/modules/golf-course/types/golf-course";
import {
  CaddieAssignmentOverviewResponse,
  Group,
  UnassignedCaddie,
} from "@/modules/user/types/user";

import { CaddieData } from "@/modules/work/types";
import {
  addGroupMember,
  deleteGroup,
  getGolfCourseGroupStatus,
  removeGroupMember,
  reorderGroupMember,
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
    group: parseInt(group.id),
    badge: member.is_team_leader ? "팀장" : "캐디",
    status: "active",
    specialBadge: member.is_team_leader ? "팀장" : undefined,
    order: member.group_order, // group_order 필드 사용
    groupName: group.name,
  })),
});

// UnassignedCaddie를 CaddieData 형식으로 변환하는 함수
const transformUnassignedCaddieToCaddieData = (
  caddie: UnassignedCaddie,
  index?: number
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
    currentIndex: index, // 미배정 캐디 목록에서의 인덱스
  };
};

const GroupManagementPage: React.FC<GroupManagementPageProps> = ({
  params,
}) => {
  const { id } = React.use(params);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // "me"인 경우 현재 사용자의 골프장 ID 사용, 아니면 전달받은 ID 사용
  const isOwnGolfCourse = id === "me";

  // 상태 관리
  const [data, setData] = useState<GolfCourseGroupDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 캐디 배정 데이터 상태 (안전한 초기값 제공)
  const [assignmentData, setAssignmentData] =
    useState<CaddieAssignmentOverviewResponse | null>({
      success: true,
      message: "",
      data: {
        id: "",
        name: "로딩 중...",
        contract_status: "",
        primary_group_count: 0,
        total_caddies: 0,
        grouped_caddies_count: 0,
        ungrouped_caddies_count: 0,
        primary_groups: [],
        ungrouped_caddies: [],
      },
    });
  const [caddieLoading, setCaddieLoading] = useState(true);
  const [caddieError, setCaddieError] = useState<string | null>(null);

  // 모달 상태
  const [isGroupCreateModalOpen, setIsGroupCreateModalOpen] = useState(false);

  // URL 파라미터에서 그룹 타입 읽기 (기본값: PRIMARY)
  const urlGroupType = searchParams.get("type");
  const selectedGroupType: GroupType =
    urlGroupType === "SPECIAL" ? "SPECIAL" : "PRIMARY";

  // 드래그 앤 드롭 상태
  const [draggedCaddie, setDraggedCaddie] = useState<CaddieData | null>(null);

  // 페이지 타이틀 설정
  const pageTitle = isOwnGolfCourse
    ? "내 골프장 그룹현황"
    : data?.data.name
    ? `${data.data.name} 그룹현황`
    : "그룹현황";
  useDocumentTitle({ title: pageTitle });

  // 골프장 그룹 데이터 로드 함수
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isOwnGolfCourse) {
        // 현재 사용자의 골프장 ID를 사용
        if (user?.golfCourseId) {
          console.log("현재 사용자의 골프장 정보 로드:", user.golfCourseId);
          const response = await fetchGolfCourseGroupDetail(user.golfCourseId);
          setData(response);
        } else {
          setError("현재 사용자에게 할당된 골프장이 없습니다.");
        }
      } else {
        // 전달받은 ID로 골프장 정보 조회
        const response = await fetchGolfCourseGroupDetail(id);
        setData(response);
      }
    } catch (err) {
      console.error("골프장 그룹 상세 조회 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [id, isOwnGolfCourse, user?.golfCourseId]);

  // 캐디 배정 데이터 로드 함수
  const loadCaddieAssignments = useCallback(async () => {
    setCaddieLoading(true);
    setCaddieError(null);

    try {
      let golfCourseId: string | undefined;

      if (isOwnGolfCourse) {
        // 현재 사용자의 골프장 ID를 사용
        golfCourseId = user?.golfCourseId;

        // golfCourseId가 없으면 에러 처리
        if (!golfCourseId) {
          setCaddieError("현재 사용자에게 할당된 골프장이 없습니다.");
          // 임시 빈 데이터로 설정
          setAssignmentData({
            success: false,
            message: "골프장 정보 없음",
            data: {
              id: user?.golfCourseId || "unknown",
              name: "데이터 로딩 중...",
              contract_status: "",
              primary_group_count: 0,
              total_caddies: 0,
              grouped_caddies_count: 0,
              ungrouped_caddies_count: 0,
              primary_groups: [],
              ungrouped_caddies: [],
            },
          });
          return;
        }
      } else {
        // 전달받은 ID 사용
        golfCourseId = id;
      }

      const response = await getGolfCourseGroupStatus(
        golfCourseId,
        selectedGroupType
      );
      setAssignmentData(response);
    } catch (err) {
      console.error("캐디 배정 정보 조회 실패:", err);
      setCaddieError("캐디 정보를 불러오는 중 오류가 발생했습니다.");
      // 오류 발생 시 임시 빈 데이터로 설정하여 화면이 깨지지 않도록 함
      setAssignmentData({
        success: false,
        message: "오류 발생",
        data: {
          id: id || "unknown",
          name: "오류 발생으로 인한 임시 데이터",
          contract_status: "UNKNOWN",
          primary_group_count: 0,
          total_caddies: 0,
          grouped_caddies_count: 0,
          ungrouped_caddies_count: 0,
          primary_groups: [],
          ungrouped_caddies: [],
        },
      });
    } finally {
      setCaddieLoading(false);
    }
  }, [id, isOwnGolfCourse, user?.golfCourseId, selectedGroupType]);

  // 초기 데이터 로드
  useEffect(() => {
    // 인증 로딩 중이면 대기
    if (authLoading) return;

    // me 파라미터일 때는 사용자 정보가 로드된 후에 데이터 로드
    if (isOwnGolfCourse) {
      if (user) {
        loadData();
        loadCaddieAssignments();
      }
    } else {
      // 일반 ID일 때는 즉시 로드
      loadData();
      loadCaddieAssignments();
    }
  }, [id, loadData, loadCaddieAssignments, isOwnGolfCourse, user, authLoading]);

  // 모달 제어 함수들
  const openGroupCreateModal = () => setIsGroupCreateModalOpen(true);
  const closeGroupCreateModal = () => setIsGroupCreateModalOpen(false);

  const handleGroupCreateSuccess = async () => {
    // 그룹 생성 완료 후 데이터 다시 로드
    await loadData();
    await loadCaddieAssignments();
  };

  // 그룹 타입 변경 핸들러
  const handleGroupTypeChange = (newGroupType: GroupType) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newGroupType === "PRIMARY") {
      // PRIMARY는 기본값이므로 파라미터 제거
      params.delete("type");
    } else {
      params.set("type", newGroupType);
    }

    // URL 업데이트 (페이지 새로고침 없이)
    router.push(`?${params.toString()}`);
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
      console.log("드롭 요청:", {
        targetGroupId,
        insertIndex,
        draggedCaddieGroup: draggedCaddie?.group,
        draggedCaddieCurrentIndex: draggedCaddie?.currentIndex,
      });

      if (!draggedCaddie || !draggedCaddie.originalId) {
        console.log("드래그된 캐디 정보가 없습니다.");
        return;
      }

      if (targetGroupId === "unassigned") {
        // 캐디 배정 해제 (미배정 영역으로 드래그)
        const currentGroupId = draggedCaddie.group;
        if (currentGroupId > 0) {
          console.log("배정 해제 요청:", {
            groupId: currentGroupId,
            user_id: draggedCaddie.originalId,
          });
          await removeGroupMember(currentGroupId.toString(), {
            user_id: draggedCaddie.originalId,
          });
        }
      } else {
        const targetGroupIdStr = targetGroupId;
        const targetGroupIdNum = parseInt(targetGroupIdStr);
        const currentGroupId = draggedCaddie.group;

        // 드롭 인덱스 결정 (기본값: 마지막 위치)
        const currentGroups =
          selectedGroupType === "SPECIAL"
            ? assignmentData?.data?.special_groups || []
            : assignmentData?.data?.primary_groups || [];

        const dropIndex =
          insertIndex !== undefined
            ? insertIndex
            : currentGroups.find((g) => g.id.toString() === targetGroupIdStr)
                ?.member_count || 0;

        // order는 1부터 시작
        const newOrder = dropIndex + 1;

        if (currentGroupId === targetGroupIdNum && currentGroupId > 0) {
          // 같은 그룹 내에서 순서 변경
          const currentIndex = draggedCaddie.currentIndex || 0;

          // 현재 위치와 목표 위치가 다를 때만 순서 변경
          if (currentIndex !== dropIndex) {
            console.log("순서 변경 요청:", {
              groupId: targetGroupIdStr,
              user_id: draggedCaddie.originalId,
              currentIndex,
              newIndex: dropIndex,
              order: newOrder,
            });

            await reorderGroupMember(targetGroupIdStr, {
              user_id: draggedCaddie.originalId,
              order: newOrder,
            });
          }
        } else {
          // 다른 그룹으로 이동 또는 미배정 캐디를 그룹에 배정
          console.log("배정 요청:", {
            groupId: targetGroupIdStr,
            user_id: draggedCaddie.originalId,
            order: newOrder,
            membership_type: selectedGroupType,
            isFromUnassigned: currentGroupId === 0,
          });

          await addGroupMember(targetGroupIdStr, {
            user_id: draggedCaddie.originalId,
            order: newOrder,
            membership_type: selectedGroupType,
          });
        }
      }

      // 데이터 새로고침
      await loadData();
      await loadCaddieAssignments();
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

  // 캐디를 그룹에 추가하는 핸들러
  const handleAddCaddieToGroup = async (groupId: string, caddieId: string) => {
    try {
      console.log("캐디 그룹 추가 요청:", { groupId, caddieId });

      // 현재 그룹의 멤버 수를 기반으로 order 계산 (마지막 위치에 추가)
      const currentGroups =
        selectedGroupType === "SPECIAL"
          ? assignmentData?.data?.special_groups || []
          : assignmentData?.data?.primary_groups || [];

      const targetGroup = currentGroups.find(
        (g) => g.id.toString() === groupId
      );
      const newOrder = (targetGroup?.member_count || 0) + 1;

      await addGroupMember(groupId, {
        user_id: caddieId,
        order: newOrder,
        membership_type: selectedGroupType,
      });

      // 데이터 새로고침
      await loadData();
      await loadCaddieAssignments();
    } catch (error) {
      console.error("캐디 그룹 추가 실패:", error);
      alert("캐디 추가에 실패했습니다.");
      throw error; // 에러를 다시 throw하여 UI에서 처리할 수 있도록 함
    }
  };

  // 로딩 상태
  if (authLoading || loading) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <AdminPageHeader title={pageTitle} />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">
            {authLoading
              ? "사용자 정보를 불러오는 중..."
              : "데이터를 불러오는 중..."}
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 - 캐디 정보만 오류가 있어도 전체 화면을 보여주도록 수정
  if (error && !data) {
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
        name={assignmentData?.data?.name || "골프장 정보 로딩 중..."}
        address={assignmentData?.data?.contract_status || "상태 정보 없음"}
        contractStatus={assignmentData?.data?.contract_status || "UNKNOWN"}
      />

      {/* 그룹 요약 정보 */}
      <GroupSummary
        primaryGroupCount={
          selectedGroupType === "SPECIAL"
            ? assignmentData?.data?.special_group_count ?? 0
            : assignmentData?.data?.primary_group_count ?? 0
        }
        totalCaddies={assignmentData?.data?.total_caddies ?? 0}
        groupType={selectedGroupType}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex gap-8">
        {/* 왼쪽: 그룹 관리 */}
        <div className="w-[calc(3*320px+2*16px)]">
          {error && (
            <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ 골프장 데이터 로딩 중 오류: {error}
              </p>
            </div>
          )}
          <GroupManagementArea
            groups={
              selectedGroupType === "SPECIAL"
                ? assignmentData?.data?.special_groups || []
                : assignmentData?.data?.primary_groups || []
            }
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            draggedCaddie={draggedCaddie}
            onCreateGroup={openGroupCreateModal}
            transformGroupToGroupSection={transformGroupToGroupSection}
            onEditGroup={handleEditGroup}
            onDeleteGroup={handleDeleteGroup}
            unassignedCaddies={assignmentData?.data?.ungrouped_caddies || []}
            onAddCaddieToGroup={handleAddCaddieToGroup}
          />
        </div>

        {/* 오른쪽: 캐디 현황 */}
        <div className="w-96">
          {/* 그룹 타입 선택 */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              그룹 타입
            </h4>
            <GroupTypeToggle
              value={selectedGroupType}
              onChange={handleGroupTypeChange}
              disabled={caddieLoading}
            />
          </div>

          <CaddieStatusPanel
            totalAssignedCaddies={
              assignmentData?.data?.grouped_caddies_count ?? 0
            }
            totalUnassignedCaddies={
              assignmentData?.data?.ungrouped_caddies_count ?? 0
            }
          />

          {/* 캐디 목록 */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-900">캐디 목록</h4>
            {caddieError && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">⚠️ {caddieError}</p>
                <p className="text-xs text-yellow-600 mt-1">
                  임시 데이터로 화면을 표시합니다. API 업데이트 후 다시
                  시도해주세요.
                </p>
              </div>
            )}
            <UnassignedCaddieList
              unassignedCaddies={assignmentData?.data?.ungrouped_caddies || []}
              isLoading={caddieLoading}
              error={null} // 에러는 위에서 별도로 표시하므로 null로 설정
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              draggedCaddie={draggedCaddie}
              transformUnassignedCaddieToCaddieData={(caddie, index) =>
                transformUnassignedCaddieToCaddieData(caddie, index)
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
        golfCourseInfo={{
          name: assignmentData?.data?.name || "골프장 정보 없음",
          contractStatus: assignmentData?.data?.contract_status,
        }}
        defaultGroupType={selectedGroupType} // 현재 선택된 그룹 타입을 모달에 전달
      />
    </div>
  );
};

export default GroupManagementPage;
