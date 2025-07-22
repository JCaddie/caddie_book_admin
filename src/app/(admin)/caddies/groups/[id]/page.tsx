"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button, SearchWithButton } from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle } from "@/shared/hooks";
import { Plus } from "lucide-react";
import {
  EmptyGroupsState,
  GROUP_OPTIONS,
  GroupCreateModal,
  GroupSection,
  STATUS_OPTIONS,
} from "@/modules/group";
import { GroupFilterOption } from "@/modules/group/types";
import { getGolfCourseGroupDetail } from "@/modules/golf-course/api/golf-course-api";
import {
  Group as ApiGroup,
  GolfCourseGroupDetailResponse,
  GroupMember,
} from "@/modules/golf-course/types/golf-course";
import { getUserAssignments } from "@/modules/user/api/user-api";
import { UserAssignment } from "@/modules/user/types/user";
import { CaddieCard } from "@/modules/work/components";
import { CaddieData } from "@/modules/work/types";
import {
  assignPrimaryGroup,
  removePrimaryGroup,
} from "@/modules/group/api/group-api";

interface GroupManagementPageProps {
  params: Promise<{
    id: string;
  }>;
}

// API 그룹을 GroupSection에서 사용하는 형식으로 변환하는 함수
const transformApiGroupToGroupSection = (apiGroup: ApiGroup) => ({
  id: apiGroup.id.toString(),
  name: apiGroup.name,
  memberCount: apiGroup.member_count,
  caddies: apiGroup.members.map((member: GroupMember) => ({
    id: parseInt(member.id),
    originalId: member.id, // 원본 UUID string 보존
    name: member.name,
    group: apiGroup.id,
    badge: member.is_team_leader ? "팀장" : "캐디",
    status: "active",
    specialBadge: member.is_team_leader ? "팀장" : undefined,
  })),
});

// UserAssignment를 CaddieData 형식으로 변환하는 함수
const transformUserAssignmentToCaddieData = (
  assignment: UserAssignment
): CaddieData => {
  const specialGroupNames = assignment.special_groups
    .map((group) => group.name)
    .join(", ");

  return {
    id: parseInt(assignment.id),
    originalId: assignment.id, // 원본 UUID string 보존
    name: assignment.name,
    group:
      assignment.special_groups.length > 0
        ? assignment.special_groups[0].id
        : 0,
    badge: assignment.special_groups.length > 0 ? "특수반" : "일반",
    status: "active",
    specialBadge:
      assignment.special_groups.length > 0 ? specialGroupNames : undefined,
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
  const [caddieAssignments, setCaddieAssignments] = useState<UserAssignment[]>(
    []
  );
  const [caddieLoading, setCaddieLoading] = useState(true);
  const [caddieError, setCaddieError] = useState<string | null>(null);

  // 필터 상태
  const [filters, setFilters] = useState({
    selectedGroup: "전체",
    selectedStatus: "전체",
  });

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
      const response = await getUserAssignments(golfCourseId);
      setCaddieAssignments(response.results);
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

  // API 데이터를 GroupSection 형식으로 변환 (주그룹만)
  const transformedGroups = data
    ? data.primary_groups.map(transformApiGroupToGroupSection)
    : [];

  // 필터링된 그룹 데이터
  const filteredGroups = transformedGroups.filter((group) => {
    if (
      filters.selectedGroup !== "전체" &&
      group.name !== filters.selectedGroup
    ) {
      return false;
    }
    return true;
  });

  // 전체 캐디 수 계산
  const totalCaddieCount = filteredGroups.reduce(
    (total, group) => total + group.memberCount,
    0
  );

  // 필터 업데이트 함수
  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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

      if (draggedCaddie) {
        if (targetGroupId === "unassigned") {
          // 캐디 배정 해제 (빈 영역으로 드래그)
          const currentGroupId = draggedCaddie.group;
          if (currentGroupId > 0 && draggedCaddie.originalId) {
            await removePrimaryGroup(currentGroupId, {
              caddie_ids: [draggedCaddie.originalId],
            });
            console.log("캐디 그룹 배정 해제 완료");
          }
        } else {
          // 캐디를 새로운 그룹에 배정
          if (draggedCaddie.originalId) {
            await assignPrimaryGroup(parseInt(targetGroupId), {
              caddie_ids: [draggedCaddie.originalId],
              orders: [insertIndex || 1],
            });
            console.log("캐디 그룹 배정 완료");
          }
        }

        // 데이터 새로고침
        await loadData();
        await loadCaddieAssignments();
      }
    } catch (error) {
      console.error("캐디 그룹 배정/해제 실패:", error);
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
      <div className="grid grid-cols-3 gap-4 mb-6">
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
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-sm text-yellow-600">팀장</div>
          <div className="text-2xl font-bold text-yellow-900">
            {data.caddie_summary.team_leaders}명
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex gap-8">
        {/* 왼쪽: 그룹 관리 */}
        <div className="w-[calc(3*320px+2*16px)]">
          {/* 그룹이 없을 때 빈 상태 화면 */}
          {filteredGroups.length === 0 ? (
            <EmptyGroupsState onCreateGroup={openGroupCreateModal} />
          ) : (
            <>
              {/* 필터 및 액션바 */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      총 {totalCaddieCount}명
                    </span>
                  </div>

                  {/* 필터 드롭다운들 */}
                  <select
                    value={filters.selectedGroup}
                    onChange={(e) =>
                      updateFilter("selectedGroup", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm w-24"
                  >
                    {GROUP_OPTIONS.map((option: GroupFilterOption) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filters.selectedStatus}
                    onChange={(e) =>
                      updateFilter("selectedStatus", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm w-28"
                  >
                    {STATUS_OPTIONS.map((option: GroupFilterOption) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

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
                  {filteredGroups.map((group) => (
                    <div key={group.id} className="w-80 flex-shrink-0">
                      <GroupSection
                        group={group}
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
                  {data.caddie_summary.total_caddies}명
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">팀장</span>
                <span className="text-sm font-medium">
                  {data.caddie_summary.team_leaders}명
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">활성 캐디</span>
                <span className="text-sm font-medium">
                  {data.caddie_summary.active_caddies}명
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
            ) : caddieAssignments.length === 0 ? (
              <div className="text-sm text-gray-500">
                등록된 캐디가 없습니다.
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
                {caddieAssignments.map((assignment) => {
                  const caddieData =
                    transformUserAssignmentToCaddieData(assignment);
                  return (
                    <div
                      key={assignment.id}
                      draggable
                      onDragStart={() => handleDragStart(caddieData, "")}
                      onDragEnd={handleDragEnd}
                      className={`cursor-move ${
                        draggedCaddie?.id === caddieData.id ? "opacity-50" : ""
                      }`}
                    >
                      <CaddieCard caddie={caddieData} />
                    </div>
                  );
                })}
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
