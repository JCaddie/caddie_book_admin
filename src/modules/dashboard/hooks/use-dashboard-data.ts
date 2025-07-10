import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shared/hooks/use-auth";
import {
  DashboardData,
  MasterDashboardData,
  AdminDashboardData,
  Announcement,
} from "../types";

// Mock 데이터 (실제 구현 시 API 호출로 대체)
const mockMasterData: MasterDashboardData = {
  contractStats: {
    total: 152,
    contract: 25,
    waiting: 127,
  },
  userStats: {
    totalUsers: 152,
    activeUsers: 25,
    inactiveUsers: 25,
  },
  contractChart: {
    labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
    datasets: [
      {
        label: "총계",
        data: [100, 120, 130, 140, 150, 152],
        borderColor: "#5372F6",
        backgroundColor: "rgba(83, 114, 246, 0.1)",
      },
      {
        label: "계약",
        data: [10, 15, 18, 20, 23, 25],
        borderColor: "#F99807",
        backgroundColor: "rgba(249, 152, 7, 0.1)",
      },
    ],
  },
  userChart: {
    labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
    datasets: [
      {
        label: "누적 가입자",
        data: [100, 120, 130, 140, 150, 152],
        borderColor: "#7107F9",
        backgroundColor: "rgba(113, 7, 249, 0.1)",
      },
      {
        label: "재직",
        data: [20, 22, 23, 24, 25, 25],
        borderColor: "#217F81",
        backgroundColor: "rgba(33, 127, 129, 0.1)",
      },
      {
        label: "휴직",
        data: [5, 8, 10, 15, 20, 25],
        borderColor: "#D44947",
        backgroundColor: "rgba(212, 73, 71, 0.1)",
      },
    ],
  },
};

const mockAdminData: AdminDashboardData = {
  workStatistics: [
    {
      position: "하우스",
      averageHours: 6,
      ranking: [
        { rank: 1, name: "홍길동", count: 6 },
        { rank: 2, name: "김철수", count: 5 },
        { rank: 3, name: "이영희", count: 4 },
      ],
    },
    {
      position: "2·3부",
      averageHours: 5,
      ranking: [
        { rank: 1, name: "박민수", count: 6 },
        { rank: 2, name: "최지영", count: 5 },
        { rank: 3, name: "정태윤", count: 4 },
      ],
    },
    {
      position: "마샬",
      averageHours: 4,
      ranking: [
        { rank: 1, name: "강동원", count: 6 },
        { rank: 2, name: "송혜교", count: 5 },
        { rank: 3, name: "유재석", count: 4 },
      ],
    },
  ],
  teamChart: {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [
      {
        label: "팀",
        data: [10, 15, 12, 18, 20, 25, 22],
        borderColor: "#FEB912",
        backgroundColor: "rgba(254, 185, 18, 0.1)",
      },
    ],
  },
  topWorker: {
    name: "홍길동",
    position: "하우스",
    workCount: 6,
  },
  bottomWorker: {
    name: "강감찬",
    position: "실버",
    workCount: 2,
  },
};

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "공지사항입니다.",
    content: "공지사항 내용...",
    isNew: true,
    createdAt: new Date(),
    type: "JCADDIE",
  },
  {
    id: "2",
    title:
      "공지사항입니다.공지사항입니다.공지사항입니다.공지사항입니다.공지사항입니다.",
    content: "긴 공지사항 내용...",
    isNew: true,
    createdAt: new Date(),
    type: "JCADDIE",
  },
  {
    id: "3",
    title: "공지사항입니다.",
    content: "일반 공지사항 내용...",
    isNew: false,
    createdAt: new Date(),
    type: "JCADDIE",
  },
];

const mockGolfCourseAnnouncements: Announcement[] = [
  {
    id: "4",
    title: "골프장 공지사항입니다.",
    content: "골프장 공지사항 내용...",
    isNew: true,
    createdAt: new Date(),
    type: "GOLF_COURSE",
  },
  {
    id: "5",
    title: "골프장 공지사항입니다.골프장 공지사항입니다.골프장 공지사항입니다.",
    content: "긴 골프장 공지사항 내용...",
    isNew: true,
    createdAt: new Date(),
    type: "GOLF_COURSE",
  },
];

// API 함수들 (Mock)
const fetchMasterDashboard = async (): Promise<MasterDashboardData> => {
  // 실제 구현 시 API 호출
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMasterData), 1000);
  });
};

const fetchAdminDashboard = async (): Promise<AdminDashboardData> => {
  // 실제 구현 시 API 호출
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAdminData), 1000);
  });
};

const fetchAnnouncements = async (
  type: "JCADDIE" | "GOLF_COURSE"
): Promise<Announcement[]> => {
  // 실제 구현 시 API 호출
  return new Promise((resolve) => {
    setTimeout(() => {
      const data =
        type === "JCADDIE" ? mockAnnouncements : mockGolfCourseAnnouncements;
      resolve(data);
    }, 800);
  });
};

// 메인 대시보드 데이터 hook
export const useDashboardData = () => {
  const { user } = useAuth();

  const masterQuery = useQuery({
    queryKey: ["dashboard", "master"],
    queryFn: fetchMasterDashboard,
    enabled: user?.role === "MASTER",
  });

  const adminQuery = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: fetchAdminDashboard,
    enabled: user?.role === "ADMIN",
  });

  const jcaddieAnnouncementsQuery = useQuery({
    queryKey: ["announcements", "jcaddie"],
    queryFn: () => fetchAnnouncements("JCADDIE"),
  });

  const golfCourseAnnouncementsQuery = useQuery({
    queryKey: ["announcements", "golf-course"],
    queryFn: () => fetchAnnouncements("GOLF_COURSE"),
    enabled: user?.role === "ADMIN",
  });

  const isLoading =
    masterQuery.isLoading ||
    adminQuery.isLoading ||
    jcaddieAnnouncementsQuery.isLoading ||
    (user?.role === "ADMIN" && golfCourseAnnouncementsQuery.isLoading);

  const data: DashboardData = {
    announcements: {
      jcaddie: jcaddieAnnouncementsQuery.data || [],
      golfCourse: golfCourseAnnouncementsQuery.data || [],
    },
    master: masterQuery.data,
    admin: adminQuery.data,
  };

  return {
    data,
    isLoading,
    role: user?.role,
    refetch: () => {
      jcaddieAnnouncementsQuery.refetch();
      if (user?.role === "MASTER") {
        masterQuery.refetch();
      } else if (user?.role === "ADMIN") {
        adminQuery.refetch();
        golfCourseAnnouncementsQuery.refetch();
      }
    },
  };
};
