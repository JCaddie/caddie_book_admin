"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Dropdown,
  SelectableDataTable,
  Pagination,
} from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { usePagination, TableItem } from "@/shared/hooks";
import { Trash2 } from "lucide-react";

// 캐디 데이터 타입 (Figma 디자인에 맞춤)
interface Caddie extends TableItem {
  no: number;
  name: string;
  golfCourse: string; // 골프장 추가
  gender: string;
  workStatus: string;
  group: string;
  groupOrder: string;
  specialTeam: string; // 특수반 추가
  phone: string;
  workScore: string;
}

const CaddieListPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("그룹");
  const [selectedSpecialTeam, setSelectedSpecialTeam] = useState("특수반");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<Caddie[]>([]);

  // URL 검색 파라미터로부터 자동 검색 설정
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    }
  }, [searchParams]);

  // 샘플 데이터 (총 78개)
  const allCaddies: Caddie[] = useMemo(
    () =>
      Array.from({ length: 78 }, (_, index) => ({
        id: `caddie-${index + 1}`,
        no: index + 1,
        name: "홍길동",
        golfCourse: "제이캐디아카데미", // 모든 캐디가 같은 골프장
        gender: index % 2 === 0 ? "남" : "여",
        workStatus:
          index % 4 === 0 ? "근무 중" : index % 4 === 1 ? "휴무" : "근무 중",
        group: `${Math.floor(index / 4) + 1}조`,
        groupOrder: `${(index % 4) + 1}`,
        specialTeam:
          index % 3 === 0 ? "하우스" : index % 3 === 1 ? "3부반" : "하우스",
        phone: "010-1234-5678",
        workScore: ["상", "중", "하"][index % 3],
      })),
    []
  );

  // 필터링된 데이터
  const filteredCaddies = useMemo(() => {
    return allCaddies.filter((caddie) => {
      const matchesSearch =
        searchTerm === "" ||
        caddie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caddie.golfCourse.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup =
        selectedGroup === "그룹" || caddie.group === selectedGroup;

      const matchesSpecialTeam =
        selectedSpecialTeam === "특수반" ||
        caddie.specialTeam === selectedSpecialTeam;

      return matchesSearch && matchesGroup && matchesSpecialTeam;
    });
  }, [allCaddies, searchTerm, selectedGroup, selectedSpecialTeam]);

  // 페이지네이션 훅 사용
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredCaddies,
      itemsPerPage: 20,
    });

  // 빈 행을 추가하여 일정한 높이 유지 (항상 20개 행 표시)
  const paddedData = useMemo(() => {
    const emptyRowsCount = Math.max(0, 20 - currentData.length);
    const emptyRows = Array.from({ length: emptyRowsCount }, (_, index) => ({
      id: `empty-${index}`,
      isEmpty: true,
      no: 0,
      name: "",
      golfCourse: "",
      gender: "",
      workStatus: "",
      group: "",
      groupOrder: "",
      specialTeam: "",
      phone: "",
      workScore: "",
    }));

    return [...currentData, ...emptyRows] as Caddie[];
  }, [currentData]);

  // 테이블 컬럼 정의 (Figma 디자인에 맞춤)
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
      key: "golfCourse",
      title: "골프장",
      width: 200,
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
      key: "specialTeam",
      title: "특수반",
      width: 120,
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
      width: 120,
      align: "center" as const,
    },
  ];

  // 행 클릭 핸들러
  const handleRowClick = (caddie: Caddie) => {
    // 상세 페이지로 이동
    router.push(`/caddies/${caddie.id}`);
  };

  // 선택 변경 핸들러
  const handleSelectChange = (
    selectedKeys: string[],
    selectedRecords: Caddie[]
  ) => {
    setSelectedRowKeys(selectedKeys);
    setSelectedRows(selectedRecords);
  };

  // 선택된 항목 삭제
  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }

    if (confirm(`선택된 ${selectedRows.length}개 항목을 삭제하시겠습니까?`)) {
      console.log("삭제할 캐디 목록:", selectedRows);
      // 실제 삭제 API 호출 로직 구현
      // 삭제 후 선택 상태 초기화
      setSelectedRowKeys([]);
      setSelectedRows([]);
      alert("삭제가 완료되었습니다.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 필터 옵션들
  const groupOptions = [
    { value: "그룹", label: "그룹" },
    { value: "1조", label: "1조" },
    { value: "2조", label: "2조" },
    { value: "3조", label: "3조" },
    { value: "4조", label: "4조" },
  ];

  const specialTeamOptions = [
    { value: "특수반", label: "특수반" },
    { value: "하우스", label: "하우스" },
    { value: "3부반", label: "3부반" },
  ];

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
          className={[
            "flex items-center gap-2 text-[13px] font-medium transition-colors",
            selectedRows.length > 0
              ? "text-black hover:text-red-600 cursor-pointer"
              : "text-black opacity-60 cursor-not-allowed",
          ].join(" ")}
          disabled={selectedRows.length === 0}
        >
          <Trash2 size={16} />
          삭제
        </button>

        {/* 필터 컨트롤들 */}
        <div className="flex items-center gap-8">
          <Dropdown
            options={groupOptions}
            value={selectedGroup}
            onChange={setSelectedGroup}
            placeholder="그룹"
          />

          <Dropdown
            options={specialTeamOptions}
            value={selectedSpecialTeam}
            onChange={setSelectedSpecialTeam}
            placeholder="특수반"
          />

          <div className="w-[360px]">
            <Search
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="제이캐디아카데미"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="캐디" />

      {filterArea}

      <div className="space-y-6">
        <SelectableDataTable
          columns={columns}
          data={paddedData}
          selectable={true}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectChange}
          onRowClick={handleRowClick}
          rowKey="id"
          layout="flexible"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CaddieListPage;
