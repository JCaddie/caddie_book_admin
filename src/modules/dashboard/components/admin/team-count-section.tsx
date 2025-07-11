"use client";

import { useMemo, useState } from "react";
import { DASHBOARD_COLORS } from "../../constants/styles";
import { mockAdminData } from "../../constants/mock-data";
import {
  LineChartComponent,
  type LineChartLegendItem,
  PeriodToggle,
  type PeriodType,
} from "../common";

const TeamCountSection = () => {
  const [viewType, setViewType] = useState<PeriodType>("daily");

  // 범례 데이터
  const legendItems: LineChartLegendItem[] = useMemo(
    () => [
      {
        label: "팀",
        color: DASHBOARD_COLORS.ADMIN.TEAM,
      },
    ],
    []
  );

  return (
    <div className="bg-white rounded-xl flex flex-col gap-2 h-[366px]">
      {/* 헤더 - WorkHoursSection과 동일한 높이 */}
      <div className="flex justify-between items-center px-2 min-h-[40px]">
        <h3 className="text-lg font-bold text-gray-800">받은 팀 수</h3>
        <PeriodToggle value={viewType} onChange={setViewType} />
      </div>

      {/* 차트 영역 */}
      <div className="flex-1 rounded-xl">
        <LineChartComponent
          chartData={mockAdminData.teamChart}
          legends={legendItems}
          type="team"
          height={252}
        />
      </div>
    </div>
  );
};

export default TeamCountSection;
