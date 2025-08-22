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

// 필터 옵션은 이제 usePersonnelFilter 훅에서 동적으로 생성됩니다

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

// 샘플 캐디 데이터는 이제 API에서 받은 데이터를 사용합니다
