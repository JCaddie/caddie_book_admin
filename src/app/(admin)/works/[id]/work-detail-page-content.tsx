"use client";

import { notFound, useRouter } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import { DeleteConfirmationModal, Button } from "@/shared/components/ui";
import WorkDetailForm from "@/modules/work/components/work-detail-form";
import WorkDetailSidebar from "@/modules/work/components/work-detail-sidebar";
import { useWorkDetail } from "@/modules/work/hooks/use-work-detail";

interface WorkDetailPageContentProps {
  workId: string;
}

export default function WorkDetailPageContent({
  workId,
}: WorkDetailPageContentProps) {
  const router = useRouter();

  const {
    work,
    isEditing,
    isDeleting,
    showDeleteModal,
    handleEdit,
    handleCancel,
    handleUpdate,
    handleSave,
    handleDelete,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = useWorkDetail(workId);

  // 목록으로 돌아가기
  const handleBackToList = () => {
    router.push("/works");
  };

  // 존재하지 않는 근무 ID인 경우
  if (!work) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <AdminPageHeader
        title={`근무 관리 - ${work.golfCourse} (${work.date})`}
        action={
          <Button
            onClick={handleBackToList}
            variant="outline"
            className="flex items-center gap-2"
          >
            ← 목록으로 돌아가기
          </Button>
        }
      />

      {/* 메인 콘텐츠 */}
      <div className="max-w-[1920px] mx-auto p-6">
        <div className="flex gap-8">
          {/* 왼쪽: 상세 정보 폼 (스크롤 가능) */}
          <div className="flex-1 min-w-0">
            <WorkDetailForm
              work={work}
              onUpdate={handleUpdate}
              isEditing={isEditing}
            />
          </div>

          {/* 오른쪽: 액션 사이드바 (sticky) */}
          <div className="w-80 flex-shrink-0">
            <WorkDetailSidebar
              work={work}
              isEditing={isEditing}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="근무 삭제"
        message={`${work.golfCourse} (${work.date}) 근무를 삭제하시겠습니까?`}
        confirmText="삭제하기"
        cancelText="취소"
      />
    </div>
  );
}
