import { useCallback, useEffect, useState } from "react";
import { fetchCaddieGroups } from "../api";
import {
  DEFAULT_GROUP_OPTIONS,
  DEFAULT_SPECIAL_TEAM_OPTIONS,
  EMPLOYMENT_TYPE_CHOICES,
  GENDER_CHOICES,
  REGISTRATION_STATUS_CHOICES,
  TEAM_LEADER_CHOICES,
} from "../constants/caddie";
import type { SelectOption } from "../types";

// ================================
// 캐디 옵션 관리 훅
// ================================

interface UseCaddieOptionsProps {
  golfCourseId?: string;
  loadGroups?: boolean;
}

interface UseCaddieOptionsReturn {
  // 정적 옵션들 (항상 동일)
  genderOptions: SelectOption[];
  employmentTypeOptions: SelectOption[];
  teamLeaderOptions: SelectOption[];
  registrationStatusOptions: SelectOption[];

  // 동적 옵션들 (API에서 로드)
  groupOptions: SelectOption[];
  specialTeamOptions: SelectOption[];

  // 로딩 상태
  isLoadingGroups: boolean;
  groupsError: string | null;

  // 새로고침 함수
  refetchGroups: () => Promise<void>;
}

/**
 * 캐디 관련 모든 옵션들을 관리하는 통합 훅
 */
export const useCaddieOptions = ({
  golfCourseId,
  loadGroups = false,
}: UseCaddieOptionsProps = {}): UseCaddieOptionsReturn => {
  const [groupOptions, setGroupOptions] = useState<SelectOption[]>(
    DEFAULT_GROUP_OPTIONS
  );
  const [specialTeamOptions, setSpecialTeamOptions] = useState<SelectOption[]>(
    DEFAULT_SPECIAL_TEAM_OPTIONS
  );
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [groupsError, setGroupsError] = useState<string | null>(null);

  // 그룹 옵션 로드 함수
  const loadGroupOptions = useCallback(async () => {
    if (!golfCourseId || !loadGroups) return;

    setIsLoadingGroups(true);
    setGroupsError(null);

    try {
      // 주 그룹 목록 로드
      const primaryResponse = await fetchCaddieGroups(golfCourseId, {
        group_type: "PRIMARY",
      });

      const primaryOptions = [
        { value: "", label: "전체 그룹" },
        ...primaryResponse.data.map((group) => ({
          value: group.id,
          label: group.name,
        })),
      ];
      setGroupOptions(primaryOptions);

      // 특수 그룹 목록 로드
      const specialResponse = await fetchCaddieGroups(golfCourseId, {
        group_type: "SPECIAL",
      });

      const specialOptions = [
        { value: "", label: "전체 특수반" },
        ...specialResponse.data.map((group) => ({
          value: group.id,
          label: group.name,
        })),
      ];
      setSpecialTeamOptions(specialOptions);
    } catch (error) {
      console.error("그룹 옵션 로드 실패:", error);
      setGroupsError("그룹 옵션을 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingGroups(false);
    }
  }, [golfCourseId, loadGroups]);

  // 골프장이 변경되거나 loadGroups가 true일 때 그룹 옵션 로드
  useEffect(() => {
    loadGroupOptions();
  }, [loadGroupOptions]);

  // 새로고침 함수
  const refetchGroups = async () => {
    await loadGroupOptions();
  };

  return {
    // 정적 옵션들
    genderOptions: GENDER_CHOICES,
    employmentTypeOptions: EMPLOYMENT_TYPE_CHOICES,
    teamLeaderOptions: TEAM_LEADER_CHOICES,
    registrationStatusOptions: REGISTRATION_STATUS_CHOICES,

    // 동적 옵션들
    groupOptions,
    specialTeamOptions,

    // 상태
    isLoadingGroups,
    groupsError,

    // 함수
    refetchGroups,
  };
};
