"use client";

import { useState, useMemo } from "react";
import { MasterDashboardData } from "../../types";
import { DASHBOARD_STYLES, DASHBOARD_COLORS } from "../../constants/styles";
import {
  PeriodToggle,
  StatBadge,
  ChartPlaceholder,
  SectionHeader,
  type PeriodType,
  type StatBadgeItem,
  type LegendItem,
} from "../common";

interface ContractStatusSectionProps {
  data: MasterDashboardData;
}

const ContractStatusSection = ({ data }: ContractStatusSectionProps) => {
  const [viewType, setViewType] = useState<PeriodType>("daily");
  const { contractStats } = data;

  // 통계 배지 데이터
  const statBadgeItems: StatBadgeItem[] = useMemo(
    () => [
      {
        label: "총계",
        value: contractStats.total,
        color: DASHBOARD_COLORS.CONTRACT.TOTAL,
      },
      {
        label: "계약",
        value: contractStats.contract,
        color: DASHBOARD_COLORS.CONTRACT.CONTRACT,
      },
    ],
    [contractStats]
  );

  // 범례 데이터
  const legendItems: LegendItem[] = useMemo(
    () => [
      {
        label: "총계",
        color: DASHBOARD_COLORS.CONTRACT.TOTAL,
      },
      {
        label: "계약",
        color: DASHBOARD_COLORS.CONTRACT.CONTRACT,
      },
      {
        label: "대기",
        color: DASHBOARD_COLORS.CONTRACT.WAITING,
      },
    ],
    []
  );

  return (
    <div
      className={`${DASHBOARD_STYLES.CARD} ${DASHBOARD_STYLES.CARD_PADDING}`}
    >
      <SectionHeader
        title="계약 현황"
        rightElement={
          <div className="flex items-center gap-2">
            <StatBadge items={statBadgeItems} />
            <PeriodToggle value={viewType} onChange={setViewType} />
          </div>
        }
      />

      <ChartPlaceholder legends={legendItems} />
    </div>
  );
};

export default ContractStatusSection;
