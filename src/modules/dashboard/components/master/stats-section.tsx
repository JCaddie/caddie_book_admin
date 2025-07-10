"use client";

import { useState, useMemo } from "react";
import { MasterDashboardData } from "../../types";
import { DASHBOARD_STYLES } from "../../constants/styles";
import { StatsSectionConfig } from "../../constants/stats-configs";
import {
  PeriodToggle,
  StatBadge,
  ChartPlaceholder,
  SectionHeader,
  type PeriodType,
  type StatBadgeItem,
  type LegendItem,
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
  const legendItems: LegendItem[] = useMemo(
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
    <div
      className={`${DASHBOARD_STYLES.CARD} ${DASHBOARD_STYLES.CARD_PADDING}`}
    >
      <SectionHeader
        title={config.title}
        rightElement={<PeriodToggle value={viewType} onChange={setViewType} />}
      />

      {/* 통계 배지 - 헤더와 차트 사이에 배치 */}
      <div className="mb-4">
        <StatBadge items={statBadgeItems} />
      </div>

      <ChartPlaceholder legends={legendItems} />
    </div>
  );
};

export default StatsSection;
