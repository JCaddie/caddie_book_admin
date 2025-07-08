"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Button,
  Search,
  SelectableDataTable,
  DeleteButton,
  DeleteConfirmationModal,
} from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { usePagination, defaultCellRenderer } from "@/shared/hooks";
import { Work } from "@/modules/work/types";
import { SAMPLE_GOLF_COURSES } from "@/modules/work/constants";

const WorksPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<Work[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [worksList, setWorksList] = useState<Work[]>([]);

  // URL 검색 파라미터로부터 자동 검색 설정
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    }
  }, [searchParams]);

  // 샘플 데이터 생성 및 관리
  const initialWorks: Work[] = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => ({
        id: `work-${index + 1}`,
        no: index + 1,
        date: "2025.01.06",
        golfCourse: SAMPLE_GOLF_COURSES[index % SAMPLE_GOLF_COURSES.length],
        totalStaff: 130,
        availableStaff: 130,
        status: "planning" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    []
  );

  // 초기 데이터 설정
  useEffect(() => {
    if (worksList.length === 0) {
      setWorksList(initialWorks);
    }
  }, [initialWorks, worksList.length]);

  // 필터링된 데이터
  const filteredWorks = useMemo(() => {
    return worksList.filter((work) => {
      const matchesSearch =
        searchTerm === "" ||
        work.golfCourse.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [worksList, searchTerm]);

  // 페이지네이션 훅 사용
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredWorks,
      itemsPerPage: 20,
    });

  // 테이블 컬럼 정의 (Figma 디자인에 맞춤)
  const columns = [
    {
      key: "no",
      title: "No.",
      width: 80,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
    {
      key: "date",
      title: "일자",
      width: 160,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
    {
      key: "golfCourse",
      title: "골프장",
      flex: true,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
    {
      key: "totalStaff",
      title: "전체 인원수",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
    {
      key: "availableStaff",
      title: "가용인원수",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
  ];

  // 행 클릭 핸들러
  const handleRowClick = (work: Work) => {
    if ((work as Work & { isEmpty?: boolean }).isEmpty) {
      return;
    }
    console.log("근무 스케줄 상세:", work);
  };

  // 검색 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 선택 변경 핸들러
  const handleSelectChange = (
    newSelectedRowKeys: string[],
    newSelectedRows: Work[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };

  // 삭제 버튼 클릭 핸들러 (모달 열기)
  const handleDelete = () => {
    if (selectedRowKeys.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  // 실제 삭제 확인 핸들러
  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      // 실제 삭제 로직 (API 호출 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 선택된 항목들을 데이터에서 제거
      const selectedIds = new Set(selectedRowKeys);
      const updatedWorksList = worksList.filter(
        (work) => !selectedIds.has(work.id)
      );

      setWorksList(updatedWorksList);

      // 선택 상태 초기화
      setSelectedRowKeys([]);
      setSelectedRows([]);

      console.log(
        `${selectedRowKeys.length}개 항목이 삭제되었습니다.`,
        selectedRows
      );
    } catch (error) {
      console.error("삭제 중 오류가 발생했습니다:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // 삭제 모달 닫기 핸들러
  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
    }
  };

  // 생성 핸들러
  const handleCreate = () => {
    console.log("근무 스케줄 생성");
    // 생성 페이지로 이동하거나 모달 열기
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      {/* 페이지 헤더 */}
      <AdminPageHeader title="근무" />

      {/* 상단 액션 바 */}
      <div className="flex items-center justify-between">
        {/* 왼쪽: 총 건수 */}
        <div className="text-base font-bold text-black">
          총 {filteredWorks.length}건
        </div>

        {/* 오른쪽: 액션 버튼들 */}
        <div className="flex items-center gap-8">
          {/* 삭제 버튼 */}
          <DeleteButton
            onClick={handleDelete}
            selectedCount={selectedRowKeys.length}
            disabled={selectedRowKeys.length === 0}
            variant="text"
            size="md"
            showCount={false}
          />

          {/* 검색 필드 */}
          <Search
            placeholder="제이캐디아카데미"
            containerClassName="w-[360px]"
            onChange={handleSearchChange}
            value={searchTerm}
          />

          {/* 생성 버튼 */}
          <Button
            variant="primary"
            size="md"
            icon={<Plus size={24} />}
            onClick={handleCreate}
            className="bg-[#FEB912] hover:bg-[#E5A50F] text-white font-semibold"
          >
            생성
          </Button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="rounded-md overflow-hidden">
        <SelectableDataTable
          columns={columns}
          data={currentData}
          selectable={true}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectChange}
          onRowClick={handleRowClick}
          layout="flexible"
          containerWidth="auto"
          emptyText="검색된 결과가 없습니다."
          realDataCount={filteredWorks.length}
        />
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-6 h-6 text-gray-400 disabled:opacity-40"
            >
              <span className="text-base">{"<<"}</span>
            </button>
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-6 h-6 text-gray-400 disabled:opacity-40"
            >
              <span className="text-base">{"<"}</span>
            </button>

            <div className="flex items-center justify-center w-6 h-6 bg-[#FFFAF2] text-[#FEB912] rounded-md text-[13px] font-bold">
              {currentPage}
            </div>

            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-6 h-6 text-gray-400 disabled:opacity-40"
            >
              <span className="text-base">{">"}</span>
            </button>
            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-6 h-6 text-gray-400 disabled:opacity-40"
            >
              <span className="text-base">{">>"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="삭제할까요?"
        message={`선택한 ${selectedRowKeys.length}개의 근무 스케줄을 삭제하시겠습니까?\n삭제 시 복원이 불가합니다.`}
        confirmText="삭제"
        cancelText="취소"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default WorksPage;
