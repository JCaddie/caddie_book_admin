"use client";

import { useState, useMemo } from "react";
import { DASHBOARD_STYLES, DASHBOARD_COLORS } from "../../constants/styles";
import {
  PeriodToggle,
  ChartPlaceholder,
  SectionHeader,
  type PeriodType,
  type LegendItem,
} from "../common";

const TeamCountSection = () => {
  const [viewType, setViewType] = useState<PeriodType>("daily");

  // 범례 데이터
  const legendItems: LegendItem[] = useMemo(
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
      className={`${DASHBOARD_STYLES.CARD} ${DASHBOARD_STYLES.CARD_PADDING}`}
    >
      <SectionHeader
        title="받은 팀 수"
        rightElement={<PeriodToggle value={viewType} onChange={setViewType} />}
      />

      <ChartPlaceholder legends={legendItems} />
    </div>
  );
};

export default TeamCountSection;
