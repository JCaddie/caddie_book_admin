"use client";

import { useEffect, useState } from "react";
import {
  EMPLOYMENT_TYPE_CHOICES,
  TEAM_LEADER_CHOICES,
} from "../../constants/caddie";
import {
  fetchCaddieGroups,
  updateCaddieEmploymentType,
  updateCaddiePrimaryGroup,
  updateCaddieSpecialGroups,
  updateCaddieTeamLeader,
  updateCaddieWorkScore,
} from "../../api";

interface UseCaddieEditProps {
  caddieId: string;
  golfCourseId: string;
  onUpdate: () => void;
}

interface UseCaddieEditReturn {
  employmentTypeChoices: Array<{ value: string; label: string }>;
  teamLeaderChoices: Array<{ value: string; label: string }>;
  primaryGroupChoices: Array<{ value: string; label: string }>;
  specialGroupChoices: Array<{ value: string; label: string }>;
  updateEmploymentType: (value: string) => Promise<void>;
  updateWorkScore: (value: string) => Promise<void>;
  updateTeamLeader: (value: string) => Promise<void>;
  updatePrimaryGroup: (value: string) => Promise<void>;
  updateSpecialGroups: (value: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useCaddieEdit = ({
  caddieId,
  golfCourseId,
  onUpdate,
}: UseCaddieEditProps): UseCaddieEditReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 정적 옵션들 (상수 사용) - string 타입으로 변환
  const employmentTypeChoices = EMPLOYMENT_TYPE_CHOICES.map((choice) => ({
    value: String(choice.value),
    label: choice.label,
  }));

  const teamLeaderChoices = TEAM_LEADER_CHOICES.map((choice) => ({
    value: String(choice.value),
    label: choice.label,
  }));

  // 동적 그룹 옵션 상태 (API에서 로드)
  const [primaryGroupChoices, setPrimaryGroupChoices] = useState<
    Array<{ value: string; label: string }>
  >([{ value: "", label: "그룹 선택" }]);

  const [specialGroupChoices, setSpecialGroupChoices] = useState<
    Array<{ value: string; label: string }>
  >([{ value: "", label: "특수반 선택" }]);

  // 그룹 목록 로드
  useEffect(() => {
    if (!golfCourseId) return;

    const loadGroups = async () => {
      try {
        // 주 그룹 목록 로드
        const primaryResponse = await fetchCaddieGroups(
          golfCourseId,
          "PRIMARY"
        );
        const primaryOptions = [
          { value: "", label: "그룹 선택" },
          ...primaryResponse.data.map((group) => ({
            value: group.id,
            label: group.name,
          })),
        ];
        setPrimaryGroupChoices(primaryOptions);

        // 특수 그룹 목록 로드
        const specialResponse = await fetchCaddieGroups(
          golfCourseId,
          "SPECIAL"
        );
        const specialOptions = [
          { value: "", label: "특수반 선택" },
          ...specialResponse.data.map((group) => ({
            value: group.id,
            label: group.name,
          })),
        ];
        setSpecialGroupChoices(specialOptions);
      } catch (error) {
        console.error("그룹 목록 로드 실패:", error);
      }
    };

    loadGroups();
  }, [golfCourseId]);

  // 업데이트 함수들
  const updateEmploymentType = async (value: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateCaddieEmploymentType(caddieId, value);
      onUpdate();
    } catch (error) {
      setError("고용형태 업데이트에 실패했습니다");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkScore = async (value: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateCaddieWorkScore(caddieId, Number(value));
      onUpdate();
    } catch (error) {
      setError("근무점수 업데이트에 실패했습니다");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTeamLeader = async (value: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateCaddieTeamLeader(caddieId, value === "true");
      onUpdate();
    } catch (error) {
      setError("팀장여부 업데이트에 실패했습니다");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrimaryGroup = async (value: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateCaddiePrimaryGroup(caddieId, value);
      onUpdate();
    } catch (error) {
      setError("주 그룹 업데이트에 실패했습니다");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSpecialGroups = async (value: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateCaddieSpecialGroups(caddieId, [value]);
      onUpdate();
    } catch (error) {
      setError("특수 그룹 업데이트에 실패했습니다");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    employmentTypeChoices,
    teamLeaderChoices,
    primaryGroupChoices,
    specialGroupChoices,
    updateEmploymentType,
    updateWorkScore,
    updateTeamLeader,
    updatePrimaryGroup,
    updateSpecialGroups,
    isLoading,
    error,
  };
};
