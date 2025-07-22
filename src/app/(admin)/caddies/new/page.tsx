"use client";

import { AdminPageHeader } from "@/shared/components/layout";
import {
  ConfirmationModal,
  Pagination,
  SelectableDataTable,
} from "@/shared/components/ui";
import { useNewCaddieManagement } from "@/modules/caddie/hooks";
import {
  NewCaddieActionBar,
  useNewCaddieColumns,
} from "@/modules/caddie/components";
import { NEW_CADDIE_CONSTANTS } from "@/modules/caddie/constants";
import { NewCaddieApplication } from "@/modules/caddie/types";

export default function NewCaddiePage() {
  // 커스텀 훅으로 상태 관리 및 로직 위임
  const {
    selectedRowKeys,
    searchTerm,
    isApprovalModalOpen,
    isRejectModalOpen,
    isIndividualApprovalModalOpen,
    isIndividualRejectModalOpen,
    selectedCaddieName,
    totalPages,
    currentData,
    pendingCount,
    isLoading,
    error,
    openApprovalModal,
    openRejectModal,
    handleBulkApprove,
    handleBulkReject,
    handleIndividualApprove,
    handleIndividualReject,
    handleSelectChange,
    handleRowClick,
    handleSearchChange,
    handleSearchClear,
    handleSearch,
    setIsApprovalModalOpen,
    setIsRejectModalOpen,
    setIsIndividualApprovalModalOpen,
    setIsIndividualRejectModalOpen,
    refreshData,
  } = useNewCaddieManagement();

  // 테이블 컬럼 생성 (이제 매개변수 없음)
  const columns = useNewCaddieColumns();

  // 에러 상태 처리
  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <AdminPageHeader title="신규 캐디" />
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="신규 캐디" />

      <NewCaddieActionBar
        pendingCount={pendingCount}
        selectedCount={selectedRowKeys.length}
        searchTerm={searchTerm}
        onRejectSelected={openRejectModal}
        onApproveSelected={openApprovalModal}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        onSearch={handleSearch}
      />

      <div className="space-y-6">
        {/* 로딩 상태 표시 */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">데이터를 불러오는 중...</div>
          </div>
        )}

        {/* 데이터 테이블 */}
        {!isLoading && (
          <SelectableDataTable<NewCaddieApplication>
            columns={columns}
            data={currentData}
            realDataCount={currentData.length}
            selectable={true}
            selectedRowKeys={selectedRowKeys}
            onSelectChange={handleSelectChange}
            onRowClick={handleRowClick}
            rowKey="id"
            layout="flexible"
            emptyText={NEW_CADDIE_CONSTANTS.EMPTY_STATE_MESSAGE}
          />
        )}

        {totalPages > 1 && <Pagination totalPages={totalPages} />}
      </div>

      {/* 모달 */}
      <ConfirmationModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleBulkApprove}
        title={NEW_CADDIE_CONSTANTS.APPROVAL_MODAL_TITLE}
        message={`선택한 ${selectedRowKeys.length}명의 캐디를 승인하시겠습니까?`}
        confirmText={NEW_CADDIE_CONSTANTS.APPROVAL_BUTTON_TEXT}
        cancelText={NEW_CADDIE_CONSTANTS.CANCEL_BUTTON_TEXT}
      />

      <ConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleBulkReject}
        title={NEW_CADDIE_CONSTANTS.REJECT_MODAL_TITLE}
        message={`선택한 ${selectedRowKeys.length}명의 캐디를 거절하시겠습니까?`}
        confirmText={NEW_CADDIE_CONSTANTS.REJECT_BUTTON_TEXT}
        cancelText={NEW_CADDIE_CONSTANTS.CANCEL_BUTTON_TEXT}
      />

      {/* 개별 승인 모달 */}
      <ConfirmationModal
        isOpen={isIndividualApprovalModalOpen}
        onClose={() => setIsIndividualApprovalModalOpen(false)}
        onConfirm={handleIndividualApprove}
        title={NEW_CADDIE_CONSTANTS.APPROVAL_MODAL_TITLE}
        message={`${selectedCaddieName}님을 승인하시겠습니까?`}
        confirmText={NEW_CADDIE_CONSTANTS.APPROVAL_BUTTON_TEXT}
        cancelText={NEW_CADDIE_CONSTANTS.CANCEL_BUTTON_TEXT}
      />

      {/* 개별 거절 모달 */}
      <ConfirmationModal
        isOpen={isIndividualRejectModalOpen}
        onClose={() => setIsIndividualRejectModalOpen(false)}
        onConfirm={handleIndividualReject}
        title={NEW_CADDIE_CONSTANTS.REJECT_MODAL_TITLE}
        message={`${selectedCaddieName}님을 거절하시겠습니까?`}
        confirmText={NEW_CADDIE_CONSTANTS.REJECT_BUTTON_TEXT}
        cancelText={NEW_CADDIE_CONSTANTS.CANCEL_BUTTON_TEXT}
      />
    </div>
  );
}
