"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Field, TimeSlots, PersonnelStats, CaddieData } from "../types";
import { SAMPLE_CADDIES } from "../constants/work-detail";
import CaddieCard from "./caddie-card";

interface WorkScheduleProps {
  fields: Field[];
  timeSlots: TimeSlots;
  personnelStats: PersonnelStats;
  onResetClick: () => void;
  draggedCaddie?: CaddieData | null;
  onDragStart?: (caddie: CaddieData) => void;
  onDragEnd?: () => void;
}

interface CaddiePosition {
  fieldIndex: number;
  timeIndex: number;
  part: number;
}

export default function WorkSchedule({
  fields,
  timeSlots,
  personnelStats,
  onResetClick,
  draggedCaddie: externalDraggedCaddie,
  onDragStart: externalOnDragStart,
  onDragEnd: externalOnDragEnd,
}: WorkScheduleProps) {
  // 캐디 위치 상태 관리
  const [caddiePositions, setCaddiePositions] = useState<
    Map<string, CaddiePosition>
  >(new Map());

  // 외부에서 드래그된 캐디들을 저장
  const [externalCaddies, setExternalCaddies] = useState<
    Map<string, CaddieData>
  >(new Map());

  // 드래그 상태 관리 (내부 드래그용)
  const [internalDraggedCaddie, setInternalDraggedCaddie] =
    useState<CaddieData | null>(null);
  const [dragOverPosition, setDragOverPosition] =
    useState<CaddiePosition | null>(null);

  // 전체 드래그 상태 (외부 + 내부)
  const draggedCaddie = externalDraggedCaddie || internalDraggedCaddie;

  // 스케줄용 캐디 데이터 (첫 6명만 사용)
  const caddies = SAMPLE_CADDIES.slice(0, 6);

  // 초기 캐디 위치 설정 (기본적으로 빈 상태)
  const initializeCaddiePositions = () => {
    setCaddiePositions(new Map());
  };

  // 특정 위치에 배정된 캐디 찾기
  const getCaddieAtPosition = (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    for (const [positionKey, position] of caddiePositions) {
      if (
        position.fieldIndex === fieldIndex &&
        position.timeIndex === timeIndex &&
        position.part === part
      ) {
        // 위치 키에서 캐디 ID 추출 (형식: "caddieId_fieldIndex_timeIndex_part")
        const caddieId = positionKey.split("_")[0];

        // 기존 캐디 배열에서 먼저 찾기
        const foundCaddie = caddies.find((c) => c.id.toString() === caddieId);
        if (foundCaddie) {
          return foundCaddie;
        }

        // 외부에서 드래그된 캐디들에서 찾기
        const externalCaddie = externalCaddies.get(caddieId);
        if (externalCaddie) {
          return externalCaddie;
        }

        return null;
      }
    }
    return null;
  };

  // 드래그 시작 핸들러
  const handleDragStart = (caddie: CaddieData) => {
    // 외부 드래그 핸들러가 있으면 사용, 없으면 내부 상태 사용
    if (externalOnDragStart) {
      externalOnDragStart(caddie);
    } else {
      setInternalDraggedCaddie(caddie);
    }
  };

  // 드래그 종료 핸들러
  const handleDragEnd = () => {
    // 외부 드래그 핸들러가 있으면 사용, 없으면 내부 상태 사용
    if (externalOnDragEnd) {
      externalOnDragEnd();
    } else {
      setInternalDraggedCaddie(null);
    }
    setDragOverPosition(null);
  };

  // 드래그 오버 핸들러
  const handleDragOver = (
    e: React.DragEvent,
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverPosition({ fieldIndex, timeIndex, part });
  };

  // 드래그 리브 핸들러
  const handleDragLeave = () => {
    setDragOverPosition(null);
  };

  // 캐디의 배치 횟수 계산
  const getCaddieAssignmentCount = (caddieId: string) => {
    let count = 0;
    for (const [positionKey] of caddiePositions) {
      if (positionKey.startsWith(caddieId + "_")) {
        count++;
      }
    }
    return count;
  };

  // 드롭 핸들러
  const handleDrop = (
    e: React.DragEvent,
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    e.preventDefault();

    if (!draggedCaddie) return;

    const draggedCaddieId = draggedCaddie.id.toString();
    const currentAssignmentCount = getCaddieAssignmentCount(draggedCaddieId);

    // 최대 3번까지만 배치 가능
    if (currentAssignmentCount >= 3) {
      alert(
        `${draggedCaddie.name} 캐디는 이미 3번 배치되어 더 이상 배치할 수 없습니다.`
      );
      // 드래그 상태 초기화
      if (externalOnDragEnd) {
        externalOnDragEnd();
      } else {
        setInternalDraggedCaddie(null);
      }
      setDragOverPosition(null);
      return;
    }

    const newPositions = new Map(caddiePositions);

    // 해당 위치에 이미 있는 캐디 제거 (드롭 위치에서만)
    const existingPositionKey = Array.from(newPositions.entries()).find(
      ([, position]) =>
        position.fieldIndex === fieldIndex &&
        position.timeIndex === timeIndex &&
        position.part === part
    );

    if (existingPositionKey) {
      newPositions.delete(existingPositionKey[0]);
    }

    // 새로운 위치에 캐디 배치 (고유한 키 생성)
    const positionKey = `${draggedCaddieId}_${fieldIndex}_${timeIndex}_${part}`;
    newPositions.set(positionKey, {
      fieldIndex,
      timeIndex,
      part,
    });

    // 외부에서 드래그된 캐디인 경우 별도 저장
    if (
      externalDraggedCaddie &&
      !caddies.find((c) => c.id === draggedCaddie.id)
    ) {
      const newExternalCaddies = new Map(externalCaddies);
      newExternalCaddies.set(draggedCaddieId, draggedCaddie);
      setExternalCaddies(newExternalCaddies);
    }

    setCaddiePositions(newPositions);

    // 드래그 상태 초기화
    if (externalOnDragEnd) {
      externalOnDragEnd();
    } else {
      setInternalDraggedCaddie(null);
    }
    setDragOverPosition(null);
  };

  // 리셋 핸들러
  const handleReset = () => {
    initializeCaddiePositions();
    setExternalCaddies(new Map()); // 외부 캐디들도 초기화
    onResetClick();
  };

  return (
    <div className="w-[948px]">
      {/* 라운딩 관리 상단 */}
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

          {/* 초기화 버튼 */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-[#FEB912] text-white font-semibold rounded-md hover:bg-[#e5a50f] transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
            초기화
          </button>
        </div>
      </div>

      {/* 통합 스케줄 테이블 */}
      <div className="bg-white rounded-lg overflow-x-auto">
        <table className="min-w-full">
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
                {fields.map((field, fieldIndex) => {
                  const caddie = getCaddieAtPosition(fieldIndex, timeIndex, 1);
                  const isDropTarget =
                    dragOverPosition?.fieldIndex === fieldIndex &&
                    dragOverPosition?.timeIndex === timeIndex &&
                    dragOverPosition?.part === 1;

                  return (
                    <td
                      key={field.id}
                      className={`py-2 px-1 text-center ${
                        isDropTarget ? "bg-blue-100" : ""
                      }`}
                      style={{ minWidth: "200px" }}
                      onDragOver={(e) =>
                        handleDragOver(e, fieldIndex, timeIndex, 1)
                      }
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, fieldIndex, timeIndex, 1)}
                    >
                      <div className="flex justify-center">
                        {caddie ? (
                          <CaddieCard
                            caddie={caddie}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            isDragging={draggedCaddie?.id === caddie.id}
                          />
                        ) : (
                          <CaddieCard isEmpty={true} />
                        )}
                      </div>
                    </td>
                  );
                })}
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
                {fields.map((field, fieldIndex) => {
                  const caddie = getCaddieAtPosition(fieldIndex, timeIndex, 2);
                  const isDropTarget =
                    dragOverPosition?.fieldIndex === fieldIndex &&
                    dragOverPosition?.timeIndex === timeIndex &&
                    dragOverPosition?.part === 2;

                  return (
                    <td
                      key={field.id}
                      className={`py-2 px-1 text-center ${
                        isDropTarget ? "bg-blue-100" : ""
                      }`}
                      style={{ minWidth: "200px" }}
                      onDragOver={(e) =>
                        handleDragOver(e, fieldIndex, timeIndex, 2)
                      }
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, fieldIndex, timeIndex, 2)}
                    >
                      <div className="flex justify-center">
                        {caddie ? (
                          <CaddieCard
                            caddie={caddie}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            isDragging={draggedCaddie?.id === caddie.id}
                          />
                        ) : (
                          <CaddieCard
                            isEmpty={true}
                            emptyText={timeIndex >= 2 ? "예약없음" : "미배정"}
                          />
                        )}
                      </div>
                    </td>
                  );
                })}
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
                {fields.map((field, fieldIndex) => {
                  const caddie = getCaddieAtPosition(fieldIndex, timeIndex, 3);
                  const isDropTarget =
                    dragOverPosition?.fieldIndex === fieldIndex &&
                    dragOverPosition?.timeIndex === timeIndex &&
                    dragOverPosition?.part === 3;

                  return (
                    <td
                      key={field.id}
                      className={`py-2 px-1 text-center ${
                        isDropTarget ? "bg-blue-100" : ""
                      }`}
                      style={{ minWidth: "200px" }}
                      onDragOver={(e) =>
                        handleDragOver(e, fieldIndex, timeIndex, 3)
                      }
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, fieldIndex, timeIndex, 3)}
                    >
                      <div className="flex justify-center">
                        {caddie ? (
                          <CaddieCard
                            caddie={caddie}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            isDragging={draggedCaddie?.id === caddie.id}
                          />
                        ) : (
                          <CaddieCard isEmpty={true} />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
