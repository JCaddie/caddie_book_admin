"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  CaddieAssignmentModal,
  SearchWithButton,
} from "@/shared/components/ui";
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
    name: member.name,
    group: apiGroup.id,
    badge: member.is_team_leader ? "팀장" : "캐디",
    status: "active",
    specialBadge: member.is_team_leader ? "팀장" : undefined,
  })),
});

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

  // 필터 상태
  const [filters, setFilters] = useState({
    selectedGroup: "전체",
    selectedStatus: "전체",
  });

  // 모달 상태
  const [isGroupCreateModalOpen, setIsGroupCreateModalOpen] = useState(false);
  const [isCaddieAssignmentModalOpen, setIsCaddieAssignmentModalOpen] =
    useState(false);

  // 페이지 타이틀 설정
  const pageTitle = isOwnGolfCourse
    ? "내 골프장 그룹현황"
    : data?.golf_course.name
    ? `${data.golf_course.name} 그룹현황`
    : "그룹현황";
  useDocumentTitle({ title: pageTitle });

  // 데이터 로드 함수
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

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, [id, loadData]);

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

  const openCaddieAssignmentModal = () => setIsCaddieAssignmentModalOpen(true);
  const closeCaddieAssignmentModal = () =>
    setIsCaddieAssignmentModalOpen(false);

  const handleCaddieAssignmentConfirm = (selectedCaddies: string[]) => {
    console.log("캐디 배정", selectedCaddies);
    closeCaddieAssignmentModal();
  };

  // 드래그 앤 드롭 핸들러들 (기본 구현)
  const handleDragStart = (caddie: unknown, groupId: string) => {
    console.log("드래그 시작", caddie, groupId);
  };

  const handleDragEnd = () => {
    console.log("드래그 종료");
  };

  const handleDrop = (targetGroupId: string, insertIndex?: number) => {
    console.log("드롭", targetGroupId, insertIndex);
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
      <AdminPageHeader title={pageTitle} />

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

      {/* 그룹이 없을 때 빈 상태 화면 */}
      {filteredGroups.length === 0 ? (
        <EmptyGroupsState onCreateGroup={openGroupCreateModal} />
      ) : (
        <>
          {/* 필터 및 액션바 */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  총 {totalCaddieCount}명
                </span>
              </div>

              {/* 필터 드롭다운들 */}
              <select
                value={filters.selectedGroup}
                onChange={(e) => updateFilter("selectedGroup", e.target.value)}
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
                onChange={(e) => updateFilter("selectedStatus", e.target.value)}
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

            {/* 버튼들 */}
            <div className="flex items-center gap-2">
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-white flex items-center gap-1"
                onClick={openGroupCreateModal}
              >
                <Plus className="w-4 h-4" />
                그룹 생성
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
                onClick={openCaddieAssignmentModal}
              >
                <Plus className="w-4 h-4" />
                캐디 배정
              </Button>
            </div>
          </div>

          {/* 그룹들 - 가로 스크롤 */}
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4" style={{ width: "fit-content" }}>
              {filteredGroups.map((group) => (
                <GroupSection
                  key={group.id}
                  group={group}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  draggedCaddie={null}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* 그룹 생성 모달 */}
      <GroupCreateModal
        isOpen={isGroupCreateModalOpen}
        onClose={closeGroupCreateModal}
        onSuccess={handleGroupCreateSuccess}
        golfCourseId={isOwnGolfCourse ? undefined : id} // MASTER일 때는 URL의 ID, ADMIN일 때는 undefined (자신의 골프장 ID 사용)
      />

      {/* 캐디 배정 모달 */}
      <CaddieAssignmentModal
        isOpen={isCaddieAssignmentModalOpen}
        onClose={closeCaddieAssignmentModal}
        onConfirm={handleCaddieAssignmentConfirm}
      />
    </div>
  );
};

export default GroupManagementPage;
