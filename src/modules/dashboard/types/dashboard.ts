import { UserRole } from "@/shared/types/user";

// 공지사항 타입
export type AnnouncementType = "JCADDIE" | "GOLF_COURSE";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isNew: boolean;
  createdAt: Date;
  type: AnnouncementType;
}

// 통계 데이터 인터페이스
export interface StatCard {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

// 차트 데이터 인터페이스
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor?: string;
  }[];
}

// Master 대시보드 데이터
export interface MasterDashboardData {
  contractStats: {
    total: number;
    contract: number;
    waiting: number;
  };
  userStats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
  };
  contractChart: ChartData;
  userChart: ChartData;
}

// 근무 통계 (Admin용)
export interface WorkStatistics {
  position: string;
  averageHours: number;
  ranking: {
    rank: number;
    name: string;
    count: number;
  }[];
}

// Admin 대시보드 데이터
export interface AdminDashboardData {
  workStatistics: WorkStatistics[];
  teamChart: ChartData;
  topWorker: {
    name: string;
    position: string;
    workCount: number;
  };
  bottomWorker: {
    name: string;
    position: string;
    workCount: number;
  };
}

// 역할별 대시보드 데이터
export interface DashboardData {
  announcements: {
    jcaddie: Announcement[];
    golfCourse?: Announcement[];
  };
  master?: MasterDashboardData;
  admin?: AdminDashboardData;
}

// 대시보드 섹션 타입
export type DashboardSection =
  | "announcements"
  | "contract-status"
  | "user-status"
  | "work-hours"
  | "team-count"
  | "worker-ranking";

// 역할별 섹션 매핑
export const ROLE_SECTIONS: Record<UserRole, DashboardSection[]> = {
  MASTER: ["announcements", "contract-status", "user-status"],
  ADMIN: ["announcements", "work-hours", "team-count", "worker-ranking"],
  DEV: ["announcements", "work-hours", "team-count", "worker-ranking"], // DEV 추가
};
