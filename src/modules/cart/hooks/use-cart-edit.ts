"use client";

import React, { useCallback } from "react";
import { updateCartField } from "../api/cart-api";
import { ApiCartDetailResponse, ApiCartStatus } from "../types";
import { GOLF_COURSE_DROPDOWN_OPTIONS } from "@/shared/constants/golf-course";
import { useCaddiesSimple } from "@/modules/caddie/hooks";
import {
  useBatteryLevelConstants,
  useCartStatusConstants,
} from "@/shared/hooks/use-constants";

interface UseCartEditProps {
  cartId: string;
  currentGolfCourseId?: string;
  onUpdate?: (updatedCart: ApiCartDetailResponse) => void;
}

interface UseCartEditReturn {
  statusChoices: Array<{ value: string; label: string }>;
  batteryLevelChoices: Array<{ value: number; label: string }>;
  golfCourseChoices: Array<{ value: string; label: string }>;
  caddieChoices: Array<{ value: string; label: string }>;
  updateName: (name: string) => Promise<void>;
  updateStatus: (status: string) => Promise<void>;
  updateBatteryLevel: (batteryLevel: number) => Promise<void>;
  updateGolfCourse: (golfCourseId: string) => Promise<void>;
  updateManager: (caddieId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useCartEdit = ({
  cartId,
  currentGolfCourseId,
  onUpdate,
}: UseCartEditProps): UseCartEditReturn => {
  // 상수값 가져오기 (전역 캐시 사용)
  const { constants: statusConstants, isLoading: isLoadingStatus } =
    useCartStatusConstants();
  const { constants: batteryConstants, isLoading: isLoadingBattery } =
    useBatteryLevelConstants();

  // 골프장별 캐디 간소 목록 가져오기
  const { data: caddiesSimpleData, isLoading: isLoadingCaddies } =
    useCaddiesSimple(currentGolfCourseId);

  // 선택지 데이터 생성 (상수값에서)
  const statusChoices = React.useMemo(() => {
    return (
      statusConstants?.map((item) => ({
        value: String(item.id),
        label: item.value,
      })) || []
    );
  }, [statusConstants]);

  const batteryLevelChoices = React.useMemo(() => {
    return (
      batteryConstants?.map((item) => ({
        value: Number(item.id),
        label: item.value,
      })) || []
    );
  }, [batteryConstants]);

  // 캐디 드롭다운 옵션 생성
  const caddieOptions = React.useMemo(() => {
    if (!caddiesSimpleData?.data?.results) {
      return [{ value: "", label: "캐디 선택" }];
    }

    return [
      { value: "", label: "캐디 선택" },
      ...caddiesSimpleData.data.results.map(
        (caddie: { id: string; name: string }) => ({
          value: caddie.id,
          label: caddie.name,
        })
      ),
    ];
  }, [caddiesSimpleData]);

  // 카트명 수정
  const updateName = useCallback(
    async (name: string) => {
      try {
        const updatedCart = await updateCartField(cartId, "name", name);
        onUpdate?.(updatedCart);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "카트명 수정 중 오류가 발생했습니다.";
        throw new Error(errorMessage);
      }
    },
    [cartId, onUpdate]
  );

  // 상태 수정
  const updateStatus = useCallback(
    async (status: string) => {
      try {
        const updatedCart = await updateCartField(
          cartId,
          "status",
          status as ApiCartStatus
        );
        onUpdate?.(updatedCart);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "상태 수정 중 오류가 발생했습니다.";
        throw new Error(errorMessage);
      }
    },
    [cartId, onUpdate]
  );

  // 배터리 레벨 수정
  const updateBatteryLevel = useCallback(
    async (batteryLevel: number) => {
      try {
        const updatedCart = await updateCartField(
          cartId,
          "battery_level",
          batteryLevel
        );
        onUpdate?.(updatedCart);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "배터리 레벨 수정 중 오류가 발생했습니다.";
        throw new Error(errorMessage);
      }
    },
    [cartId, onUpdate]
  );

  // 골프장 수정
  const updateGolfCourse = useCallback(
    async (golfCourseId: string) => {
      try {
        const updatedCart = await updateCartField(
          cartId,
          "golf_course_id",
          golfCourseId
        );
        onUpdate?.(updatedCart);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "골프장 수정 중 오류가 발생했습니다.";
        throw new Error(errorMessage);
      }
    },
    [cartId, onUpdate]
  );

  // 관리자(캐디) 수정
  const updateManager = useCallback(
    async (caddieId: string) => {
      try {
        const updatedCart = await updateCartField(cartId, "manager", caddieId);
        onUpdate?.(updatedCart);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "관리자 수정 중 오류가 발생했습니다.";
        throw new Error(errorMessage);
      }
    },
    [cartId, onUpdate]
  );

  return {
    statusChoices,
    batteryLevelChoices,
    golfCourseChoices: GOLF_COURSE_DROPDOWN_OPTIONS,
    caddieChoices: caddieOptions,
    updateName,
    updateStatus,
    updateBatteryLevel,
    updateGolfCourse,
    updateManager,
    isLoading: isLoadingStatus || isLoadingBattery || isLoadingCaddies,
    error: null,
  };
};
