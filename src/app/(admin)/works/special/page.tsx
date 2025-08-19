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
import { fetchSpecialGroupsStatus } from "@/modules/work/api/work-api";

// 새로운 API 응답 타입
interface SpecialGroupsStatusData extends Record<string, unknown> {
  golf_course_id: string;
  golf_course_name: string;
  location: string;
  status: string;
  special_group_count: number;
  total_caddie_count: number;
  special_schedule_id: string;
}

// 골프장별 특수반 현황 테이블 컬럼
const columns = [
  {
    key: "id",
    title: "No.",
    width: 80,
    render: (_: unknown, record: SpecialGroupsStatusData, index: number) => (
      <span className="text-gray-600">{index + 1}</span>
    ),
  },
  {
    key: "golf_course_name",
    title: "골프장명",
    width: 200,
    render: (value: unknown, record: SpecialGroupsStatusData) => (
      <span className="font-medium">{record.golf_course_name}</span>
    ),
  },
  {
    key: "location",
    title: "위치",
    width: 120,
    render: (value: unknown, record: SpecialGroupsStatusData) => (
      <span className="text-gray-600">{record.location}</span>
    ),
  },
  {
    key: "special_group_count",
    title: "특수반 수",
    width: 100,
    render: (value: unknown, record: SpecialGroupsStatusData) => (
      <span className="text-yellow-600 font-medium">
        {record.special_group_count}반
      </span>
    ),
  },
  {
    key: "total_caddie_count",
    title: "총 캐디수",
    width: 100,
    render: (value: unknown, record: SpecialGroupsStatusData) => (
      <span className="text-gray-800 font-medium">
        {record.total_caddie_count}명
      </span>
    ),
  },
  {
    key: "status",
    title: "상태",
    width: 100,
    render: (value: unknown, record: SpecialGroupsStatusData) => {
      const status = record.status;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : status === "inactive"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {status === "active"
            ? "활성"
            : status === "inactive"
            ? "비활성"
            : status}
        </span>
      );
    },
  },
];

const SpecialGroupsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: "골프장별 특수반 현황" });

  // 상태 관리
  const [data, setData] = useState<SpecialGroupsStatusData[]>([]);
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
      const response = await fetchSpecialGroupsStatus();

      setData(response || []);
      setTotalPages(1); // 새로운 API는 페이지네이션을 지원하지 않으므로 1로 설정
      setTotalCount(response?.length || 0);
    } catch (err) {
      console.error("골프장별 특수반 현황 조회 실패:", err);
      // 오류 시 빈 데이터로 설정
      setData([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // URL 파라미터 변경 시 데이터 로드
  useEffect(() => {
    loadData();
  }, [currentPage, currentSearch, loadData]);

  // 행 클릭 핸들러 (특수 스케줄 상세 페이지로 이동)
  const handleRowClick = (record: SpecialGroupsStatusData) => {
    if (record.special_schedule_id) {
      router.push(`/works/special/${record.special_schedule_id}`);
    } else {
      // 스케줄 ID가 없는 경우 알림
      console.warn("특수 스케줄 ID가 없습니다:", record.golf_course_name);
    }
  };

  // 선택 업데이트
  const handleSelectionChange = (keys: string[]) => {
    setSelectedRowKeys(keys);
  };

  // 행 키 생성 함수 (빈 행과 실제 데이터 구분)
  const getRowKey = (record: SpecialGroupsStatusData) => {
    const emptyRecord = record as SpecialGroupsStatusData & {
      isEmpty?: boolean;
      id?: string;
    };

    if (emptyRecord.isEmpty) {
      return emptyRecord.id || `empty-${Math.random()}`;
    }
    return (
      record.golf_course_id ||
      record.special_schedule_id ||
      `special-${Math.random()}`
    );
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
      <AdminPageHeader title="골프장별 특수반 현황" />

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
        <SelectableDataTable<SpecialGroupsStatusData>
          columns={columns}
          data={data}
          realDataCount={data.length}
          selectable={true}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectionChange}
          onRowClick={handleRowClick}
          getRowKey={getRowKey}
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

export default SpecialGroupsPage;
