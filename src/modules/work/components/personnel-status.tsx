"use client";

import { useState } from "react";
import { CaddieData, PersonnelFilter } from "../types";
import CaddieCard from "./caddie-card";
import HolidaySettingsModal from "./holiday-settings-modal";

interface PersonnelStatusProps {
  filters: PersonnelFilter;
  filteredCaddies: CaddieData[];
  filterOptions: {
    status: Array<{ id: string; name: string }>;
    groups: Array<{ id: string; name: string; order: number }>;
    badges: Array<{ id: string; name: string; order: number }>;
  };
  onFilterUpdate: (key: keyof PersonnelFilter, value: string) => void;
  onDragStart?: (caddie: CaddieData) => void;
  onDragEnd?: (caddie: CaddieData) => void;
  draggedCaddie?: CaddieData | null;
}

export default function PersonnelStatus({
  filters,
  filteredCaddies,
  filterOptions,
  onFilterUpdate,
  onDragStart,
  onDragEnd,
  draggedCaddie,
}: PersonnelStatusProps) {
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);

  return (
    <>
      <div className="w-[474px] bg-white rounded-lg p-4 h-fit">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[22px] font-bold text-black">인력 현황</h3>
          <div className="flex items-center gap-4">
            <span className="text-base font-medium">휴무 제한 : 4명</span>
            <button
              onClick={() => setIsHolidayModalOpen(true)}
              className="px-4 py-2 bg-[#FEB912] text-white font-semibold rounded-md text-base"
            >
              설정
            </button>
          </div>
        </div>

        {/* 필터 섹션 */}
        <div className="space-y-8 mb-8">
          <div>
            <h4 className="text-xl font-medium mb-2">필터</h4>
            <div className="h-0.5 bg-gray-300 mb-4"></div>

            {/* 상태 필터 */}
            <div className="flex items-start gap-4 mb-4">
              <span className="text-base font-medium w-12 h-[26px] flex items-center flex-shrink-0">
                상태
              </span>
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  {filterOptions.status.slice(0, 6).map((status) => (
                    <button
                      key={status.id}
                      onClick={() => onFilterUpdate("status", status.name)}
                      className={`w-[50px] h-[26px] text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 ${
                        filters.status === status.name
                          ? "bg-[#FEB912] text-white"
                          : "bg-[#E3E3E3] text-black/80"
                      }`}
                    >
                      {status.name}
                    </button>
                  ))}
                </div>
                {filterOptions.status.length > 6 && (
                  <div className="flex gap-2">
                    {filterOptions.status.slice(6).map((status) => (
                      <button
                        key={status.id}
                        onClick={() => onFilterUpdate("status", status.name)}
                        className={`w-[50px] h-[26px] text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 ${
                          filters.status === status.name
                            ? "bg-[#FEB912] text-white"
                            : "bg-[#E3E3E3] text-black/80"
                        }`}
                      >
                        {status.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 그룹 필터 */}
            <div className="flex items-start gap-4 mb-4">
              <span className="text-base font-medium w-12 h-[26px] flex items-center flex-shrink-0">
                그룹
              </span>
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  {filterOptions.groups.slice(0, 6).map((group) => (
                    <button
                      key={group.id}
                      onClick={() => onFilterUpdate("group", group.name)}
                      className={`w-[50px] h-[26px] text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 ${
                        filters.group === group.name
                          ? "bg-[#FEB912] text-white"
                          : "bg-[#E3E3E3] text-black/80"
                      }`}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>
                {filterOptions.groups.length > 6 && (
                  <div className="flex gap-2">
                    {filterOptions.groups.slice(6).map((group) => (
                      <button
                        key={group.id}
                        onClick={() => onFilterUpdate("group", group.name)}
                        className={`w-[50px] h-[26px] text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 ${
                          filters.group === group.name
                            ? "bg-[#FEB912] text-white"
                            : "bg-[#E3E3E3] text-black/80"
                        }`}
                      >
                        {group.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 특수반 필터 */}
            <div className="flex items-start gap-4">
              <span className="text-base font-medium w-12 h-[26px] flex items-center flex-shrink-0">
                특수반
              </span>
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  {filterOptions.badges.slice(0, 6).map((badge) => (
                    <button
                      key={badge.id}
                      onClick={() => onFilterUpdate("badge", badge.name)}
                      className={`w-[50px] h-[26px] text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 ${
                        filters.badge === badge.name
                          ? "bg-[#FEB912] text-white"
                          : "bg-[#E3E3E3] text-black/80"
                      }`}
                    >
                      {badge.name}
                    </button>
                  ))}
                </div>
                {filterOptions.badges.length > 6 && (
                  <div className="flex gap-2">
                    {filterOptions.badges.slice(6).map((badge) => (
                      <button
                        key={badge.id}
                        onClick={() => onFilterUpdate("badge", badge.name)}
                        className={`w-[50px] h-[26px] text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 ${
                          filters.badge === badge.name
                            ? "bg-[#FEB912] text-white"
                            : "bg-[#E3E3E3] text-black/80"
                        }`}
                      >
                        {badge.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 캐디 목록 */}
        <div>
          <h4 className="text-xl font-medium mb-2">캐디</h4>
          <div className="h-0.5 bg-gray-300 mb-4"></div>
          <div className="space-y-2">
            {filteredCaddies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                필터 조건에 맞는 캐디가 없습니다.
              </div>
            ) : (
              Array.from(
                { length: Math.ceil(filteredCaddies.length / 2) },
                (_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2">
                    {filteredCaddies
                      .slice(rowIndex * 2, rowIndex * 2 + 2)
                      .map((caddie) => (
                        <CaddieCard
                          key={caddie.id}
                          caddie={caddie}
                          onDragStart={
                            onDragStart ? () => onDragStart(caddie) : undefined
                          }
                          onDragEnd={
                            onDragEnd ? () => onDragEnd(caddie) : undefined
                          }
                          isDragging={draggedCaddie?.id === caddie.id}
                        />
                      ))}
                    {/* 한 줄에 1개만 있을 때 빈 공간 채우기 */}
                    {filteredCaddies.slice(rowIndex * 2, rowIndex * 2 + 2)
                      .length === 1 && <div className="w-[218px]"></div>}
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>

      {/* 휴무 설정 모달 */}
      <HolidaySettingsModal
        isOpen={isHolidayModalOpen}
        onClose={() => setIsHolidayModalOpen(false)}
      />
    </>
  );
}
