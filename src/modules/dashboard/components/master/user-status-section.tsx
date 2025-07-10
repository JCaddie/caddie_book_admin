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

interface UserStatusSectionProps {
  data: MasterDashboardData;
}

const UserStatusSection = ({ data }: UserStatusSectionProps) => {
  const [viewType, setViewType] = useState<PeriodType>("daily");
  const { userStats } = data;

  // 통계 배지 데이터
  const statBadgeItems: StatBadgeItem[] = useMemo(
    () => [
      {
        label: "누적 가입자",
        value: userStats.totalUsers,
        color: DASHBOARD_COLORS.USER.TOTAL,
      },
      {
        label: "재직",
        value: userStats.activeUsers,
        color: DASHBOARD_COLORS.USER.ACTIVE,
      },
      {
        label: "휴직",
        value: userStats.inactiveUsers,
        color: DASHBOARD_COLORS.USER.INACTIVE,
      },
    ],
    [userStats]
  );

  // 범례 데이터
  const legendItems: LegendItem[] = useMemo(
    () => [
      {
        label: "가입자",
        color: DASHBOARD_COLORS.USER.TOTAL,
      },
      {
        label: "재직",
        color: DASHBOARD_COLORS.USER.ACTIVE,
      },
      {
        label: "휴직",
        color: DASHBOARD_COLORS.USER.INACTIVE,
      },
    ],
    []
  );

  return (
    <div
      className={`${DASHBOARD_STYLES.CARD} ${DASHBOARD_STYLES.CARD_PADDING}`}
    >
      <SectionHeader
        title="가입자 현황"
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

export default UserStatusSection;
