"use client";

import { AdminPageHeader } from "@/shared/components/layout";
import {
  Button,
  SelectableDataTable,
  Search,
  Pagination,
  Badge,
  DeleteConfirmationModal,
} from "@/shared/components/ui";
import { useNewCaddieManagement } from "@/modules/caddie/hooks";
import { createNewCaddieColumns } from "@/modules/caddie/components";
import { NEW_CADDIE_CONSTANTS } from "@/modules/caddie/constants";

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
    paddedData,
    currentData,
    pendingCount,
    openApprovalModal,
    openRejectModal,
    openIndividualApprovalModal,
    openIndividualRejectModal,
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

  // 테이블 컬럼 생성
  const columns = createNewCaddieColumns({
    onApprove: openIndividualApprovalModal,
    onReject: openIndividualRejectModal,
  });

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="신규 캐디" />

      <div className="flex flex-col gap-2">
        {/* 상단 영역 */}
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">신규</span>
            <Badge variant="orange">{pendingCount}</Badge>
          </div>

          <div className="flex items-center gap-8">
            {/* 검색 */}
            <div className="w-[400px]">
              <Search
                placeholder={NEW_CADDIE_CONSTANTS.SEARCH_PLACEHOLDER}
                value={searchTerm}
                onChange={handleSearchChange}
                onClear={handleSearchClear}
              />
            </div>

            {/* 버튼 */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => openRejectModal("selected")}
                disabled={selectedRowKeys.length === 0}
              >
                {NEW_CADDIE_CONSTANTS.REJECT_BUTTON_TEXT}
              </Button>
              <Button onClick={() => openApprovalModal("all")}>
                {NEW_CADDIE_CONSTANTS.BULK_APPROVE_BUTTON_TEXT}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SelectableDataTable
            columns={columns}
            data={paddedData}
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
      </div>

      {/* 모달 */}
      <DeleteConfirmationModal
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

      <DeleteConfirmationModal
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
      <DeleteConfirmationModal
        isOpen={isIndividualApprovalModalOpen}
        onClose={() => setIsIndividualApprovalModalOpen(false)}
        onConfirm={handleIndividualApprove}
        title={NEW_CADDIE_CONSTANTS.APPROVAL_MODAL_TITLE}
        message={`${selectedCaddieName}님을 승인하시겠습니까?`}
        confirmText={NEW_CADDIE_CONSTANTS.APPROVAL_BUTTON_TEXT}
        cancelText={NEW_CADDIE_CONSTANTS.CANCEL_BUTTON_TEXT}
      />

      {/* 개별 거절 모달 */}
      <DeleteConfirmationModal
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
