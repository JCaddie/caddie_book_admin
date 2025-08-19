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
    group_type: "SPECIAL" as const,
    golf_course_id: "",
    is_active: true,
    color: "bg-yellow-500",
    description: "기본 특수반",
    isActive: true,
  },
  {
    id: "2",
    name: "특수반 B",
    group_type: "SPECIAL" as const,
    golf_course_id: "",
    is_active: true,
    color: "bg-orange-500",
    description: "기본 특수반",
    isActive: true,
  },
  {
    id: "3",
    name: "특수반 C",
    group_type: "SPECIAL" as const,
    golf_course_id: "",
    is_active: true,
    color: "bg-red-500",
    description: "기본 특수반",
    isActive: true,
  },
];

// 사용되지 않는 상수들 제거됨
// 필요시 개별 컴포넌트에서 직접 정의하여 사용
