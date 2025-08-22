"use client";

import { useMemo, useState } from "react";
import { PersonnelFilter } from "../types";
import { SAMPLE_CADDIES } from "../constants/work-detail";
import { filterCaddies } from "../utils/work-detail-utils";

export function usePersonnelFilter() {
  // 필터 상태 관리
  const [filters, setFilters] = useState<PersonnelFilter>({
    status: "전체",
    group: "전체",
    badge: "전체",
  });

  // 필터링된 캐디 데이터
  const filteredCaddies = useMemo(() => {
    return filterCaddies(SAMPLE_CADDIES, filters);
  }, [filters]);

  // 필터 업데이트 함수
  const updateFilter = (key: keyof PersonnelFilter, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    filters,
    filteredCaddies,
    updateFilter,
  };
}
