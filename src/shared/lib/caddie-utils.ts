import { Caddie, CaddieFilters } from "@/shared/types/caddie";
import { SAMPLE_DATA_COUNT } from "@/shared/constants/caddie";

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

// 캐디 필터링
export const filterCaddies = (
  caddies: Caddie[],
  filters: CaddieFilters
): Caddie[] => {
  return caddies.filter((caddie) => {
    // 검색어 필터링
    const matchesSearch =
      !filters.searchTerm ||
      caddie.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      caddie.golfCourse
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      caddie.phone.includes(filters.searchTerm);

    // 그룹 필터링
    const matchesGroup =
      !filters.selectedGroup ||
      filters.selectedGroup === "그룹" ||
      caddie.group === filters.selectedGroup;

    // 특수반 필터링
    const matchesSpecialTeam =
      !filters.selectedSpecialTeam ||
      filters.selectedSpecialTeam === "특수반" ||
      caddie.specialTeam === filters.selectedSpecialTeam;

    return matchesSearch && matchesGroup && matchesSpecialTeam;
  });
};

// 선택된 캐디들 삭제 확인 메시지 생성
export const getDeleteConfirmMessage = (count: number): string => {
  return `선택된 ${count}개 항목을 삭제하시겠습니까?`;
};
