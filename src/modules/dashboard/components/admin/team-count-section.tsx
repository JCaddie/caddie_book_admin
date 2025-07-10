"use client";

import { useState, useMemo } from "react";
import { DASHBOARD_COLORS } from "../../constants/styles";
import { mockAdminData } from "../../constants/mock-data";
import {
  PeriodToggle,
  LineChartComponent,
  type PeriodType,
  type LineChartLegendItem,
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
    <div
      className="bg-white rounded-xl flex flex-col gap-2"
      style={{ width: "1208px", height: "366px" }}
    >
      <div className="flex justify-between items-center px-2">
        <h3 className="text-lg font-bold text-gray-800">받은 팀 수</h3>
        <PeriodToggle value={viewType} onChange={setViewType} />
      </div>

      <div className="flex-1 rounded-xl">
        <LineChartComponent
          chartData={mockAdminData.teamChart}
          legends={legendItems}
          type="team"
          height={270}
        />
      </div>
    </div>
  );
};

export default TeamCountSection;
