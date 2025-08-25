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

// API 응답 타입들
export interface DailyScheduleDetailData {
  id: string;
  date: string;
  schedule_type: string;
  time_interval: number;
  total_staff: number;
  available_staff: number;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  golf_course: {
    id: string;
    name: string;
  };
  fields: Array<{
    id: string;
    name: string;
    order: number;
    is_active: boolean;
  }>;
  caddies: Array<{
    id: string;
    name: string;
    phone: string;
    primary_group: {
      id: number;
      name: string;
      order: number;
    };
    primary_group_order: number;
    special_group: {
      id: number;
      name: string;
      order: number;
    };
    special_group_order: number;
    today_status: string | null;
    is_active: boolean;
  }>;
  parts: Array<{
    id: string;
    part_number: number;
    name: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
    slots: Array<{
      id: string;
      start_time: string;
      field_number: number;
      status: string;
      slot_type: string;
      is_locked: boolean;
      caddie: { id: string; name: string } | null;
      special_group: string | null;
      assigned_by: string | null;
      assigned_at: string | null;
    }>;
  }>;
  filter_metadata?: FilterMetadata;
}

export interface DailyScheduleDetailResponse {
  success: boolean;
  message: string;
  data: DailyScheduleDetailData;
}

// 필터 메타데이터 타입
export interface FilterMetadata {
  status_options: Array<{
    id: string;
    name: string;
  }>;
  primary_groups: Array<{
    id: string;
    name: string;
    order: number;
  }>;
  special_groups: Array<{
    id: string;
    name: string;
    order: number;
  }>;
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
  filter_metadata?: FilterMetadata;
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

// 필터 옵션 타입
export interface FilterOptions {
  status: Array<{ id: string; name: string }>;
  groups: Array<{ id: string; name: string; order: number }>;
  badges: Array<{ id: string; name: string; order: number }>;
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

// ================================
// 상태 관리 타입
// ================================

// 근무 상세 페이지 상태 타입
export interface WorkDetailState {
  scheduleData: {
    date: string;
    golfCourseId: string;
    schedules: Array<{
      id: string;
      golfCourse: string;
      golfCourseName: string;
      scheduleType: string;
      date: string;
      totalStaff: number;
      availableStaff: number;
      status: string;
      createdBy: string;
      createdByName: string;
      partsCount: number;
      timeInterval: number;
      createdAt: string;
      updatedAt: string;
    }>;
    scheduleParts: Array<{
      scheduleId: string;
      partNumber: number;
      startTime: string;
      endTime: string;
    }>;
  } | null;
  detailData: {
    fields: Array<{
      id: string;
      name: string;
      order: number;
      is_active: boolean;
    }>;
    caddies: Array<{
      id: string;
      name: string;
      phone: string;
      primary_group: {
        id: number;
        name: string;
        order: number;
      };
      primary_group_order: number;
      special_group: {
        id: number;
        name: string;
        order: number;
      };
      special_group_order: number;
      today_status: string | null;
      is_active: boolean;
    }>;
    parts: Array<{
      id: string;
      part_number: number;
      name: string;
      start_time: string;
      end_time: string;
      is_active: boolean;
      slots: Array<{
        id: string;
        start_time: string;
        field_number: number;
        status: string;
        slot_type: string;
        is_locked: boolean;
        caddie: { id: string; name: string } | null;
        special_group: string | null;
        assigned_by: string | null;
        assigned_at: string | null;
      }>;
    }>;
    filter_metadata?: FilterMetadata;
  } | null;
  isLoading: boolean;
  error: string | null;
}
