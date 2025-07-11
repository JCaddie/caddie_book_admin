"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationModal,
  Pagination,
  SelectableDataTable,
} from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle } from "@/shared/hooks";

// 골프장 통계 데이터 타입
interface GolfCourseStats extends Record<string, unknown> {
  id: string;
  no: number;
  name: string;
  location: string;
  groupCount: number;
  caddieCount: number;
  activeCount: number;
  inactiveCount: number;
}

// 모크 데이터 (실제 구현에서는 API로 대체)
const MOCK_GOLF_COURSE_DATA: GolfCourseStats[] = [
  {
    id: "golf-course-1",
    no: 1,
    name: "송도골프클럽",
    location: "인천시 연수구",
    groupCount: 8,
    caddieCount: 120,
    activeCount: 105,
    inactiveCount: 15,
  },
  {
    id: "golf-course-2",
    no: 2,
    name: "해운대골프클럽",
    location: "부산시 해운대구",
    groupCount: 6,
    caddieCount: 95,
    activeCount: 88,
    inactiveCount: 7,
  },
  {
    id: "golf-course-3",
    no: 3,
    name: "제주골프클럽",
    location: "제주시 애월읍",
    groupCount: 5,
    caddieCount: 75,
    activeCount: 70,
    inactiveCount: 5,
  },
  {
    id: "golf-course-4",
    no: 4,
    name: "강남골프클럽",
    location: "서울시 강남구",
    groupCount: 10,
    caddieCount: 150,
    activeCount: 138,
    inactiveCount: 12,
  },
];

// 골프장 통계 테이블 컬럼
const columns: any[] = [
  {
    key: "no",
    title: "No.",
    width: 80,
    render: (value: any) => <span className="text-gray-600">{value}</span>,
  },
  {
    key: "name",
    title: "골프장명",
    width: 200,
    render: (value: any) => <span className="font-medium">{value}</span>,
  },
  {
    key: "location",
    title: "위치",
    width: 150,
    render: (value: any) => <span className="text-gray-600">{value}</span>,
  },
  {
    key: "groupCount",
    title: "그룹수",
    width: 100,
    render: (value: any) => (
      <span className="text-blue-600 font-medium">{value}조</span>
    ),
  },
  {
    key: "caddieCount",
    title: "총 캐디수",
    width: 100,
    render: (value: any) => (
      <span className="text-gray-800 font-medium">{value}명</span>
    ),
  },
  {
    key: "activeCount",
    title: "활동인원",
    width: 100,
    render: (value: any) => (
      <span className="text-green-600 font-medium">{value}명</span>
    ),
  },
  {
    key: "inactiveCount",
    title: "비활동인원",
    width: 100,
    render: (value: any) => (
      <span className="text-red-600 font-medium">{value}명</span>
    ),
  },
];

const GolfCourseStatsPage: React.FC = () => {
  const router = useRouter();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: "골프장별 그룹현황" });

  // 삭제 모달 상태 관리
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 선택 상태
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<GolfCourseStats[]>([]);

  // 검색 상태
  const [searchTerm, setSearchTerm] = useState("");

  // 필터링된 데이터
  const filteredData = MOCK_GOLF_COURSE_DATA.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 행 클릭 핸들러 (해당 골프장의 그룹 관리 페이지로 이동)
  const handleRowClick = (golfCourse: GolfCourseStats) => {
    router.push(`/caddies/groups/${golfCourse.id}`);
  };

  // 선택 업데이트
  const handleSelectionChange = (keys: string[], rows: GolfCourseStats[]) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
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
      setSelectedRows([]);
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            총 {filteredData.length}개 골프장
          </div>
          {selectedRowKeys.length > 0 && (
            <div className="text-sm text-blue-600">
              {selectedRowKeys.length}개 선택
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="골프장명 또는 위치 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {selectedRowKeys.length > 0 && (
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      {/* 테이블 */}
      <div className="space-y-6">
        <SelectableDataTable
          columns={columns}
          data={filteredData}
          realDataCount={filteredData.length}
          selectable={true}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectionChange}
          onRowClick={handleRowClick}
          rowKey="id"
          layout="flexible"
        />

        {filteredData.length > 20 && (
          <Pagination
            currentPage={1}
            totalPages={Math.ceil(filteredData.length / 20)}
            onPageChange={() => {}}
          />
        )}
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
