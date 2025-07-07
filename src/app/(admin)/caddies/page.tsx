"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Dropdown } from "@/shared/components/ui";
import {
  AdminPageHeader,
  TableWithPagination,
} from "@/shared/components/layout";
import { usePagination, TableItem } from "@/shared/hooks";
import { UserPlus, Trash2 } from "lucide-react";

// 캐디 데이터 타입 (Figma 디자인에 맞춤)
interface Caddie extends TableItem {
  no: number;
  name: string;
  gender: string;
  workStatus: string;
  group: string;
  groupOrder: string;
  phone: string;
  workScore: string;
}

const CaddieListPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWork, setSelectedWork] = useState("근무");
  const [selectedGroup, setSelectedGroup] = useState("조");

  // 샘플 데이터 (총 78개)
  const allCaddies: Caddie[] = useMemo(
    () =>
      Array.from({ length: 78 }, (_, index) => ({
        id: `caddie-${index + 1}`,
        no: index + 1,
        name: "홍길동",
        gender: index % 2 === 0 ? "남" : "여",
        workStatus:
          index % 4 === 0 ? "근무 중" : index % 4 === 1 ? "휴무" : "-",
        group: index % 4 === 2 ? "-" : `${Math.floor(index / 4) + 1}조`,
        groupOrder: index % 4 === 2 ? "-" : `${(index % 4) + 1}`,
        phone: "010-1234-5678",
        workScore: index % 4 === 2 ? "-" : ["상", "중", "하"][index % 3],
      })),
    []
  );

  // 필터링된 데이터
  const filteredCaddies = useMemo(() => {
    return allCaddies.filter((caddie) => {
      const matchesSearch =
        searchTerm === "" ||
        caddie.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesWork =
        selectedWork === "근무" ||
        (selectedWork === "근무 중" && caddie.workStatus === "근무 중") ||
        (selectedWork === "휴무" && caddie.workStatus === "휴무");

      const matchesGroup =
        selectedGroup === "조" || caddie.group.includes(selectedGroup);

      return matchesSearch && matchesWork && matchesGroup;
    });
  }, [allCaddies, searchTerm, selectedWork, selectedGroup]);

  // 페이지네이션 훅 사용
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredCaddies,
      itemsPerPage: 20,
    });

  // 테이블 컬럼 정의 (적절한 너비로 조정 - 총 1320px)
  const columns = [
    {
      key: "no",
      title: "No.",
      width: 80,
      align: "center" as const,
    },
    {
      key: "name",
      title: "이름",
      width: 160,
      align: "center" as const,
    },
    {
      key: "gender",
      title: "성별",
      width: 100,
      align: "center" as const,
    },
    {
      key: "workStatus",
      title: "근무",
      width: 120,
      align: "center" as const,
    },
    {
      key: "group",
      title: "그룹",
      width: 120,
      align: "center" as const,
    },
    {
      key: "groupOrder",
      title: "그룹 순서",
      width: 140,
      align: "center" as const,
    },
    {
      key: "phone",
      title: "연락처",
      width: 200,
      align: "center" as const,
    },
    {
      key: "workScore",
      title: "근무점수",
      width: 400,
      align: "center" as const,
    },
  ];

  // 행 클릭 핸들러
  const handleRowClick = (caddie: Caddie) => {
    // 상세 페이지로 이동
    router.push(`/caddies/${caddie.id}`);
  };

  const handleDeleteSelected = () => {
    console.log("삭제 기능 구현");
    // 실제 삭제 로직 구현
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const workOptions = [
    { value: "근무", label: "근무" },
    { value: "근무 중", label: "근무 중" },
    { value: "휴무", label: "휴무" },
  ];

  const groupOptions = [
    { value: "조", label: "조" },
    { value: "1조", label: "1조" },
    { value: "2조", label: "2조" },
    { value: "3조", label: "3조" },
    { value: "4조", label: "4조" },
  ];

  // 헤더 액션 컴포넌트 (우측)
  const headerAction = (
    <button className="flex items-center gap-1 bg-[#FEB912] text-white font-medium text-base px-4 py-2 rounded-md hover:bg-[#E5A50F] transition-colors">
      <UserPlus size={24} />
      소속 요청
    </button>
  );

  // 필터 영역 컴포넌트
  const filterArea = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-base font-bold text-black">
          총 {filteredCaddies.length}건
        </span>
      </div>

      <div className="flex items-center gap-8">
        {/* 삭제 버튼 */}
        <button
          onClick={handleDeleteSelected}
          className="flex items-center gap-2 text-[13px] font-medium text-black opacity-60 cursor-not-allowed hover:text-gray-600 transition-colors"
        >
          <Trash2 size={16} />
          삭제
        </button>

        {/* 필터 컨트롤들 */}
        <div className="flex items-center gap-8">
          <Dropdown
            options={workOptions}
            value={selectedWork}
            onChange={setSelectedWork}
            placeholder="근무"
          />

          <Dropdown
            options={groupOptions}
            value={selectedGroup}
            onChange={setSelectedGroup}
            placeholder="조"
          />

          <div className="w-[360px]">
            <Search
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="검색어 입력"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="캐디 리스트" action={headerAction} />

      {filterArea}

      <TableWithPagination
        columns={columns}
        data={currentData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
        layout="flexible"
        maxHeight={700}
      />
    </div>
  );
};

export default CaddieListPage;
