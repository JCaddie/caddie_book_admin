import { DASHBOARD_COLORS } from "./styles";

export interface StatsSectionConfig {
  title: string;
  dataKey: "contractStats" | "userStats";
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  labels: {
    stat1: string;
    stat2: string;
    stat3: string;
  };
  legendLabels: {
    legend1: string;
    legend2: string;
    legend3: string;
  };
}

export const CONTRACT_STATS_CONFIG: StatsSectionConfig = {
  title: "계약 현황",
  dataKey: "contractStats",
  colors: {
    primary: DASHBOARD_COLORS.CONTRACT.TOTAL,
    secondary: DASHBOARD_COLORS.CONTRACT.CONTRACT,
    tertiary: DASHBOARD_COLORS.CONTRACT.WAITING,
  },
  labels: {
    stat1: "총계",
    stat2: "계약",
    stat3: "대기",
  },
  legendLabels: {
    legend1: "총계",
    legend2: "계약",
    legend3: "대기",
  },
};

export const USER_STATS_CONFIG: StatsSectionConfig = {
  title: "가입자 현황",
  dataKey: "userStats",
  colors: {
    primary: DASHBOARD_COLORS.USER.TOTAL,
    secondary: DASHBOARD_COLORS.USER.ACTIVE,
    tertiary: DASHBOARD_COLORS.USER.INACTIVE,
  },
  labels: {
    stat1: "누적 가입자",
    stat2: "재직",
    stat3: "휴직",
  },
  legendLabels: {
    legend1: "가입자",
    legend2: "재직",
    legend3: "휴직",
  },
};
