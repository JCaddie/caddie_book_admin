"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ConfirmationModal,
  Pagination,
  Search,
  SelectableDataTable,
} from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle, usePagination } from "@/shared/hooks";

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
  {
    id: "golf-course-5",
    no: 5,
    name: "부산골프클럽",
    location: "부산시 기장군",
    groupCount: 7,
    caddieCount: 110,
    activeCount: 98,
    inactiveCount: 12,
  },
  {
    id: "golf-course-6",
    no: 6,
    name: "경주골프클럽",
    location: "경북 경주시",
    groupCount: 6,
    caddieCount: 85,
    activeCount: 80,
    inactiveCount: 5,
  },
  {
    id: "golf-course-7",
    no: 7,
    name: "대구골프클럽",
    location: "대구시 달성군",
    groupCount: 9,
    caddieCount: 135,
    activeCount: 125,
    inactiveCount: 10,
  },
  {
    id: "golf-course-8",
    no: 8,
    name: "용인골프클럽",
    location: "경기도 용인시",
    groupCount: 8,
    caddieCount: 125,
    activeCount: 115,
    inactiveCount: 10,
  },
  {
    id: "golf-course-9",
    no: 9,
    name: "포항골프클럽",
    location: "경북 포항시",
    groupCount: 6,
    caddieCount: 90,
    activeCount: 85,
    inactiveCount: 5,
  },
  {
    id: "golf-course-10",
    no: 10,
    name: "천안골프클럽",
    location: "충남 천안시",
    groupCount: 7,
    caddieCount: 105,
    activeCount: 95,
    inactiveCount: 10,
  },
  {
    id: "golf-course-11",
    no: 11,
    name: "전주골프클럽",
    location: "전북 전주시",
    groupCount: 5,
    caddieCount: 80,
    activeCount: 75,
    inactiveCount: 5,
  },
  {
    id: "golf-course-12",
    no: 12,
    name: "광주골프클럽",
    location: "광주시 북구",
    groupCount: 8,
    caddieCount: 130,
    activeCount: 120,
    inactiveCount: 10,
  },
  {
    id: "golf-course-13",
    no: 13,
    name: "울산골프클럽",
    location: "울산시 울주군",
    groupCount: 7,
    caddieCount: 115,
    activeCount: 105,
    inactiveCount: 10,
  },
  {
    id: "golf-course-14",
    no: 14,
    name: "수원골프클럽",
    location: "경기도 수원시",
    groupCount: 9,
    caddieCount: 140,
    activeCount: 130,
    inactiveCount: 10,
  },
  {
    id: "golf-course-15",
    no: 15,
    name: "춘천골프클럽",
    location: "강원도 춘천시",
    groupCount: 6,
    caddieCount: 95,
    activeCount: 88,
    inactiveCount: 7,
  },
  {
    id: "golf-course-16",
    no: 16,
    name: "강릉골프클럽",
    location: "강원도 강릉시",
    groupCount: 5,
    caddieCount: 85,
    activeCount: 80,
    inactiveCount: 5,
  },
  {
    id: "golf-course-17",
    no: 17,
    name: "서산골프클럽",
    location: "충남 서산시",
    groupCount: 7,
    caddieCount: 110,
    activeCount: 100,
    inactiveCount: 10,
  },
  {
    id: "golf-course-18",
    no: 18,
    name: "청주골프클럽",
    location: "충북 청주시",
    groupCount: 6,
    caddieCount: 100,
    activeCount: 92,
    inactiveCount: 8,
  },
  {
    id: "golf-course-19",
    no: 19,
    name: "목포골프클럽",
    location: "전남 목포시",
    groupCount: 5,
    caddieCount: 78,
    activeCount: 72,
    inactiveCount: 6,
  },
  {
    id: "golf-course-20",
    no: 20,
    name: "여수골프클럽",
    location: "전남 여수시",
    groupCount: 6,
    caddieCount: 92,
    activeCount: 85,
    inactiveCount: 7,
  },
  {
    id: "golf-course-21",
    no: 21,
    name: "안동골프클럽",
    location: "경북 안동시",
    groupCount: 4,
    caddieCount: 70,
    activeCount: 65,
    inactiveCount: 5,
  },
  {
    id: "golf-course-22",
    no: 22,
    name: "진주골프클럽",
    location: "경남 진주시",
    groupCount: 7,
    caddieCount: 105,
    activeCount: 98,
    inactiveCount: 7,
  },
  {
    id: "golf-course-23",
    no: 23,
    name: "창원골프클럽",
    location: "경남 창원시",
    groupCount: 8,
    caddieCount: 125,
    activeCount: 115,
    inactiveCount: 10,
  },
  {
    id: "golf-course-24",
    no: 24,
    name: "순천골프클럽",
    location: "전남 순천시",
    groupCount: 5,
    caddieCount: 82,
    activeCount: 78,
    inactiveCount: 4,
  },
  {
    id: "golf-course-25",
    no: 25,
    name: "속초골프클럽",
    location: "강원도 속초시",
    groupCount: 6,
    caddieCount: 90,
    activeCount: 85,
    inactiveCount: 5,
  },
];

