import { useCallback, useState } from "react";
import { RoundingSettings } from "../types";
import {
  fetchRoundingSettings,
  patchRoundingSettings,
  updateRoundingSettings,
  upsertRoundingSettings,
} from "../api";

interface UseRoundingSettingsProps {
  golfCourseId: string;
}

export const useRoundingSettings = ({
  golfCourseId,
}: UseRoundingSettingsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<RoundingSettings | null>(null);
  const [hasExistingSettings, setHasExistingSettings] = useState(false);

  // 라운딩 설정 조회
  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchRoundingSettings(golfCourseId);
      setSettings(data);
      setHasExistingSettings(true);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "라운딩 설정 조회에 실패했습니다.";
      setError(errorMessage);
      setHasExistingSettings(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [golfCourseId]);

  // 라운딩 설정 저장 (기존 데이터가 있으면 PUT, 없으면 POST)
  const saveSettings = useCallback(
    async (newSettings: RoundingSettings, golfCourseName?: string) => {
      try {
        setIsLoading(true);
        setError(null);

        let result;
        if (hasExistingSettings) {
          // 기존 데이터가 있으면 PUT으로 전체 업데이트
          result = await updateRoundingSettings(
            golfCourseId,
            newSettings,
            golfCourseName
          );
        } else {
          // 기존 데이터가 없으면 POST로 생성
          result = await upsertRoundingSettings(
            golfCourseId,
            newSettings,
            golfCourseName
          );
        }

        setSettings(newSettings);
        setHasExistingSettings(true);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "라운딩 설정 저장에 실패했습니다.";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [golfCourseId, hasExistingSettings]
  );

  // 라운딩 설정 부분 수정
  const patchSettings = useCallback(
    async (partialSettings: Partial<RoundingSettings>) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await patchRoundingSettings(
          golfCourseId,
          partialSettings
        );

        // 현재 설정과 부분 수정을 병합
        const updatedSettings = settings
          ? { ...settings, ...partialSettings }
          : null;
        setSettings(updatedSettings);

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "라운딩 설정 수정에 실패했습니다.";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [golfCourseId, settings]
  );

  return {
    settings,
    isLoading,
    error,
    hasExistingSettings,
    fetchSettings,
    saveSettings,
    patchSettings,
  };
};
