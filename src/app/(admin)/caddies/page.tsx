"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DataTable,
  Pagination,
  SearchWithButton,
  URLDropdown,
} from "@/shared/components/ui";

import {
  PAGE_TITLES,
  useCaddieList,
  useDocumentTitle,
  useGolfCourseSimpleOptions,
} from "@/shared/hooks";
import { CADDIE_COLUMNS } from "@/shared/constants/caddie";
import { Caddie } from "@/modules/caddie/types";

const CaddieListPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: PAGE_TITLES.CADDIES });

  // 골프장 옵션 가져오기
  const { options: golfCourseOptions } = useGolfCourseSimpleOptions();

  // URL 파라미터에서 필터 값 읽기
  const golfCourseValue = searchParams.get("golf_course") || "";

  // 캐디 리스트 상태 관리
  const { currentData, totalCount, isLoading, error, totalPages, refreshData } =
    useCaddieList();

  // 행 클릭 핸들러 (상세 페이지로 이동)
  const handleRowClick = (caddie: Caddie) => {
    // 빈 행 클릭 방지
    if (caddie.isEmpty) return;

    // user 필드를 사용해서 이동 (고유 식별자)
    router.push(`/caddies/${caddie.user}`);
  };

  // 행 키 생성 함수 (빈 행과 실제 데이터 구분)
  const getRowKey = (caddie: Caddie) => {
    if (caddie.isEmpty) {
      return caddie.id || `empty-${Math.random()}`;
    }
    return caddie.user || caddie.id || `caddie-${Math.random()}`;
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      {/* 제목 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">캐디</h2>
      </div>

      {/* 에러 상태 표시 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">오류가 발생했습니다</p>
              <p>{error}</p>
            </div>
            <button
              onClick={refreshData}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 액션바 */}
      <div className="flex items-center justify-between">
        {/* 왼쪽: 총 건수 */}
        <div className="text-base font-bold text-gray-900">
          총 {totalCount}명
        </div>

        {/* 오른쪽: 필터 및 액션 버튼들 */}
        <div className="flex items-center gap-8">
          {/* 골프장 드롭다운 */}
          <div className="flex items-center gap-2">
            <URLDropdown
              options={golfCourseOptions}
              value={golfCourseValue}
              paramName="golf_course"
              placeholder="골프장 선택"
              containerClassName="w-[120px]"
            />
          </div>

          {/* 검색 */}
          <div className="flex items-center gap-4">
            <SearchWithButton placeholder="캐디 이름으로 검색" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 로딩 상태 표시 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-gray-600">캐디 목록을 불러오는 중...</span>
          </div>
        ) : (
          <DataTable
            columns={CADDIE_COLUMNS}
            data={currentData}
            onRowClick={handleRowClick}
            getRowKey={getRowKey}
            layout="flexible"
          />
        )}

        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default CaddieListPage;
