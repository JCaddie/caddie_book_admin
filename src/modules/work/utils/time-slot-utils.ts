/**
 * 시간 슬롯 생성 유틸리티 함수들
 */

/**
 * 시간 문자열을 분 단위로 변환
 * @param timeString "HH:MM" 형식의 시간 문자열
 * @returns 분 단위 숫자
 */
export function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * 분 단위를 시간 문자열로 변환
 * @param minutes 분 단위 숫자
 * @returns "HH:MM" 형식의 시간 문자열
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

/**
 * 시작 시간과 종료 시간 사이의 시간 슬롯 배열을 생성
 * @param startTime 시작 시간 ("HH:MM" 형식)
 * @param endTime 종료 시간 ("HH:MM" 형식)
 * @param intervalMinutes 간격 (분 단위)
 * @returns 시간 슬롯 배열
 */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number
): string[] {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const slots: string[] = [];

  for (
    let minutes = startMinutes;
    minutes < endMinutes;
    minutes += intervalMinutes
  ) {
    slots.push(minutesToTime(minutes));
  }

  return slots;
}

/**
 * 부가 스페어 부인지 확인
 * @param partName 부 이름
 * @returns 스페어 부 여부
 */
export function isSparePart(partName: string): boolean {
  return partName === "스페어";
}
