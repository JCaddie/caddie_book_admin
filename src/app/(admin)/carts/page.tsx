"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Dropdown, EmptyState } from "@/shared/components/ui";
import {
  AdminPageHeader,
  TableWithPagination,
} from "@/shared/components/layout";
import { usePagination, TableItem, defaultCellRenderer } from "@/shared/hooks";
import { Car, Trash2 } from "lucide-react";

// 카트 데이터 타입
interface Cart extends TableItem {
  no: number;
  cartNumber: string;
  golfCourse: string;
  type: string;
  status: string;
  batteryLevel: number;
  lastMaintenance: string;
  location: string;
}

const CartsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체");

  // URL 검색 파라미터로부터 자동 검색 설정
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    }
  }, [searchParams]);

  // 샘플 데이터
  const allCarts: Cart[] = useMemo(
    () =>
      Array.from({ length: 56 }, (_, index) => ({
        id: `cart-${index + 1}`,
        no: index + 1,
        cartNumber: `C${String(index + 1).padStart(3, "0")}`,
        golfCourse: ["제이캐디 아카데미", "골프파크", "그린힐스"][index % 3],
        type: ["전기카트", "가솔린카트"][index % 2],
        status: ["사용가능", "사용중", "정비중", "고장"][index % 4],
        batteryLevel: Math.floor(Math.random() * 100),
        lastMaintenance: "2025-01-01",
        location: ["창고", "1번홀", "9번홀", "클럽하우스"][index % 4],
      })),
    []
  );

  // 필터링된 데이터
  const filteredCarts = useMemo(() => {
    return allCarts.filter((cart) => {
      const matchesSearch =
        searchTerm === "" ||
        cart.cartNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cart.golfCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cart.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "전체" || cart.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [allCarts, searchTerm, selectedStatus]);

  // 페이지네이션 훅 사용
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredCarts,
      itemsPerPage: 20,
    });

  // 테이블 컬럼 정의
  const columns = [
    {
      key: "no",
      title: "No.",
      width: 80,
      align: "center" as const,
      render: defaultCellRenderer<Cart>,
    },
    {
      key: "cartNumber",
      title: "카트번호",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Cart>,
    },
    {
      key: "golfCourse",
      title: "골프장",
      width: 180,
      align: "center" as const,
      render: defaultCellRenderer<Cart>,
    },
    {
      key: "type",
      title: "카트유형",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Cart>,
    },
    {
      key: "status",
      title: "상태",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Cart>,
    },
    {
      key: "batteryLevel",
      title: "배터리(%)",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Cart>,
    },
    {
      key: "lastMaintenance",
      title: "최근정비일",
      width: 140,
      align: "center" as const,
      render: defaultCellRenderer<Cart>,
    },
    {
      key: "location",
      title: "위치",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Cart>,
    },
  ];

  const handleRowClick = (cart: Cart) => {
    if (cart.isEmpty) {
      return;
    }
    // TODO: 카트 상세 페이지로 이동
    // router.push(`/carts/${cart.id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const statusOptions = [
    { value: "전체", label: "전체" },
    { value: "사용가능", label: "사용가능" },
    { value: "사용중", label: "사용중" },
    { value: "정비중", label: "정비중" },
    { value: "고장", label: "고장" },
  ];

  const hasNoResults = filteredCarts.length === 0;

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader
        title="카트 관리"
        action={
          <button className="flex items-center gap-1 bg-[#FEB912] text-white font-medium text-base px-4 py-2 rounded-md hover:bg-[#E5A50F] transition-colors">
            <Car size={24} />
            카트 추가
          </button>
        }
      />

      {/* 필터 영역 */}
      <div className="flex items-center justify-between">
        <div className="text-base font-bold text-gray-900">
          총 {filteredCarts.length}대
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 opacity-60">
            <Trash2 size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-500">삭제</span>
          </div>

          <div className="flex items-center gap-2">
            <Dropdown
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="상태"
              containerClassName="w-[120px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Search
              placeholder="검색어 입력"
              containerClassName="w-[360px]"
              onChange={handleSearchChange}
              value={searchTerm}
            />
          </div>
        </div>
      </div>

      {/* 테이블 또는 빈 상태 */}
      {hasNoResults ? (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-t-md border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="w-20 text-center">
                <span className="text-sm font-bold text-gray-600">No.</span>
              </div>
              <div className="w-30 text-center">
                <span className="text-sm font-bold text-gray-600">
                  카트번호
                </span>
              </div>
              <div className="w-45 text-center">
                <span className="text-sm font-bold text-gray-600">골프장</span>
              </div>
              <div className="w-30 text-center">
                <span className="text-sm font-bold text-gray-600">
                  카트유형
                </span>
              </div>
              <div className="w-30 text-center">
                <span className="text-sm font-bold text-gray-600">상태</span>
              </div>
              <div className="w-30 text-center">
                <span className="text-sm font-bold text-gray-600">
                  배터리(%)
                </span>
              </div>
              <div className="w-35 text-center">
                <span className="text-sm font-bold text-gray-600">
                  최근정비일
                </span>
              </div>
              <div className="w-30 text-center">
                <span className="text-sm font-bold text-gray-600">위치</span>
              </div>
            </div>
          </div>
          <EmptyState className="rounded-t-none border-t-0" />
        </div>
      ) : (
        <TableWithPagination
          columns={columns}
          data={currentData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
          layout="flexible"
        />
      )}
    </div>
  );
};

export default CartsPage;
