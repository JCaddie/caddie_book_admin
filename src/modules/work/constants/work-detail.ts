import {
  CaddieData,
  Field,
  PersonnelStats,
  RoundingSettings,
  TimeSlots,
} from "../types";

// 필드별 데이터 (4개로 확장)
export const FIELDS: Field[] = [
  { id: 1, name: "서코스" },
  { id: 2, name: "동코스" },
  { id: 3, name: "남코스" },
  { id: 4, name: "북코스" },
];

// 인원 통계 (샘플)
export const PERSONNEL_STATS: PersonnelStats = {
  total: 152,
  available: 125,
};

// 필터 옵션
export const FILTER_OPTIONS = {
  STATUS: ["전체", "근무", "휴무", "병가", "봉사", "교육"],
  GROUP: [
    "전체",
    "1조",
    "2조",
    "3조",
    "4조",
    "5조",
    "6조",
    "7조",
    "8조",
    "9조",
  ],
  BADGE: ["전체", "하우스", "2•3부", "3부", "마샬", "새싹", "실버"],
};

// 기본 시간 슬롯 생성 함수 (하드코딩)
export const generateTimeSlots = (): TimeSlots => {
  return {
    part1: Array.from({ length: 13 }, (_, i) => {
      const hour = Math.floor(i / 2) + 6;
      const minute = i % 2 === 0 ? "00" : "30";
      return `${hour.toString().padStart(2, "0")}:${minute}`;
    }),
    part2: Array.from({ length: 7 }, (_, i) => {
      const hour = Math.floor(i / 2) + 13;
      const minute = i % 2 === 0 ? "00" : "30";
      return `${hour.toString().padStart(2, "0")}:${minute}`;
    }),
    part3: Array.from({ length: 4 }, (_, i) => {
      const hour = Math.floor(i / 2) + 17;
      const minute = i % 2 === 0 ? "00" : "30";
      return `${hour.toString().padStart(2, "0")}:${minute}`;
    }),
  };
};

// 라운딩 설정 기반 시간 슬롯 생성 함수
export const generateTimeSlotsFromSettings = (
  settings: RoundingSettings
): TimeSlots => {
  const result: TimeSlots = {} as TimeSlots;

  settings.roundTimes.forEach((round, index) => {
    const partKey = `part${index + 1}` as keyof TimeSlots;
    const slots: string[] = [];

    const currentTime = new Date(`2000-01-01T${round.startTime}`);
    const endTime = new Date(`2000-01-01T${round.endTime}`);

    const tempTime = new Date(currentTime);
    while (tempTime < endTime) {
      slots.push(tempTime.toTimeString().slice(0, 5));
      tempTime.setMinutes(tempTime.getMinutes() + settings.timeUnit);
    }

    result[partKey] = slots;
  });

  return result;
};

// 샘플 캐디 데이터 (다양한 상태 포함)
export const SAMPLE_CADDIES: CaddieData[] = [
  { id: 1, name: "홍길동", group: 1, badge: "하우스", status: "근무" },
  { id: 2, name: "김철수", group: 1, badge: "하우스", status: "휴무" },
  {
    id: 3,
    name: "박영희",
    group: 2,
    badge: "2•3부",
    status: "근무",
    specialBadge: "조첫",
  },
  {
    id: 4,
    name: "이민수",
    group: 2,
    badge: "3부",
    status: "근무",
    specialBadge: "스페어",
  },
  { id: 5, name: "정수지", group: 3, badge: "마샬", status: "배치완료" },
  { id: 6, name: "최영수", group: 3, badge: "새싹", status: "근무" },
  { id: 7, name: "이철민", group: 1, badge: "하우스", status: "병가" },
  { id: 8, name: "김영수", group: 4, badge: "2•3부", status: "근무" },
  { id: 9, name: "박민수", group: 4, badge: "3부", status: "봉사" },
  { id: 10, name: "정영희", group: 5, badge: "마샬", status: "교육" },
  { id: 11, name: "최민정", group: 5, badge: "새싹", status: "근무" },
  { id: 12, name: "이수진", group: 6, badge: "실버", status: "휴무" },
  { id: 13, name: "김도현", group: 6, badge: "하우스", status: "근무" },
  { id: 14, name: "박지영", group: 7, badge: "2•3부", status: "근무" },
  { id: 15, name: "정현우", group: 7, badge: "3부", status: "근무" },
  { id: 16, name: "최예진", group: 8, badge: "마샬", status: "휴무" },
  { id: 17, name: "이동현", group: 8, badge: "새싹", status: "근무" },
  { id: 18, name: "김민서", group: 9, badge: "실버", status: "근무" },
];
