"use client";

import { useCallback, useState } from "react";
import {
  updateCaddieEmploymentType,
  updateCaddieGolfCourse,
  updateCaddiePrimaryGroup,
  updateCaddieSpecialGroups,
  updateCaddieTeamLeader,
  updateCaddieWorkScore,
} from "../../api";
import type { CaddieDetail } from "../../types";
import { GOLF_COURSE_DROPDOWN_OPTIONS } from "@/shared/constants/golf-course";

interface UseCaddieEditProps {
  caddieId: string;
  onUpdate?: (updatedCaddie: CaddieDetail) => void;
}

interface UseCaddieEditReturn {
  employmentTypeChoices: Array<{ value: string; label: string }>;
  golfCourseChoices: Array<{ value: string; label: string }>;
  teamLeaderChoices: Array<{ value: string; label: string }>;
  // TODO: 주 그룹과 특수반 선택지는 실제 API에서 가져와야 함
  primaryGroupChoices: Array<{ value: string; label: string }>;
  specialGroupChoices: Array<{ value: string; label: string }>;
  updateEmploymentType: (employmentType: string) => Promise<void>;
  updateGolfCourse: (golfCourseId: string) => Promise<void>;
  updateWorkScore: (workScore: number) => Promise<void>;
  updateTeamLeader: (isTeamLeader: string) => Promise<void>;
  updatePrimaryGroup: (primaryGroupId: string) => Promise<void>;
  updateSpecialGroups: (specialGroupIds: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useCaddieEdit = ({
  caddieId,
  onUpdate,
}: UseCaddieEditProps): UseCaddieEditReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // TODO: 실제로는 API에서 가져와야 함
  const primaryGroupChoices = [
    { value: "", label: "그룹 선택" },
    { value: "group-1", label: "A조" },
    { value: "group-2", label: "B조" },
    { value: "group-3", label: "C조" },
  ];

  // TODO: 실제로는 API에서 가져와야 함 (다중 선택이지만 일단 단일 선택으로)
  const specialGroupChoices = [
    { value: "", label: "특수반 선택" },
    { value: "special-1", label: "마스터반" },
    { value: "special-2", label: "VIP반" },
    { value: "special-3", label: "프리미엄반" },
  ];

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

  // 골프장 수정
  const updateGolfCourse = useCallback(
    async (golfCourseId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedCaddie = await updateCaddieGolfCourse(
          caddieId,
          golfCourseId
        );
        onUpdate?.(updatedCaddie);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "골프장 수정 중 오류가 발생했습니다.";
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
    golfCourseChoices: GOLF_COURSE_DROPDOWN_OPTIONS,
    teamLeaderChoices,
    primaryGroupChoices,
    specialGroupChoices,
    updateEmploymentType,
    updateGolfCourse,
    updateWorkScore,
    updateTeamLeader,
    updatePrimaryGroup,
    updateSpecialGroups,
    isLoading,
    error,
  };
};
