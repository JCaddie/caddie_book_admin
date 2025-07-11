import {
  AdminDashboardData,
  Announcement,
  MasterDashboardData,
} from "../types";

// Master 대시보드 Mock 데이터
export const mockMasterData: MasterDashboardData = {
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

// Admin 대시보드 Mock 데이터
export const mockAdminData: AdminDashboardData = {
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
    {
      position: "3부",
      averageHours: 3,
      ranking: [
        { rank: 1, name: "정우성", count: 4 },
        { rank: 2, name: "김태희", count: 3 },
        { rank: 3, name: "이민호", count: 3 },
      ],
    },
    {
      position: "새싹",
      averageHours: 2,
      ranking: [
        { rank: 1, name: "박서준", count: 3 },
        { rank: 2, name: "김고은", count: 2 },
        { rank: 3, name: "유아인", count: 2 },
      ],
    },
    {
      position: "실버",
      averageHours: 2,
      ranking: [
        { rank: 1, name: "강감찬", count: 3 },
        { rank: 2, name: "이순신", count: 2 },
        { rank: 3, name: "세종대왕", count: 2 },
      ],
    },
    {
      position: "주말",
      averageHours: 2,
      ranking: [
        { rank: 1, name: "김유신", count: 3 },
        { rank: 2, name: "을지문덕", count: 2 },
        { rank: 3, name: "연개소문", count: 2 },
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

// 공지사항 Mock 데이터
export const mockAnnouncements: Announcement[] = [
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
  {
    id: "4",
    title: "공지사항입니다.",
    content: "공지사항 내용...",
    isNew: false,
    createdAt: new Date(),
    type: "JCADDIE",
  },
  {
    id: "5",
    title: "골프장 공지사항입니다.",
    content: "골프장 공지사항 내용...",
    isNew: true,
    createdAt: new Date(),
    type: "GOLF_COURSE",
  },
  {
    id: "6",
    title: "골프장 공지사항입니다.",
    content: "골프장 공지사항 내용...",
    isNew: false,
    createdAt: new Date(),
    type: "GOLF_COURSE",
  },
];

// Mock API 함수들
export const fetchMasterDashboard = async (): Promise<MasterDashboardData> => {
  // 실제 API 호출 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockMasterData;
};

export const fetchAdminDashboard = async (): Promise<AdminDashboardData> => {
  // 실제 API 호출 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockAdminData;
};

export const fetchAnnouncements = async (
  type: "JCADDIE" | "GOLF_COURSE"
): Promise<Announcement[]> => {
  // 실제 API 호출 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockAnnouncements.filter((announcement) => announcement.type === type);
};
