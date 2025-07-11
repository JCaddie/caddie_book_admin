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
    searchTerm,
    selectedRowKeys,
    isApprovalModalOpen,
    isRejectModalOpen,
    modalType,
    isIndividualApprovalModalOpen,
    isIndividualRejectModalOpen,
    selectedCaddieName,
    currentPage,
    totalPages,
    currentData,
    pendingCount,
    openApprovalModal,
    openRejectModal,
    // openIndividualApprovalModal, // 사용되지 않음
    // openIndividualRejectModal, // 사용되지 않음
    handleBulkApprove,
    handleBulkReject,
    handleIndividualApprove,
    handleIndividualReject,
    handleSearchChange,
    handleSearchClear,
    handleSelectChange,
    handleRowClick,
    handlePageChange,
    setIsApprovalModalOpen,
    setIsRejectModalOpen,
    setIsIndividualApprovalModalOpen,
    setIsIndividualRejectModalOpen,
  } = useNewCaddieManagement();

  // 테이블 컬럼 생성 (이제 매개변수 없음)
  const columns = useNewCaddieColumns();

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="신규 캐디" />

      <NewCaddieActionBar
        pendingCount={pendingCount}
        selectedCount={selectedRowKeys.length}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        onRejectSelected={() => openRejectModal("selected")}
        onApproveAll={() => openApprovalModal("all")}
      />

      <div className="space-y-6">
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

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* 모달 */}
      <ConfirmationModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleBulkApprove}
        title={NEW_CADDIE_CONSTANTS.APPROVAL_MODAL_TITLE}
        message={
          modalType === "selected"
            ? `선택한 ${selectedRowKeys.length}명의 캐디를 승인하시겠습니까?`
            : "모든 캐디를 승인하시겠습니까?"
        }
        confirmText={NEW_CADDIE_CONSTANTS.APPROVAL_BUTTON_TEXT}
        cancelText={NEW_CADDIE_CONSTANTS.CANCEL_BUTTON_TEXT}
      />

      <ConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleBulkReject}
        title={NEW_CADDIE_CONSTANTS.REJECT_MODAL_TITLE}
        message={
          modalType === "selected"
            ? `선택한 ${selectedRowKeys.length}명의 캐디를 거절하시겠습니까?`
            : "모든 캐디를 거절하시겠습니까?"
        }
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
