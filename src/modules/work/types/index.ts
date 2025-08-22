// ================================
// 핵심 근무 관련 타입
// ================================

// 근무 스케줄 데이터 타입
export interface Work extends Record<string, unknown> {
  id: string;
  no: number;
  date: string; // 일자 (YYYY.MM.DD 형식)
  golfCourse: string; // 골프장명
  golfCourseId: string; // 골프장 ID
  totalStaff: number; // 전체 인원수
  availableStaff: number; // 가용인원수
  status: "planning" | "confirmed" | "completed" | "cancelled"; // 상태
  scheduleType?: string; // 스케줄 타입 (daily, special 등)
  createdAt?: string;
  updatedAt?: string;
  isEmpty?: boolean;
}

// 근무표 상세 타입
export interface WorkSchedule {
  id: string;
  golfCourse: string;
  golfCourseId: string;
  scheduleType: string;
  date: string;
  name: string;
  totalStaff: number;
  availableStaff: number;
  status: string;
  notes: string;
  createdBy: string;
  createdByName: string;
  partsCount: number;
  parts: WorkPart[];
  createdAt: string;
  updatedAt: string;
}

// 근무 부 타입
export interface WorkPart {
  id: string;
  scheduleId: string;
  partNumber: number;
  startTime: string;
  endTime: string;
  timeInterval: number;
  isActive: boolean;
  timeSlotsCount: number;
  createdAt: string;
  updatedAt: string;
}

// 시간 슬롯 타입
export interface WorkTimeSlot {
  id: string;
  partId: string;
  partNumber: number;
  scheduleName: string;
  golfCourseName: string;
  startTime: string;
  endTime: string;
  positionIndex: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 근무 슬롯 타입
export interface WorkSlot {
  id: string;
  timeSlotId: string;
  timeSlotStartTime: string;
  timeSlotEndTime: string;
  partNumber: number;
  fieldId: string;
  fieldName: string;
  caddieId: string | null;
  caddieName: string | null;
  specialGroupId: string | null;
  specialGroupName: string | null;
  assignedById: string | null;
  assignedByName: string | null;
  assignedAt: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// 캐디 데이터 타입
export interface CaddieData {
  id: number;
  name: string;
  group: number;
  badge: string;
  status: string;
  specialBadge?: string;
  originalId?: string; // 원본 UUID string (API 연동용)
  order?: number; // 그룹 내 순서
  groupName?: string; // 그룹명
  currentIndex?: number; // 현재 인덱스 (드래그 앤 드롭용)
}

// 캐디 카드 Props 타입
export interface CaddieCardProps {
  caddie?: CaddieData;
  isEmpty?: boolean;
  emptyText?: string;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
  isSelected?: boolean;
  onClick?: (() => void) | ((caddie: CaddieData) => void);
  onStatusToggle?: () => void; // 상태 변경 핸들러
  onCaddieRemove?: () => void; // 캐디 제거 핸들러
  onDoubleClick?: () => void; // 더블클릭 시 캐디 제거 핸들러
  draggable?: boolean;
}

// 필드 타입
export interface Field {
  id: number;
  name: string;
}

// 인원 통계 타입
export interface PersonnelStats {
  total: number;
  available: number;
}

// 시간대 슬롯 타입
export interface TimeSlots {
  part1: string[];
  part2: string[];
  part3: string[];
}

// 필터 타입
export interface WorkFilters {
  status: string;
  group: string;
  badge: string;
}

// 인원 필터 타입
export interface PersonnelFilter {
  status: string;
  group: string;
  badge: string;
}

// ================================
// 라운딩 설정 타입
// ================================

// 라운딩 설정 타입
export interface RoundingSettings {
  numberOfRounds: number;
  timeUnit: number;
  roundTimes: Array<{
    round: number;
    startTime: string;
    endTime: string;
  }>;
}

// ================================
// 페이지 Props 타입
// ================================

// 근무 상세 페이지 Props
export interface WorkDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}
