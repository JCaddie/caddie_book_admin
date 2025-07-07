"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Dropdown,
  DataTable,
  Pagination,
} from "@/shared/components/ui";
import { UserPlus, Trash2 } from "lucide-react";

// 캐디 데이터 타입 (Figma 디자인에 맞춤)
interface Caddie extends Record<string, unknown> {
  id: string;
  no: number;
  name: string;
  gender: string;
  workStatus: string;
  group: string;
  groupOrder: string;
  phone: string;
  workScore: string;
}

// 빈 행을 포함한 확장된 타입
interface CaddieWithEmpty extends Caddie {
  isEmpty?: boolean;
}

const CaddieListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
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

  // 페이지네이션 계산
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredCaddies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCaddies = filteredCaddies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // 빈 행을 추가하여 테이블 높이를 일정하게 유지
  const paddedCaddies: CaddieWithEmpty[] = useMemo(() => {
    const result: CaddieWithEmpty[] = [...currentCaddies];
    const emptyRowsCount = itemsPerPage - currentCaddies.length;

    // 빈 행 추가
    for (let i = 0; i < emptyRowsCount; i++) {
      result.push({
        id: `empty-${i}`,
        no: 0, // number 타입에 맞춤
        name: "",
        gender: "",
        workStatus: "",
        group: "",
        groupOrder: "", // string 타입 유지
        phone: "",
        workScore: "",
        isEmpty: true, // 빈 행 식별용
      });
    }

    return result;
  }, [currentCaddies, itemsPerPage]);

  // 테이블 컬럼 정의 (Figma 스펙에 정확히 맞춤 - 총 1504px)
  const columns = [
    {
      key: "no",
      title: "No.",
      width: 80, // 80px 고정
      align: "center" as const,
    },
    {
      key: "name",
      title: "이름",
      width: 240, // 240px 고정
      align: "center" as const,
    },
    {
      key: "gender",
      title: "성별",
      width: 120, // 성별 컬럼 너비
      align: "center" as const,
    },
    {
      key: "workStatus",
      title: "근무",
      width: 150, // 근무 상태 컬럼 너비
      align: "center" as const,
    },
    {
      key: "group",
      title: "그룹",
      width: 120, // 그룹 컬럼 너비
      align: "center" as const,
    },
    {
      key: "groupOrder",
      title: "그룹 순서",
      width: 140, // 그룹 순서 컬럼 너비
      align: "center" as const,
    },
    {
      key: "phone",
      title: "연락처",
      width: 240, // 240px 고정
      align: "center" as const,
    },
    {
      key: "workScore",
      title: "근무점수",
      width: 414, // 나머지 공간 (1504 - 80 - 240 - 120 - 150 - 120 - 140 - 240 = 414px)
      align: "center" as const,
    },
  ];

  // 행 클릭 핸들러
  const handleRowClick = (caddie: CaddieWithEmpty, index: number) => {
    // 빈 행인 경우 클릭 이벤트 무시
    if (caddie.isEmpty) {
      return;
    }

    console.log("캐디 선택:", caddie, "인덱스:", index);
    // 상세 페이지로 이동하거나 모달을 열 수 있음
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50"
      style={{ minWidth: "1600px" }}
    >
      {/* 메인 콘텐츠 영역 */}
      <div className="bg-white rounded-xl flex-1 flex flex-col">
        {/* 헤더 영역 - 메인 콘텐츠 내부로 이동 */}
        <div className="p-8 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black">캐디 리스트</h1>
            <button className="flex items-center gap-1 bg-[#FEB912] text-white font-medium text-base px-4 py-2 rounded-md hover:bg-[#E5A50F] transition-colors">
              <UserPlus size={24} />
              소속 요청
            </button>
          </div>
        </div>

        {/* 필터 영역 - Figma 디자인에 맞춤 */}
        <div className="p-8 border-b">
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
        </div>

        {/* 테이블 영역 - 고정 너비 1504px */}
        <div className="flex-1 p-8 pt-0">
          <div className="mt-6 flex justify-center">
            <DataTable
              columns={columns}
              data={paddedCaddies}
              onRowClick={handleRowClick}
            />
          </div>
        </div>

        {/* 페이지네이션 영역 - 하단 고정 */}
        <div className="p-8 pt-0 pb-8 border-t bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CaddieListPage;
