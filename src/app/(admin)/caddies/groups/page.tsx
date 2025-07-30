"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  ConfirmationModal,
  Pagination,
  SearchWithButton,
  SelectableDataTable,
} from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle } from "@/shared/hooks";
import { fetchGolfCourseGroups } from "@/modules/golf-course/api/golf-course-api";
import { GolfCourseGroup } from "@/modules/golf-course/types/api";

// 골프장 그룹 현황 테이블 컬럼
const columns = [
  {
    key: "id",
    title: "No.",
    width: 80,
    render: (_: unknown, record: GolfCourseGroup, index: number) => (
      <span className="text-gray-600">{index + 1}</span>
    ),
  },
  {
    key: "name",
    title: "그룹명",
    width: 150,
    render: (value: unknown) => (
      <span className="font-medium">{String(value)}</span>
    ),
  },
  {
    key: "golf_course_name",
    title: "골프장명",
    width: 200,
    render: (value: unknown) => (
      <span className="text-gray-800">{String(value)}</span>
    ),
  },
  {
    key: "group_type",
    title: "그룹유형",
    width: 120,
    render: (value: unknown) => {
      const type = String(value);
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            type === "PRIMARY"
              ? "bg-blue-100 text-blue-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {type === "PRIMARY" ? "일반그룹" : "특별그룹"}
        </span>
      );
    },
  },
  {
    key: "member_count",
    title: "캐디수",
    width: 100,
    render: (value: unknown) => (
      <span className="text-gray-800 font-medium">{String(value)}명</span>
    ),
  },
  {
    key: "order",
    title: "순서",
    width: 80,
    render: (value: unknown) => (
      <span className="text-gray-600">{String(value)}</span>
    ),
  },
  {
    key: "is_active",
    title: "상태",
    width: 100,
    render: (value: unknown) => {
      const isActive = Boolean(value);
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {isActive ? "활성" : "비활성"}
        </span>
      );
    },
  },
];

const GolfCourseStatsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: "일반그룹 현황" });

  // 상태 관리
  const [data, setData] = useState<GolfCourseGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 삭제 모달 상태 관리
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 선택 상태
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // URL 파라미터에서 현재 페이지와 검색어 가져오기
  const currentPage = Number(searchParams.get("page") || 1);
  const currentSearch = searchParams.get("search") || "";

  // 데이터 로드 함수
  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchGolfCourseGroups({
        groupType: "PRIMARY",
        searchTerm: currentSearch,
      });

      setData(response.data?.results || []);
      setTotalPages(response.data?.total_pages || 1);
      setTotalCount(response.data?.count || 0);
    } catch (err) {
      console.error("일반그룹 현황 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [currentSearch]);

  // URL 파라미터 변경 시 데이터 로드
  useEffect(() => {
    loadData();
  }, [currentPage, currentSearch, loadData]);

  // 행 클릭 핸들러 (해당 그룹의 상세 페이지로 이동)
  const handleRowClick = (record: GolfCourseGroup) => {
    router.push(`/caddies/groups/${record.id}`);
  };

  // 선택 업데이트
  const handleSelectionChange = (keys: string[]) => {
    setSelectedRowKeys(keys);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    if (selectedRowKeys.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  // 삭제 확인 핸들러
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      // 실제 구현에서는 API 호출
      console.log("선택된 그룹 삭제:", selectedRowKeys);

      // 선택 상태 초기화
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 삭제 취소 핸들러
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="일반그룹 현황" />

      {/* 액션바 */}
      <div className="flex items-center justify-between">
        {/* 왼쪽: 총 건수 */}
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-black">
            총 {totalCount}건
          </span>
          {selectedRowKeys.length > 0 && (
            <span className="text-sm text-blue-600">
              ({selectedRowKeys.length}개 선택)
            </span>
          )}
        </div>

        {/* 오른쪽: 검색 + 버튼들 */}
        <div className="flex items-center gap-8">
          {/* 검색 */}
          <SearchWithButton placeholder="그룹명 또는 골프장명 검색..." />

          {/* 버튼 그룹 */}
          {selectedRowKeys.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleDeleteClick}
                className="w-24"
              >
                삭제
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 테이블 */}
      <div className="space-y-6">
        <SelectableDataTable<GolfCourseGroup>
          columns={columns}
          data={data}
          realDataCount={data.length}
          selectable={true}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectionChange}
          onRowClick={handleRowClick}
          rowKey="id"
          layout="flexible"
          loading={loading}
        />

        {/* 페이지네이션 */}
        {totalPages > 1 && <Pagination totalPages={totalPages} />}
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="삭제할까요?"
        message={`선택한 ${selectedRowKeys.length}개의 그룹을 삭제합니다. 삭제 시 복원이 불가합니다.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default GolfCourseStatsPage;
