"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCaddieGroups,
  updateCaddieEmploymentType,
  updateCaddiePrimaryGroup,
  updateCaddieSpecialGroups,
  updateCaddieTeamLeader,
  updateCaddieWorkScore,
} from "../../api";
import type { CaddieDetail } from "../../types";

interface UseCaddieEditProps {
  caddieId: string;
  golfCourseId?: string; // 골프장 ID 추가
  onUpdate?: (updatedCaddie: CaddieDetail) => void;
}

interface UseCaddieEditReturn {
  employmentTypeChoices: Array<{ value: string; label: string }>;
  teamLeaderChoices: Array<{ value: string; label: string }>;
  primaryGroupChoices: Array<{ value: string; label: string }>;
  specialGroupChoices: Array<{ value: string; label: string }>;
  updateEmploymentType: (employmentType: string) => Promise<void>;
  updateWorkScore: (workScore: number) => Promise<void>;
  updateTeamLeader: (isTeamLeader: string) => Promise<void>;
  updatePrimaryGroup: (primaryGroupId: string) => Promise<void>;
  updateSpecialGroups: (specialGroupIds: string) => Promise<void>;
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

  // 골프장은 변경 불가능하므로 옵션 제거

  // 그룹 옵션 상태
  const [primaryGroupChoices, setPrimaryGroupChoices] = useState<
    Array<{ value: string; label: string }>
  >([{ value: "", label: "그룹 선택" }]);
  const [specialGroupChoices, setSpecialGroupChoices] = useState<
    Array<{ value: string; label: string }>
  >([{ value: "", label: "특수반 선택" }]);

  // 고용형태 선택지
  const employmentTypeChoices = [
    { value: "FULL_TIME", label: "정규직" },
    { value: "PART_TIME", label: "시간제" },
    { value: "CONTRACT", label: "계약직" },
    { value: "TEMPORARY", label: "임시직" },
  ];

  // 팀장 여부 선택지
  const teamLeaderChoices = [
    { value: "true", label: "팀장" },
    { value: "false", label: "일반" },
  ];

  // 그룹 목록 로드
  useEffect(() => {
    if (!golfCourseId) return;

    const loadGroups = async () => {
      try {
        // 주 그룹 목록 조회
        const primaryResponse = await getCaddieGroups(golfCourseId, "PRIMARY");
        const primaryOptions = [
          { value: "", label: "그룹 선택" },
          ...primaryResponse.data.map((group) => ({
            value: group.id,
            label: group.name,
          })),
        ];
        setPrimaryGroupChoices(primaryOptions);

        // 특수반 목록 조회
        const specialResponse = await getCaddieGroups(golfCourseId, "SPECIAL");
        const specialOptions = [
          { value: "", label: "특수반 선택" },
          ...specialResponse.data.map((group) => ({
            value: group.id,
            label: group.name,
          })),
        ];
        setSpecialGroupChoices(specialOptions);
      } catch (err) {
        console.error("그룹 목록 로드 오류:", err);
      }
    };

    loadGroups();
  }, [golfCourseId]);

  // 고용형태 수정
  const updateEmploymentType = useCallback(
    async (employmentType: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedCaddie = await updateCaddieEmploymentType(
          caddieId,
          employmentType
        );
        onUpdate?.(updatedCaddie);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "고용형태 수정 중 오류가 발생했습니다.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [caddieId, onUpdate]
  );

  // 근무점수 수정
  const updateWorkScore = useCallback(
    async (workScore: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedCaddie = await updateCaddieWorkScore(caddieId, workScore);
        onUpdate?.(updatedCaddie);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "근무점수 수정 중 오류가 발생했습니다.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [caddieId, onUpdate]
  );

  // 팀장 여부 수정
  const updateTeamLeader = useCallback(
    async (isTeamLeader: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const boolValue = isTeamLeader === "true";
        const updatedCaddie = await updateCaddieTeamLeader(caddieId, boolValue);
        onUpdate?.(updatedCaddie);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "팀장 여부 수정 중 오류가 발생했습니다.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [caddieId, onUpdate]
  );

  // 주 그룹 수정
  const updatePrimaryGroup = useCallback(
    async (primaryGroupId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedCaddie = await updateCaddiePrimaryGroup(
          caddieId,
          primaryGroupId
        );
        onUpdate?.(updatedCaddie);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "주 그룹 수정 중 오류가 발생했습니다.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [caddieId, onUpdate]
  );

  // 특수반 수정 (일단 단일 선택으로 구현, 실제로는 다중 선택)
  const updateSpecialGroups = useCallback(
    async (specialGroupId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const specialGroupIds = specialGroupId ? [specialGroupId] : [];
        const updatedCaddie = await updateCaddieSpecialGroups(
          caddieId,
          specialGroupIds
        );
        onUpdate?.(updatedCaddie);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "특수반 수정 중 오류가 발생했습니다.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [caddieId, onUpdate]
  );

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
