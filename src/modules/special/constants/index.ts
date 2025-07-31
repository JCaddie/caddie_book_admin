// ================================
// 특수반 관리 상수
// ================================

// 특수반 색상 옵션
export const SPECIAL_GROUP_COLORS = [
  { value: "bg-yellow-500", label: "노란색", color: "#F59E0B" },
  { value: "bg-orange-500", label: "주황색", color: "#F97316" },
  { value: "bg-red-500", label: "빨간색", color: "#EF4444" },
  { value: "bg-pink-500", label: "분홍색", color: "#EC4899" },
  { value: "bg-purple-500", label: "보라색", color: "#8B5CF6" },
  { value: "bg-indigo-500", label: "남색", color: "#6366F1" },
  { value: "bg-blue-500", label: "파란색", color: "#3B82F6" },
  { value: "bg-teal-500", label: "청록색", color: "#14B8A6" },
];

// 특수반 상태 옵션
export const SPECIAL_GROUP_STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "active", label: "활성" },
  { value: "inactive", label: "비활성" },
];

// 시간 슬롯 (30분 단위)
export const TIME_SLOTS = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

// 특수반 스케줄 상태
export const SCHEDULE_STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "scheduled", label: "예정" },
  { value: "completed", label: "완료" },
  { value: "cancelled", label: "취소" },
];

// 기본 특수반 설정
export const DEFAULT_SPECIAL_GROUPS = [
  {
    id: "1",
    name: "특수반 A",
    color: "bg-yellow-500",
    description: "기본 특수반",
    isActive: true,
  },
  {
    id: "2",
    name: "특수반 B",
    color: "bg-orange-500",
    description: "기본 특수반",
    isActive: true,
  },
  {
    id: "3",
    name: "특수반 C",
    color: "bg-red-500",
    description: "기본 특수반",
    isActive: true,
  },
];

// 특수반 관리 UI 텍스트
export const SPECIAL_GROUP_UI_TEXT = {
  pageTitle: "특수반 관리",
  buttons: {
    setting: "특수반 설정",
    addCaddie: "캐디 추가",
    save: "저장",
    cancel: "취소",
    delete: "삭제",
    edit: "수정",
  },
  labels: {
    groupName: "특수반 이름",
    groupColor: "특수반 색상",
    groupDescription: "특수반 설명",
    groupStatus: "특수반 상태",
    time: "시간",
    unassigned: "미배정 캐디",
    available: "배치 가능",
    totalGroups: "총 특수반 수",
    activeGroups: "활성 특수반 수",
    totalMembers: "총 멤버 수",
    activeMembers: "활성 멤버 수",
  },
  placeholders: {
    groupName: "특수반 이름을 입력하세요",
    groupDescription: "특수반 설명을 입력하세요",
    searchCaddie: "캐디를 검색하세요",
  },
  messages: {
    noGroups: "생성된 특수반이 없습니다.",
    noCaddies: "배정된 캐디가 없습니다.",
    noSchedules: "예정된 스케줄이 없습니다.",
    createGroup: "새로운 특수반을 생성하세요",
    deleteConfirm: "정말로 이 특수반을 삭제하시겠습니까?",
    saveSuccess: "특수반이 성공적으로 저장되었습니다.",
    deleteSuccess: "특수반이 성공적으로 삭제되었습니다.",
  },
};

// 특수반 관리 폼 검증 규칙
export const SPECIAL_GROUP_FORM_VALIDATION = {
  groupName: {
    required: "특수반 이름은 필수입니다.",
    minLength: {
      value: 2,
      message: "특수반 이름은 최소 2자 이상이어야 합니다.",
    },
    maxLength: {
      value: 20,
      message: "특수반 이름은 최대 20자까지 가능합니다.",
    },
  },
  groupColor: {
    required: "특수반 색상을 선택해주세요.",
  },
  groupDescription: {
    maxLength: {
      value: 100,
      message: "특수반 설명은 최대 100자까지 가능합니다.",
    },
  },
};

// 특수반 관리 테이블 설정
export const SPECIAL_GROUP_TABLE_CONFIG = {
  itemsPerPage: 10,
  showPagination: true,
  showSearch: true,
  showFilters: true,
  sortableColumns: ["name", "createdAt", "updatedAt"],
  defaultSort: { column: "createdAt", direction: "desc" as const },
};
