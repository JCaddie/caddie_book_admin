"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { RoundingSettings } from "@/modules/work/types";

interface RoundingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: RoundingSettings) => void;
  initialSettings?: RoundingSettings;
  isLoading?: boolean;
}

const RoundingSettingsModal: React.FC<RoundingSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSettings,
  isLoading = false,
}) => {
  const [settings, setSettings] = useState<RoundingSettings>({
    numberOfRounds: 1,
    timeUnit: 10,
    roundTimes: [{ round: 1, startTime: "06:00", endTime: "08:00" }],
  });

  // 모달이 열릴 때마다 초기 설정으로 리셋
  useEffect(() => {
    if (isOpen) {
      if (initialSettings) {
        setSettings(initialSettings);
      } else {
        setSettings({
          numberOfRounds: 1,
          timeUnit: 10,
          roundTimes: [{ round: 1, startTime: "06:00", endTime: "08:00" }],
        });
      }
    }
  }, [isOpen, initialSettings]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleNumberOfRoundsChange = (value: number) => {
    const newRoundTimes: Array<{
      round: number;
      startTime: string;
      endTime: string;
    }> = [];

    // 부별 기본 시간 설정
    const defaultTimes = {
      1: { startTime: "06:00", endTime: "08:00" },
      2: { startTime: "10:00", endTime: "12:00" },
      3: { startTime: "14:00", endTime: "16:00" },
    };

    for (let i = 1; i <= value; i++) {
      const existingRound = settings.roundTimes.find((rt) => rt.round === i);
      const defaultTime = defaultTimes[i as keyof typeof defaultTimes];

      newRoundTimes.push({
        round: i,
        startTime: existingRound?.startTime || defaultTime.startTime,
        endTime: existingRound?.endTime || defaultTime.endTime,
      });
    }

    setSettings((prev) => ({
      ...prev,
      numberOfRounds: value,
      roundTimes: newRoundTimes,
    }));
  };

  const handleTimeUnitChange = (value: number) => {
    setSettings((prev) => ({
      ...prev,
      timeUnit: value,
    }));
  };

  const handleRoundTimeChange = (
    round: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      roundTimes: prev.roundTimes.map((rt) =>
        rt.round === round ? { ...rt, [field]: value } : rt
      ),
    }));
  };

  const handleSave = () => {
    // 유효성 검사
    for (const roundTime of settings.roundTimes) {
      if (!roundTime.startTime || !roundTime.endTime) {
        alert("모든 부의 시작 시간과 종료 시간을 입력해주세요.");
        return;
      }

      const startTime = new Date(`2000-01-01T${roundTime.startTime}`);
      const endTime = new Date(`2000-01-01T${roundTime.endTime}`);

      if (startTime >= endTime) {
        alert(
          `${roundTime.round}부의 시작 시간이 종료 시간보다 늦거나 같습니다.`
        );
        return;
      }
    }

    onSave(settings);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-xl flex flex-col"
        style={{ width: "500px" }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">라운딩 설정</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 space-y-6">
          {/* 부 수 선택 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">부 수</label>
            <div className="flex gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberOfRoundsChange(num)}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    settings.numberOfRounds === num
                      ? "bg-yellow-400 border-yellow-400 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {num}부
                </button>
              ))}
            </div>
          </div>

          {/* 분 단위 입력 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">분 단위</label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.timeUnit}
              onChange={(e) =>
                handleTimeUnitChange(parseInt(e.target.value) || 1)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="분 단위를 입력하세요"
            />
          </div>

          {/* 각 부별 시간 설정 */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              부별 시간 설정
            </label>
            <div className="space-y-3">
              {settings.roundTimes.map((roundTime) => (
                <div
                  key={roundTime.round}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700 w-12">
                    {roundTime.round}부
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={roundTime.startTime}
                      onChange={(e) =>
                        handleRoundTimeChange(
                          roundTime.round,
                          "startTime",
                          e.target.value
                        )
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                    <span className="text-gray-500">~</span>
                    <input
                      type="time"
                      value={roundTime.endTime}
                      onChange={(e) =>
                        handleRoundTimeChange(
                          roundTime.round,
                          "endTime",
                          e.target.value
                        )
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-6"
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-6"
          >
            {isLoading ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoundingSettingsModal;
