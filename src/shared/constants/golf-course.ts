import { GolfCourse } from "@/shared/types/golf-course";

// 골프장 필터 옵션
export const GOLF_COURSE_FILTER_OPTIONS = {
  contract: [
    { value: "completed", label: "완료" },
    { value: "pending", label: "대기" },
    { value: "rejected", label: "거절" },
  ],
  holes: [
    { value: "18", label: "18홀" },
    { value: "27", label: "27홀" },
    { value: "36", label: "36홀" },
  ],
  membershipType: [
    { value: "member", label: "회원제" },
    { value: "public", label: "퍼블릭" },
  ],
  category: [
    { value: "premium", label: "프리미엄" },
    { value: "standard", label: "일반" },
  ],
  dailyTeams: [
    { value: "high", label: "많음" },
    { value: "medium", label: "보통" },
    { value: "low", label: "적음" },
  ],
};

// 계약 상태 옵션
export const CONTRACT_STATUS_OPTIONS = [
  { value: "계약", label: "계약" },
  { value: "대기", label: "대기" },
  { value: "만료", label: "만료" },
  { value: "해지", label: "해지" },
];

// 기본 셀 렌더러
const renderCell = (value: unknown, record: GolfCourse) => {
  if ("isEmpty" in record && record.isEmpty) return null;
  return String(value || "");
};

// 골프장 테이블 컬럼 정의
export const GOLF_COURSE_TABLE_COLUMNS = [
  {
    key: "no",
    title: "No.",
    width: 80,
    align: "center" as const,
    render: renderCell,
  },
  {
    key: "name",
    title: "골프장명",
    width: 200,
    align: "left" as const,
    render: renderCell,
  },
  {
    key: "region",
    title: "시/구",
    align: "center" as const,
    render: renderCell,
  },
  {
    key: "contractStatus",
    title: "계약 현황",
    align: "center" as const,
    render: renderCell,
  },
  {
    key: "phone",
    title: "대표 번호",
    width: 150,
    align: "center" as const,
    render: renderCell,
  },
  {
    key: "membershipType",
    title: "회원제/퍼블릭",
    align: "center" as const,
    render: renderCell,
  },
  {
    key: "caddies",
    title: "캐디",
    width: 80,
    align: "center" as const,
    render: renderCell,
  },
  {
    key: "fields",
    title: "필드",
    width: 80,
    align: "center" as const,
    render: renderCell,
  },
];

// 골프장 빈 행 템플릿
export const GOLF_COURSE_EMPTY_ROW_TEMPLATE = {
  no: 0,
  name: "",
  region: "",
  contractStatus: "",
  phone: "",
  membershipType: "",
  caddies: 0,
  fields: 0,
};

// 운영현황 카드 생성 함수
export const createOperationCards = (
  golfCourseName: string,
  stats: {
    caddies: number;
    admins: number;
    reservations: number;
    fields: number;
    carts: number;
  }
) => [
  {
    title: "캐디",
    value: `${stats.caddies}명`,
    route: "/caddies",
    searchParam: golfCourseName,
  },
  {
    title: "관리자",
    value: `${stats.admins}명`,
    route: "/users",
    searchParam: golfCourseName,
  },
  {
    title: "근무",
    value: `예약 ${stats.reservations}건`,
    route: "/works",
    searchParam: golfCourseName,
  },
  {
    title: "필드",
    value: `${stats.fields}개`,
    route: "/fields",
    searchParam: golfCourseName,
  },
  {
    title: "카트",
    value: `${stats.carts}대`,
    route: "/carts",
    searchParam: golfCourseName,
  },
];

// 골프장 목록 (개발사 권한에서 사용)
export const GOLF_COURSE_LIST = [
  { id: "golf-course-1", name: "송도골프클럽" },
  { id: "golf-course-2", name: "해운대골프클럽" },
  { id: "golf-course-3", name: "제주골프클럽" },
  { id: "golf-course-4", name: "강남골프클럽" },
  { id: "golf-course-5", name: "부산골프클럽" },
  { id: "golf-course-6", name: "경주골프클럽" },
  { id: "golf-course-7", name: "대구골프클럽" },
  { id: "golf-course-8", name: "용인골프클럽" },
  { id: "golf-course-9", name: "포항골프클럽" },
  { id: "golf-course-10", name: "천안골프클럽" },
  { id: "golf-course-11", name: "전주골프클럽" },
  { id: "golf-course-12", name: "광주골프클럽" },
  { id: "golf-course-13", name: "울산골프클럽" },
  { id: "golf-course-14", name: "수원골프클럽" },
  { id: "golf-course-15", name: "춘천골프클럽" },
  { id: "golf-course-16", name: "강릉골프클럽" },
  { id: "golf-course-17", name: "서산골프클럽" },
  { id: "golf-course-18", name: "청주골프클럽" },
  { id: "golf-course-19", name: "목포골프클럽" },
  { id: "golf-course-20", name: "여수골프클럽" },
  { id: "golf-course-21", name: "안동골프클럽" },
  { id: "golf-course-22", name: "진주골프클럽" },
  { id: "golf-course-23", name: "창원골프클럽" },
  { id: "golf-course-24", name: "순천골프클럽" },
  { id: "golf-course-25", name: "속초골프클럽" },
] as const;

// 드롭다운 옵션 형태로 변환
export const GOLF_COURSE_DROPDOWN_OPTIONS = [
  { value: "", label: "전체 골프장" },
  ...GOLF_COURSE_LIST.map((course) => ({
    value: course.id,
    label: course.name,
  })),
];
