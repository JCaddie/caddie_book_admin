"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchBatteryLevelChoices,
  fetchStatusChoices,
  updateCartField,
} from "../api/cart-api";
import {
  ApiBatteryLevelChoice,
  ApiCartDetailResponse,
  ApiCartStatus,
  ApiStatusChoice,
} from "../types";

interface UseCartEditProps {
  cartId: string;
  onUpdate?: (updatedCart: ApiCartDetailResponse) => void;
}

interface UseCartEditReturn {
  statusChoices: Array<{ value: string; label: string }>;
  batteryLevelChoices: Array<{ value: number; label: string }>;
  updateName: (name: string) => Promise<void>;
  updateStatus: (status: string) => Promise<void>;
  updateBatteryLevel: (batteryLevel: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useCartEdit = ({
  cartId,
  onUpdate,
}: UseCartEditProps): UseCartEditReturn => {
  const [statusChoices, setStatusChoices] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [batteryLevelChoices, setBatteryLevelChoices] = useState<
    Array<{ value: number; label: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 선택지 데이터 로드
  const loadChoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [statusResponse, batteryResponse] = await Promise.all([
        fetchStatusChoices(),
        fetchBatteryLevelChoices(),
      ]);

      // 상태 선택지 매핑
      const mappedStatusChoices = statusResponse.status_choices.map(
        (choice: ApiStatusChoice) => ({
          value: choice.value,
          label: choice.label,
        })
      );

      // 배터리 레벨 선택지 매핑
      const mappedBatteryChoices = batteryResponse.battery_level_choices.map(
        (choice: ApiBatteryLevelChoice) => ({
          value: choice.value,
          label: choice.label,
        })
      );

      setStatusChoices(mappedStatusChoices);
      setBatteryLevelChoices(mappedBatteryChoices);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "선택지 로딩 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("선택지 로딩 중 오류:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  // 컴포넌트 마운트 시 선택지 로드
  useEffect(() => {
    loadChoices();
  }, [loadChoices]);

  return {
    statusChoices,
    batteryLevelChoices,
    updateName,
    updateStatus,
    updateBatteryLevel,
    isLoading,
    error,
  };
};
