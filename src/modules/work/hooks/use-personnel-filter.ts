"use client";

import { useMemo, useState } from "react";
import { FilterOptions, PersonnelFilter } from "../types";

export function usePersonnelFilter(filterMetadata?: {
  status_options: Array<{ id: string; name: string }>;
  primary_groups: Array<{ id: string; name: string; order: number }>;
  special_groups: Array<{ id: string; name: string; order: number }>;
}) {
  // 기본 필터 옵션 (API 데이터가 없을 때 사용)
  const defaultFilterOptions: FilterOptions = {
    status: [
      { id: "ALL", name: "전체" },
      { id: "WORK", name: "근무" },
      { id: "DAY_OFF", name: "휴무" },
      { id: "SICK_LEAVE", name: "병가" },
      { id: "VOLUNTEER", name: "봉사" },
      { id: "EDUCATION", name: "교육" },
      { id: "ABSENT", name: "결근" },
    ],
    groups: [
      { id: "ALL", name: "전체", order: 0 },
      { id: "1", name: "1조", order: 1 },
      { id: "2", name: "2조", order: 2 },
      { id: "3", name: "3조", order: 3 },
      { id: "4", name: "4조", order: 4 },
      { id: "5", name: "5조", order: 5 },
      { id: "6", name: "6조", order: 6 },
      { id: "7", name: "7조", order: 7 },
      { id: "8", name: "8조", order: 8 },
      { id: "9", name: "9조", order: 9 },
      { id: "10", name: "10조", order: 10 },
    ],
    badges: [
      { id: "ALL", name: "전체", order: 0 },
      { id: "HOUSE", name: "하우스", order: 1 },
      { id: "2ND_3RD", name: "2•3부", order: 2 },
      { id: "3RD", name: "3부", order: 3 },
      { id: "MARSHAL", name: "마샬", order: 4 },
      { id: "SPROUT", name: "새싹", order: 5 },
      { id: "SILVER", name: "실버", order: 6 },
    ],
  };

  // API에서 받은 filter_metadata가 있으면 사용, 없으면 기본값 사용
  const filterOptions: FilterOptions = useMemo(() => {
    if (filterMetadata) {
      return {
        status: [{ id: "ALL", name: "전체" }, ...filterMetadata.status_options],
        groups: [
          { id: "ALL", name: "전체", order: 0 },
          ...filterMetadata.primary_groups,
        ],
        badges: [
          { id: "ALL", name: "전체", order: 0 },
          ...filterMetadata.special_groups,
        ],
      };
    }
    return defaultFilterOptions;
  }, [filterMetadata]);

  // 필터 상태 관리
  const [filters, setFilters] = useState<PersonnelFilter>({
    status: "전체",
    group: "전체",
    badge: "전체",
  });

  // 필터 업데이트 함수
  const updateFilter = (key: keyof PersonnelFilter, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    filters,
    filterOptions,
    updateFilter,
  };
}
