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

// 골프장 팀 통계 데이터 타입
interface GolfCourseTeamStats extends Record<string, unknown> {
  id: string;
  no: number;
  name: string;
  location: string;
  teamCount: number;
  caddieCount: number;
  activeCount: number;
  inactiveCount: number;
}

// 모크 데이터 (실제 구현에서는 API로 대체)
const MOCK_GOLF_COURSE_DATA: GolfCourseTeamStats[] = [
  {
    id: "golf-course-1",
    no: 1,
    name: "송도골프클럽",
    location: "인천시 연수구",
    teamCount: 3,
    caddieCount: 45,
    activeCount: 38,
    inactiveCount: 7,
  },
  {
    id: "golf-course-2",
    no: 2,
    name: "해운대골프클럽",
    location: "부산시 해운대구",
    teamCount: 2,
    caddieCount: 32,
    activeCount: 28,
    inactiveCount: 4,
  },
  {
    id: "golf-course-3",
    no: 3,
    name: "제주골프클럽",
    location: "제주시 애월읍",
    teamCount: 4,
    caddieCount: 56,
    activeCount: 50,
    inactiveCount: 6,
  },
  {
    id: "golf-course-4",
    no: 4,
    name: "강남골프클럽",
    location: "서울시 강남구",
    teamCount: 5,
    caddieCount: 68,
    activeCount: 62,
    inactiveCount: 6,
  },
  {
    id: "golf-course-5",
    no: 5,
    name: "부산골프클럽",
    location: "부산시 기장군",
    teamCount: 3,
    caddieCount: 42,
    activeCount: 37,
    inactiveCount: 5,
  },
  {
    id: "golf-course-6",
    no: 6,
    name: "경주골프클럽",
    location: "경북 경주시",
    teamCount: 2,
    caddieCount: 28,
    activeCount: 25,
    inactiveCount: 3,
  },
  {
    id: "golf-course-7",
    no: 7,
    name: "대구골프클럽",
    location: "대구시 달성군",
    teamCount: 4,
    caddieCount: 52,
    activeCount: 47,
    inactiveCount: 5,
  },
  {
    id: "golf-course-8",
    no: 8,
    name: "용인골프클럽",
    location: "경기도 용인시",
    teamCount: 3,
    caddieCount: 39,
    activeCount: 35,
    inactiveCount: 4,
  },
  {
    id: "golf-course-9",
    no: 9,
    name: "포항골프클럽",
    location: "경북 포항시",
    teamCount: 2,
    caddieCount: 26,
    activeCount: 24,
    inactiveCount: 2,
  },
  {
    id: "golf-course-10",
    no: 10,
    name: "천안골프클럽",
    location: "충남 천안시",
    teamCount: 3,
    caddieCount: 41,
    activeCount: 36,
    inactiveCount: 5,
  },
];

// 골프장 팀 통계 테이블 컬럼
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
    key: "teamCount",
    title: "특수반 수",
    width: 100,
    render: (value: unknown) => (
      <span className="text-yellow-600 font-medium">{String(value)}반</span>
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

const TeamsPage: React.FC = () => {
  const router = useRouter();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: "골프장별 팀 관리" });

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
  const { currentData, totalPages } = usePagination({
    data: filteredData,
    itemsPerPage: 20,
  });

  // 행 클릭 핸들러 (해당 골프장의 팀 관리 페이지로 이동)
  const handleRowClick = (golfCourse: GolfCourseTeamStats) => {
    router.push(`/teams/${golfCourse.id}`);
  };

  // 선택 업데이트
  const handleSelectionChange = (keys: string[]) => {
    setSelectedRowKeys(keys);
  };

  // 검색 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // setCurrentPage(1); // 검색 시 첫 페이지로 이동
    setSelectedRowKeys([]); // 검색 시 선택 상태 초기화
  };

  // 검색 클리어 핸들러
  const handleSearchClear = () => {
    setSearchTerm("");
    // setCurrentPage(1); // 검색 클리어 시 첫 페이지로 이동
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
      <AdminPageHeader title="골프장별 팀 관리" />

      {/* 액션바 */}
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

export default TeamsPage;
