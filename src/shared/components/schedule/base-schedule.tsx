"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { Field, PersonnelStats, TimeSlots } from "@/modules/work/types";
import { Button } from "@/shared/components/ui";

interface BaseScheduleProps<T> {
  fields: Field[];
  timeSlots: TimeSlots;
  personnelStats: PersonnelStats;
  onResetClick: () => void;
  hideHeader?: boolean;
  isFullWidth?: boolean;

  // 추가 액션 버튼들
  onRoundingSettingsClick?: () => void;
  onFillClick?: () => void;

  // 드래그 앤 드롭 관련
  draggedItem?: T | null;
  onDragStart?: (item: T) => void;
  onDragEnd?: () => void;
  onDragOver?: (
    e: React.DragEvent,
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => void;
  onDrop?: (
    e: React.DragEvent,
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => void;

  // 제거 기능 추가
  onRemove?: (fieldIndex: number, timeIndex: number, part: number) => void;

  // 렌더링 함수들
  renderCell: (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => React.ReactNode;
  getItemAtPosition?: (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => T | null;

  // 스타일 관련
  getCellClassName?: (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => string;
}

export default function BaseSchedule<T>({
  fields,
  timeSlots,
  personnelStats,
  onResetClick,
  hideHeader = false,
  isFullWidth = false,
  onRoundingSettingsClick,
  onFillClick,
  draggedItem,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onDragOver,
  onDrop,
  onRemove,
  renderCell,
  getItemAtPosition,
  getCellClassName,
}: BaseScheduleProps<T>) {
  // 이 변수들은 하위 컴포넌트에서 사용됨 (BaseSchedule에서는 직접 사용하지 않음)
  void _onDragStart;
  void _onDragEnd;

  // 기본 드래그 오버 핸들러
  const handleDragOver = (
    e: React.DragEvent,
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    e.preventDefault();
    onDragOver?.(e, fieldIndex, timeIndex, part);
  };

  // 기본 드롭 핸들러
  const handleDrop = (
    e: React.DragEvent,
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    e.preventDefault();
    onDrop?.(e, fieldIndex, timeIndex, part);
  };

  // 기본 셀 클래스명
  const getDefaultCellClassName = (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    const baseClass = "relative p-1 border-r border-[#DDDDDD] bg-white";
    const customClass = getCellClassName?.(fieldIndex, timeIndex, part) || "";
    const hasItem = getItemAtPosition?.(fieldIndex, timeIndex, part);
    const dragOverClass = draggedItem ? "hover:bg-blue-50" : "";

    return `${baseClass} ${customClass} ${dragOverClass} ${
      hasItem ? "bg-gray-50" : ""
    }`.trim();
  };

  return (
    <div className={isFullWidth ? "w-full" : "w-[948px]"}>
      {/* 헤더 섹션 */}
      {!hideHeader && (
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h2 className="text-[22px] font-bold text-black">라운딩 관리</h2>

              {/* 인원 통계 배지 */}
              <div className="flex items-center gap-4 bg-white rounded-full px-6 py-2">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-[#217F81] text-white text-sm font-bold rounded">
                    총인원
                  </div>
                  <span className="text-sm font-bold">
                    {personnelStats.total}
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-[#FEB912] text-white text-sm font-bold rounded">
                    가용인원
                  </div>
                  <span className="text-sm font-bold">
                    {personnelStats.available}
                  </span>
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex items-center gap-3">
              {onRoundingSettingsClick && (
                <Button
                  variant="outline"
                  onClick={onRoundingSettingsClick}
                  className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                >
                  라운딩 설정
                </Button>
              )}
              {onFillClick && (
                <Button
                  variant="outline"
                  onClick={onFillClick}
                  className="border-blue-400 text-blue-600 hover:bg-blue-50"
                >
                  채우기
                </Button>
              )}
              <Button
                variant="primary"
                onClick={onResetClick}
                className="bg-[#FEB912] hover:bg-[#e5a50f] text-white"
                icon={<RotateCcw className="w-4 h-4" />}
              >
                초기화
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 통합 스케줄 테이블 */}
      <div
        className={`bg-white rounded-lg ${
          isFullWidth ? "" : "overflow-x-auto"
        }`}
      >
        <table className={isFullWidth ? "w-full" : "min-w-full"}>
          {/* 테이블 헤더 */}
          <thead>
            <tr className="bg-gray-50">
              <th className="w-20 min-w-[80px] py-3 px-4 text-left font-medium text-gray-900 sticky left-0 bg-gray-50 z-10">
                시간
              </th>
              {fields.map((field) => (
                <th
                  key={field.id}
                  className="py-3 px-2 text-center font-medium text-gray-900"
                  style={{ width: "200px", minWidth: "200px" }}
                >
                  {field.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* 1부 섹션 */}
            <tr>
              <td
                colSpan={fields.length + 1}
                className="py-3 px-0 bg-[#FEB912] text-center border-0"
              >
                <span className="text-[22px] font-bold text-black">1부</span>
              </td>
            </tr>
            {timeSlots.part1.map((time, timeIndex) => (
              <tr key={`part1-${timeIndex}`} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-black/80 bg-gray-50 sticky left-0 z-10">
                  {time}
                </td>
                {fields.map((field, fieldIndex) => (
                  <td
                    key={field.id}
                    className={getDefaultCellClassName(
                      fieldIndex,
                      timeIndex,
                      1
                    )}
                    onDragOver={(e) =>
                      handleDragOver(e, fieldIndex, timeIndex, 1)
                    }
                    onDrop={(e) => handleDrop(e, fieldIndex, timeIndex, 1)}
                    onDoubleClick={() => onRemove?.(fieldIndex, timeIndex, 1)}
                    title="더블클릭하여 제거"
                  >
                    {renderCell(fieldIndex, timeIndex, 1)}
                  </td>
                ))}
              </tr>
            ))}

            {/* 2부 섹션 */}
            <tr>
              <td
                colSpan={fields.length + 1}
                className="py-3 px-0 bg-[#FEB912] text-center border-0"
              >
                <span className="text-[22px] font-bold text-black">2부</span>
              </td>
            </tr>
            {timeSlots.part2.map((time, timeIndex) => (
              <tr key={`part2-${timeIndex}`} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-black/80 bg-gray-50 sticky left-0 z-10">
                  {time}
                </td>
                {fields.map((field, fieldIndex) => (
                  <td
                    key={field.id}
                    className={getDefaultCellClassName(
                      fieldIndex,
                      timeIndex,
                      2
                    )}
                    onDragOver={(e) =>
                      handleDragOver(e, fieldIndex, timeIndex, 2)
                    }
                    onDrop={(e) => handleDrop(e, fieldIndex, timeIndex, 2)}
                    onDoubleClick={() => onRemove?.(fieldIndex, timeIndex, 2)}
                    title="더블클릭하여 제거"
                  >
                    {renderCell(fieldIndex, timeIndex, 2)}
                  </td>
                ))}
              </tr>
            ))}

            {/* 3부 섹션 */}
            <tr>
              <td
                colSpan={fields.length + 1}
                className="py-3 px-0 bg-[#FEB912] text-center border-0"
              >
                <span className="text-[22px] font-bold text-black">3부</span>
              </td>
            </tr>
            {timeSlots.part3.map((time, timeIndex) => (
              <tr key={`part3-${timeIndex}`} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-black/80 bg-gray-50 sticky left-0 z-10">
                  {time}
                </td>
                {fields.map((field, fieldIndex) => (
                  <td
                    key={field.id}
                    className={getDefaultCellClassName(
                      fieldIndex,
                      timeIndex,
                      3
                    )}
                    onDragOver={(e) =>
                      handleDragOver(e, fieldIndex, timeIndex, 3)
                    }
                    onDrop={(e) => handleDrop(e, fieldIndex, timeIndex, 3)}
                    onDoubleClick={() => onRemove?.(fieldIndex, timeIndex, 3)}
                    title="더블클릭하여 제거"
                  >
                    {renderCell(fieldIndex, timeIndex, 3)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
