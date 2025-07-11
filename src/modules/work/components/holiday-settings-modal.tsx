"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";

interface HolidaySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HolidaySettingsModal({
  isOpen,
  onClose,
}: HolidaySettingsModalProps) {
  // 상태 관리
  const [repeatCycle] = useState("매주");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [fixedTime, setFixedTime] = useState({ hour: "00", minute: "00" });
  const [allowedPersonnel, setAllowedPersonnel] = useState(1);
  const [monthlyHolidayCount, setMonthlyHolidayCount] = useState(1);

  const days = ["전체", "월", "화", "수", "목", "금", "토", "일"];

  // 요일 선택 핸들러
  const handleDayToggle = (day: string) => {
    if (day === "전체") {
      setSelectedDays(selectedDays.includes("전체") ? [] : ["전체"]);
    } else {
      const newDays = selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays.filter((d) => d !== "전체"), day];
      setSelectedDays(newDays);
    }
  };

  // 숫자 입력 핸들러
  const handleNumberChange = (
    type: "personnel" | "holiday",
    operation: "increase" | "decrease"
  ) => {
    if (type === "personnel") {
      setAllowedPersonnel((prev) =>
        operation === "increase" ? prev + 1 : Math.max(0, prev - 1)
      );
    } else {
      setMonthlyHolidayCount((prev) =>
        operation === "increase" ? prev + 1 : Math.max(0, prev - 1)
      );
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-[474px] h-[753px] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-[22px] font-bold text-black">휴무 설정</h2>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 p-4 flex flex-col gap-6">
          {/* 반복 주기 */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[20px] font-medium text-black">반복 주기</h3>
            <div className="h-0.5 bg-[#DDDDDD]"></div>
          </div>

          {/* 설정 항목들 */}
          <div className="flex flex-col gap-6">
            {/* 주차 */}
            <div className="flex items-center gap-6">
              <span className="text-base font-medium text-black w-[104px] text-center">
                주차
              </span>
              <div className="flex items-center gap-2">
                <button className="w-6 h-6 flex items-center justify-center border rounded">
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </button>
                <div className="w-16 h-8 flex items-center justify-center border border-[#DCE0E4] rounded text-sm">
                  {repeatCycle}
                </div>
                <button className="w-6 h-6 flex items-center justify-center border rounded">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* 요일 */}
            <div className="flex items-start gap-6">
              <span className="text-base font-medium text-black w-[104px] text-center">
                요일
              </span>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-wrap gap-2">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={`px-2 py-1 rounded-full text-[13px] font-bold ${
                        selectedDays.includes(day)
                          ? "bg-[#FEB912] text-white"
                          : "bg-[#E3E3E3] text-black/30"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 픽스 시간 */}
            <div className="flex items-center gap-6">
              <span className="text-base font-medium text-black w-[104px] text-center">
                픽스 시간
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={fixedTime.hour}
                  onChange={(e) =>
                    setFixedTime((prev) => ({ ...prev, hour: e.target.value }))
                  }
                  className="w-12 h-8 text-center border border-[#DCE0E4] rounded text-sm"
                  maxLength={2}
                />
                <span className="text-sm">:</span>
                <input
                  type="text"
                  value={fixedTime.minute}
                  onChange={(e) =>
                    setFixedTime((prev) => ({
                      ...prev,
                      minute: e.target.value,
                    }))
                  }
                  className="w-12 h-8 text-center border border-[#DCE0E4] rounded text-sm"
                  maxLength={2}
                />
              </div>
            </div>

            {/* 휴무 허용 인원 */}
            <div className="flex items-center gap-6">
              <span className="text-base font-medium text-black w-[104px] text-center">
                휴무 허용 인원
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNumberChange("personnel", "decrease")}
                  className="w-4 h-4 flex items-center justify-center text-gray-400"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="w-16 h-8 flex items-center justify-center border border-[#DCE0E4] rounded text-sm">
                  {allowedPersonnel}
                </div>
                <button
                  onClick={() => handleNumberChange("personnel", "increase")}
                  className="w-4 h-4 flex items-center justify-center text-gray-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 월간 휴무 개수 */}
            <div className="flex items-center gap-6">
              <span className="text-base font-medium text-black w-[104px] text-center">
                월간 휴무 개수
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNumberChange("holiday", "decrease")}
                  className="w-4 h-4 flex items-center justify-center text-gray-400"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="w-16 h-8 flex items-center justify-center border border-[#DCE0E4] rounded text-sm">
                  {monthlyHolidayCount}
                </div>
                <button
                  onClick={() => handleNumberChange("holiday", "increase")}
                  className="w-4 h-4 flex items-center justify-center text-gray-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
