"use client";

import { useMemo, useState } from "react";
import { MasterDashboardData } from "../../types";
import { StatsSectionConfig } from "../../constants/stats-configs";
import {
  LineChartComponent,
  type LineChartLegendItem,
  PeriodToggle,
  type PeriodType,
  StatBadge,
  type StatBadgeItem,
} from "../common";

interface StatsSectionProps {
  data: MasterDashboardData;
  config: StatsSectionConfig;
}

const StatsSection = ({ data, config }: StatsSectionProps) => {
  const [viewType, setViewType] = useState<PeriodType>("daily");
  const statsData = data[config.dataKey];

  // 통계 배지 데이터
  const statBadgeItems: StatBadgeItem[] = useMemo(() => {
    const values = Object.values(statsData);
    return [
      {
        label: config.labels.stat1,
        value: values[0],
        color: config.colors.primary,
      },
      {
        label: config.labels.stat2,
        value: values[1],
        color: config.colors.secondary,
      },
      {
        label: config.labels.stat3,
        value: values[2],
        color: config.colors.tertiary,
      },
    ];
  }, [statsData, config.labels, config.colors]);

  // 범례 데이터
  const legendItems: LineChartLegendItem[] = useMemo(
    () => [
      {
        label: config.legendLabels.legend1,
        color: config.colors.primary,
      },
      {
        label: config.legendLabels.legend2,
        color: config.colors.secondary,
      },
      {
        label: config.legendLabels.legend3,
        color: config.colors.tertiary,
      },
    ],
    [config.legendLabels, config.colors]
  );

  return (
    <div className="bg-white rounded-xl flex flex-col gap-2">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-2">
        <h3 className="text-lg font-bold text-gray-800">{config.title}</h3>
        <PeriodToggle value={viewType} onChange={setViewType} />
      </div>

      {/* 차트 영역 */}
      <div className="border border-gray-200 rounded-xl p-4">
        {/* 통계 배지 */}
        <div className="mb-4">
          <StatBadge items={statBadgeItems} />
        </div>

        <LineChartComponent
          chartData={
            config.dataKey === "contractStats"
              ? data.contractChart
              : data.userChart
          }
          legends={legendItems}
          type={config.dataKey === "contractStats" ? "contract" : "user"}
        />
      </div>
    </div>
  );
};

export default StatsSection;
