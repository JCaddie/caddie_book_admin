"use client";

import React, { useEffect, useState } from "react";
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
import { fetchGolfCourseGroupStatus } from "@/modules/golf-course/api/golf-course-api";
import { GolfCourseGroupStatus } from "@/modules/golf-course/types/golf-course";

// 골프장 그룹 현황 테이블 컬럼
const columns = [
  {
    key: "id",
    title: "No.",
    width: 80,
    render: (_: unknown, record: Record<string, unknown>, index: number) => (
      <span className="text-gray-600">{index + 1}</span>
    ),
  },
  {
    key: "name",
    title: "골프장명",
    width: 200,
    render: (value: unknown) => (
      <span className="font-medium">{String(value)}</span>
    ),
  },
  {
    key: "location",
    title: "위치",
    width: 150,
    render: (value: unknown) => (
      <span className="text-gray-600">{String(value)}</span>
    ),
  },
  {
    key: "primary_group_count",
    title: "일반그룹",
    width: 100,
    render: (value: unknown) => (
      <span className="text-blue-600 font-medium">{String(value)}조</span>
    ),
  },
  {
    key: "special_group_count",
    title: "특별그룹",
    width: 100,
    render: (value: unknown) => (
      <span className="text-purple-600 font-medium">{String(value)}조</span>
    ),
  },
  {
    key: "total_caddies",
    title: "총 캐디수",
    width: 100,
    render: (value: unknown) => (
      <span className="text-gray-800 font-medium">{String(value)}명</span>
    ),
  },
];

const GolfCourseStatsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: "골프장별 그룹현황" });

  // 상태 관리
  const [data, setData] = useState<Record<string, unknown>[]>([]);
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
  const loadData = async () => {
    setLoading(true);

    try {
      // Note: 이 함수는 특정 골프장 ID가 필요합니다.
      // 현재는 임시로 빈 문자열을 사용하며, 실제 구현 시 적절한 골프장 ID를 전달해야 합니다.
      const response = await fetchGolfCourseGroupStatus("");

      setData(response.data?.groups || []);
      setTotalPages(1);
      setTotalCount(response.data?.groups?.length || 0);
    } catch (err) {
      console.error("골프장 그룹 현황 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // URL 파라미터 변경 시 데이터 로드
  useEffect(() => {
    loadData();
  }, [currentPage, currentSearch]);

  // 행 클릭 핸들러 (해당 골프장의 그룹 관리 페이지로 이동)
  const handleRowClick = (record: Record<string, unknown>) => {
    const golfCourse = record as unknown as GolfCourseGroupStatus;
    router.push(`/caddies/groups/${golfCourse.groupId}`);
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
      console.log("선택된 골프장 삭제:", selectedRowKeys);

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
      <AdminPageHeader title="골프장별 그룹현황" />

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
          <SearchWithButton placeholder="골프장명 또는 위치 검색..." />

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
        <SelectableDataTable
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
        message={`선택한 ${selectedRowKeys.length}개의 골프장을 삭제합니다. 삭제 시 복원이 불가합니다.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default GolfCourseStatsPage;
