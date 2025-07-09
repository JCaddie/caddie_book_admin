"use client";

import { RotateCcw } from "lucide-react";
import { Field, TimeSlots, PersonnelStats } from "../types/work-detail";
import { SAMPLE_CADDIES } from "../constants/work-detail";
import CaddieCard from "./caddie-card";

interface WorkScheduleProps {
  fields: Field[];
  timeSlots: TimeSlots;
  personnelStats: PersonnelStats;
  onResetClick: () => void;
}

export default function WorkSchedule({
  fields,
  timeSlots,
  personnelStats,
  onResetClick,
}: WorkScheduleProps) {
  // 스케줄용 캐디 데이터 (첫 6명만 사용)
  const caddies = SAMPLE_CADDIES.slice(0, 6);

  // 필드 컨텐츠 렌더링 함수
  const renderFieldContent = (field: Field) => {
    return (
      <div
        key={field.id}
        className="w-[314px] flex-shrink-0 bg-white rounded-lg overflow-hidden"
      >
        {/* 필드 헤더 */}
        <div className="bg-[#FEB912] flex items-center justify-center py-2 px-4">
          <span className="text-[22px] font-bold text-black">{field.name}</span>
        </div>

        {/* 필드 내용 */}
        <div className="bg-[#F7F7F7]">
          {/* 1부 */}
          <div>
            <div className="flex items-center justify-center py-3">
              <span className="text-[22px] font-bold text-black">1부</span>
            </div>
            <div className="p-2">
              {timeSlots.part1.map((time, timeIndex) => (
                <div key={timeIndex} className="flex items-center gap-2 mb-2">
                  <div className="w-14 h-9 flex items-center justify-center text-sm font-medium text-black/80 flex-shrink-0">
                    {time}
                  </div>
                  <div className="flex-1">
                    {timeIndex < 4 ? (
                      <CaddieCard caddie={caddies[timeIndex]} />
                    ) : (
                      <CaddieCard isEmpty={true} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2부 */}
          <div>
            <div className="flex items-center justify-center py-3">
              <span className="text-[22px] font-bold text-black">2부</span>
            </div>
            <div className="p-2">
              {timeSlots.part2.map((time, timeIndex) => (
                <div key={timeIndex} className="flex items-center gap-2 mb-2">
                  <div className="w-14 h-9 flex items-center justify-center text-sm font-medium text-black/80 flex-shrink-0">
                    {time}
                  </div>
                  <div className="flex-1">
                    {timeIndex < 2 ? (
                      <CaddieCard caddie={caddies[timeIndex + 2]} />
                    ) : (
                      <CaddieCard isEmpty={true} emptyText="예약없음" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3부 */}
          <div>
            <div className="flex items-center justify-center py-3">
              <span className="text-[22px] font-bold text-black">3부</span>
            </div>
            <div className="p-2">
              {timeSlots.part3.map((time, timeIndex) => (
                <div key={timeIndex} className="flex items-center gap-2 mb-2">
                  <div className="w-14 h-9 flex items-center justify-center text-sm font-medium text-black/80 flex-shrink-0">
                    {time}
                  </div>
                  <div className="flex-1">
                    {timeIndex < 2 ? (
                      <CaddieCard caddie={caddies[timeIndex + 4]} />
                    ) : (
                      <CaddieCard isEmpty={true} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1">
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
            onClick={onResetClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#FEB912] text-white font-semibold rounded-md hover:bg-[#e5a50f] transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
            초기화
          </button>
        </div>
      </div>

      {/* 필드별 스케줄 컨테이너 (가로 배치, 좌우 스크롤) */}
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-[1020px]">
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-fit p-4">
            {fields.map(renderFieldContent)}
          </div>
        </div>
      </div>
    </div>
  );
}
