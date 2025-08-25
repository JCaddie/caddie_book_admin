import { Field, PersonnelStats, RoundingSettings, TimeSlots } from "../types";

// ================================
// 기본 필드 설정
// ================================

// 필드별 데이터 (4개로 확장)
export const FIELDS: Field[] = [
  { id: 1, name: "서코스" },
  { id: 2, name: "동코스" },
  { id: 3, name: "남코스" },
  { id: 4, name: "북코스" },
];

// ================================
// 인원 통계 기본값
// ================================

// 인원 통계 (샘플)
export const PERSONNEL_STATS: PersonnelStats = {
  total: 152,
  available: 125,
};

// ================================
// 시간 슬롯 관련 상수
// ================================

// 기본 시간 간격 (분)
export const DEFAULT_TIME_INTERVAL = 10;

// 기본 부별 시간 설정
export const DEFAULT_PART_TIMES = {
  part1: { start: "06:00", end: "12:30" },
  part2: { start: "13:00", end: "16:30" },
  part3: { start: "17:00", end: "19:00" },
};

// ================================
// 시간 슬롯 생성 함수
// ================================

// 기본 시간 슬롯 생성 함수
export const generateTimeSlots = (): TimeSlots => {
  return {
    part1: generateTimeSlotsForPart(
      DEFAULT_PART_TIMES.part1.start,
      DEFAULT_PART_TIMES.part1.end
    ),
    part2: generateTimeSlotsForPart(
      DEFAULT_PART_TIMES.part2.start,
      DEFAULT_PART_TIMES.part2.end
    ),
    part3: generateTimeSlotsForPart(
      DEFAULT_PART_TIMES.part3.start,
      DEFAULT_PART_TIMES.part3.end
    ),
  };
};

// 특정 시간 범위의 시간 슬롯 생성
export const generateTimeSlotsForPart = (
  startTime: string,
  endTime: string
): string[] => {
  const slots: string[] = [];
  const currentTime = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const tempTime = new Date(currentTime);

  while (tempTime < end) {
    slots.push(tempTime.toTimeString().slice(0, 5));
    tempTime.setMinutes(tempTime.getMinutes() + DEFAULT_TIME_INTERVAL);
  }

  return slots;
};

// 라운딩 설정 기반 시간 슬롯 생성 함수
export const generateTimeSlotsFromSettings = (
  settings: RoundingSettings
): TimeSlots => {
  const result: TimeSlots = {} as TimeSlots;

  settings.roundTimes.forEach((round, index) => {
    const partKey = `part${index + 1}` as keyof TimeSlots;
    result[partKey] = generateTimeSlotsForPart(round.startTime, round.endTime);
  });

  return result;
};

// ================================
// 자동 배정 관련 상수
// ================================

// 자동 배정 기본 옵션
export const AUTO_ASSIGN_DEFAULT_OPTIONS = {
  max_assignments: 2,
  min_rest_minutes: 300, // 5시간
};

// ================================
// 필터 관련 상수
// ================================

// 기본 필터 값
export const DEFAULT_FILTERS = {
  status: "",
  group: "",
  badge: "",
};

// ================================
// 드래그 앤 드롭 관련 상수
// ================================

// 드래그 데이터 타입
export const DRAG_DATA_TYPE = "application/x-caddie-data";

// ================================
// 상태 관련 상수
// ================================

// 캐디 상태 옵션
export const CADDIE_STATUS_OPTIONS = [
  { id: "근무", name: "근무" },
  { id: "휴가", name: "휴가" },
  { id: "병가", name: "병가" },
  { id: "기타", name: "기타" },
];

// 기본 그룹명
export const DEFAULT_GROUP_NAME = "하우스";