// 골프장 통계 테이블 컬럼
const columns = [
  {
    key: "no",
    title: "No.",
    width: 80,
    render: (value: unknown) => (
      <span className="text-gray-600">{String(value)}</span>
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
    key: "groupCount",
    title: "그룹수",
    width: 100,
    render: (value: unknown) => (
      <span className="text-blue-600 font-medium">{String(value)}조</span>
    ),
  },
  {
    key: "caddieCount",
    title: "총 캐디수",
    width: 100,
    render: (value: unknown) => (
      <span className="text-gray-800 font-medium">{String(value)}명</span>
    ),
  },
  {
    key: "activeCount",
    title: "활동인원",
    width: 100,
    render: (value: unknown) => (
      <span className="text-green-600 font-medium">{String(value)}명</span>
    ),
  },
  {
    key: "inactiveCount",
    title: "비활동인원",
    width: 100,
    render: (value: unknown) => (
      <span className="text-red-600 font-medium">{String(value)}명</span>
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

  // 검색 상태
  const [searchTerm, setSearchTerm] = useState("");

  // 필터링된 데이터
  const filteredData = MOCK_GOLF_COURSE_DATA.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션
  const {
    currentData,
    currentPage,
    totalPages,
    handlePageChange,
    setCurrentPage,
  } = usePagination({
    data: filteredData,
    itemsPerPage: 20,
  });

  // 행 클릭 핸들러 (해당 골프장의 그룹 관리 페이지로 이동)
  const handleRowClick = (golfCourse: GolfCourseStats) => {
    router.push(`/caddies/groups/${golfCourse.id}`);
  };

  // 선택 업데이트
  const handleSelectionChange = (keys: string[]) => {
    setSelectedRowKeys(keys);
  };

  // 검색 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
    setSelectedRowKeys([]); // 검색 시 선택 상태 초기화
  };

  // 검색 클리어 핸들러
  const handleSearchClear = () => {
    setSearchTerm("");
    setCurrentPage(1); // 검색 클리어 시 첫 페이지로 이동
    setSelectedRowKeys([]); // 검색 클리어 시 선택 상태 초기화
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

      {/* 액션바 - 신규 캐디 화면과 동일한 구조 */}
      <div className="flex items-center justify-between">
        {/* 왼쪽: 총 건수 */}
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-black">
            총 {filteredData.length}건
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
          <div className="w-[400px]">
            <Search
              placeholder="골프장명 또는 위치 검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              onClear={handleSearchClear}
            />
          </div>

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
          data={currentData}
          realDataCount={currentData.length}
          selectable={true}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectionChange}
          onRowClick={handleRowClick}
          rowKey="id"
          layout="flexible"
        />

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
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
