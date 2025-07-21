"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import { Pagination, SelectableDataTable } from "@/shared/components/ui";
import { useCartCreate, useCartList } from "@/modules/cart/hooks";
import {
  CartActionBar,
  CartCreateModal,
  useCartColumns,
} from "@/modules/cart/components";
import { Cart } from "@/modules/cart/types";

const CartsPage: React.FC = () => {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 컬럼 정의 (메모이제이션)
  const columns = useCartColumns();

  // 카트 리스트 데이터 및 로직
  const {
    data,
    totalCount,
    realDataCount,
    totalPages,
    filters,
    updateSearchTerm,
    selectedGolfCourseId,
    golfCourseSearchTerm,
    handleGolfCourseChange,
    handleGolfCourseSearchChange,
    selection,
    updateSelection,
    deleteSelectedCarts,
    isDeleting,
    error,
  } = useCartList();

  // 카트 생성 로직
  const { createNewCart, isLoading: isCreating } = useCartCreate(() => {
    setIsCreateModalOpen(false);
    // 페이지 새로고침으로 목록 업데이트
    window.location.reload();
  });

  // 새 카트 생성 모달 열기
  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  // 카트 생성 처리
  const handleCartCreate = async (data: {
    name: string;
    golf_course_id: string;
  }) => {
    try {
      await createNewCart(data);
    } catch (error) {
      // 에러는 useCartCreate에서 처리됨
      console.error("카트 생성 실패:", error);
    }
  };

  // 카트 상세 페이지로 이동
  const handleRowClick = (cart: Cart) => {
    // 빈 행이 아닌 경우에만 상세 페이지로 이동
    if (cart.id && !cart.isEmpty) {
      router.push(`/carts/${cart.id}`);
    }
  };

  // 선택 상태 변경 핸들러
  const handleSelectionChange = (
    selectedRowKeys: string[],
    selectedRows: Cart[]
  ) => {
    // useCartList의 updateSelection에서 이미 빈 행 처리를 하므로 직접 호출
    updateSelection(selectedRowKeys, selectedRows);
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="카트 리스트" />

      <CartActionBar
        totalCount={totalCount}
        selectedCount={selection.selectedRowKeys.length}
        searchTerm={filters.searchTerm}
        onSearchChange={updateSearchTerm}
        onDeleteSelected={deleteSelectedCarts}
        onCreateNew={handleCreateNew}
        isDeleting={isDeleting}
        selectedGolfCourseId={selectedGolfCourseId}
        golfCourseSearchTerm={golfCourseSearchTerm}
        onGolfCourseChange={handleGolfCourseChange}
        onGolfCourseSearchChange={handleGolfCourseSearchChange}
      />

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <SelectableDataTable<Cart>
          columns={columns}
          data={data}
          selectable={true}
          selectedRowKeys={selection.selectedRowKeys}
          onSelectChange={handleSelectionChange}
          onRowClick={handleRowClick}
          rowKey="id"
          layout="flexible"
          containerWidth="auto"
          realDataCount={realDataCount}
          emptyText="카트 데이터가 없습니다"
          className="border-gray-200"
        />

        {totalPages > 1 && <Pagination totalPages={totalPages} />}
      </div>

      {/* 카트 생성 모달 */}
      <CartCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCartCreate}
        isLoading={isCreating}
      />
    </div>
  );
};

export default CartsPage;
