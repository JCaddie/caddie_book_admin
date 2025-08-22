"use client";

import { useMemo, useState } from "react";
import { CaddieData, FilterOptions, PersonnelFilter } from "../types";

export function usePersonnelFilter(
  filterMetadata?: {
    status_options: Array<{ id: string; name: string }>;
    primary_groups: Array<{ id: string; name: string; order: number }>;
    special_groups: Array<{ id: string; name: string; order: number }>;
  },
  caddies?: CaddieData[]
) {
  // API에서 받은 filter_metadata가 있으면 사용, 없으면 "전체"만 표시
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
    // filter_metadata가 없을 때는 "전체"만 표시
    return {
      status: [{ id: "ALL", name: "전체" }],
      groups: [{ id: "ALL", name: "전체", order: 0 }],
      badges: [{ id: "ALL", name: "전체", order: 0 }],
    };
  }, [filterMetadata]);

  // 필터 상태 관리
  const [filters, setFilters] = useState<PersonnelFilter>({
    status: "전체",
    group: "전체",
    badge: "전체",
  });

  // 필터링된 캐디 목록 계산
  const filteredCaddies = useMemo(() => {
    if (!caddies) return [];
    
    return caddies.filter((caddie) => {
      // 상태 필터링
      if (filters.status !== "전체" && caddie.status !== filters.status) {
        return false;
      }
      
      // 그룹 필터링
      if (filters.group !== "전체" && caddie.groupName !== filters.group) {
        return false;
      }
      
      // 특수반 필터링
      if (filters.badge !== "전체" && caddie.badge !== filters.badge) {
        return false;
      }
      
      return true;
    });
  }, [caddies, filters]);

  // 필터 업데이트 함수
  const updateFilter = (key: keyof PersonnelFilter, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    filters,
    filterOptions,
    filteredCaddies,
    updateFilter,
  };
}
