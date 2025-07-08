import { Caddie, CaddieFilters } from "@/shared/types/caddie";
import { SAMPLE_DATA_COUNT, ITEMS_PER_PAGE } from "@/shared/constants/caddie";

// 샘플 캐디 데이터 생성
export const generateSampleCaddies = (
  count: number = SAMPLE_DATA_COUNT
): Caddie[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `caddie-${index + 1}`,
    no: index + 1,
    name: "홍길동",
    golfCourse: "제이캐디아카데미",
    gender: index % 2 === 0 ? "남" : "여",
    workStatus:
      index % 4 === 0 ? "근무 중" : index % 4 === 1 ? "휴무" : "근무 중",
    group: `${Math.floor(index / 4) + 1}조`,
    groupOrder: `${(index % 4) + 1}`,
    specialTeam:
      index % 3 === 0 ? "하우스" : index % 3 === 1 ? "3부반" : "하우스",
    phone: "010-1234-5678",
    workScore: ["상", "중", "하"][index % 3],
  }));
};

// 캐디 데이터 필터링
export const filterCaddies = (
  caddies: Caddie[],
  filters: CaddieFilters
): Caddie[] => {
  const { searchTerm, selectedGroup, selectedSpecialTeam } = filters;

  return caddies.filter((caddie) => {
    const matchesSearch =
      searchTerm === "" ||
      caddie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caddie.golfCourse.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup =
      selectedGroup === "그룹" || caddie.group === selectedGroup;

    const matchesSpecialTeam =
      selectedSpecialTeam === "특수반" ||
      caddie.specialTeam === selectedSpecialTeam;

    return matchesSearch && matchesGroup && matchesSpecialTeam;
  });
};

// 빈 행 생성하여 일정한 테이블 높이 유지
export const createPaddedData = (
  data: Caddie[],
  targetCount: number = ITEMS_PER_PAGE
): Caddie[] => {
  const emptyRowsCount = Math.max(0, targetCount - data.length);
  const emptyRows = Array.from({ length: emptyRowsCount }, (_, index) => ({
    id: `empty-${index}`,
    isEmpty: true,
    no: 0,
    name: "",
    golfCourse: "",
    gender: "",
    workStatus: "",
    group: "",
    groupOrder: "",
    specialTeam: "",
    phone: "",
    workScore: "",
  })) as Caddie[];

  return [...data, ...emptyRows];
};

// 선택된 캐디들 삭제 확인 메시지 생성
export const getDeleteConfirmMessage = (count: number): string => {
  return `선택된 ${count}개 항목을 삭제하시겠습니까?`;
};
