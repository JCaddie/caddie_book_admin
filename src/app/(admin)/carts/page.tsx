"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import { SelectableDataTable, Pagination } from "@/shared/components/ui";
import { useCartList } from "@/modules/cart/hooks";
import { useCartColumns, CartActionBar } from "@/modules/cart/components";
import { Cart } from "@/modules/cart/types";

const CartsPage: React.FC = () => {
  const router = useRouter();

  // 컬럼 정의 (메모이제이션)
  const columns = useCartColumns();

  // 카트 리스트 데이터 및 로직
  const {
    data,
    totalCount,
    realDataCount,
    currentPage,
    totalPages,
    handlePageChange,
    filters,
    updateSearchTerm,
    selection,
    updateSelection,
    deleteSelectedCarts,
    isDeleting,
    error,
  } = useCartList();

  // 새 카트 생성 페이지로 이동
  const handleCreateNew = () => {
    router.push("/admin/carts/new");
  };

  // 카트 상세 페이지로 이동
  const handleRowClick = (cart: Cart) => {
    // 빈 행이 아닌 경우에만 상세 페이지로 이동
    if (cart.id && !cart.id.startsWith("empty")) {
      router.push(`/admin/carts/${cart.id}`);
    }
  };

  // 선택 상태 변경 핸들러
  const handleSelectionChange = (
    selectedRowKeys: string[],
    selectedRows: Cart[]
  ) => {
    // 빈 행은 선택에서 제외
    const validSelectedRows = selectedRows.filter(
      (row) => row.id && !row.id.startsWith("empty")
    );
    const validSelectedRowKeys = validSelectedRows.map((row) => row.id);

    updateSelection(validSelectedRowKeys, validSelectedRows);
  };

  return (
    <div className="flex flex-col gap-10 p-8">
      {/* 페이지 헤더 */}
      <AdminPageHeader title="카트 리스트" />

      {/* 액션 바 */}
      <CartActionBar
        totalCount={totalCount}
        selectedCount={selection.selectedRowKeys.length}
        searchTerm={filters.searchTerm}
        onSearchChange={updateSearchTerm}
        onDeleteSelected={deleteSelectedCarts}
        onCreateNew={handleCreateNew}
        isDeleting={isDeleting}
      />

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* 테이블 */}
      <div className="bg-white rounded-md border border-gray-200">
        <SelectableDataTable<Cart>
          columns={columns}
          data={data}
          selectable={true}
          selectedRowKeys={selection.selectedRowKeys}
          onSelectChange={handleSelectionChange}
          onRowClick={handleRowClick}
          rowKey="id"
          layout="fixed"
          containerWidth={1536} // Figma 디자인 기준 고정 너비
          realDataCount={realDataCount}
          emptyText="카트 데이터가 없습니다"
          className="rounded-md"
        />
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CartsPage;
