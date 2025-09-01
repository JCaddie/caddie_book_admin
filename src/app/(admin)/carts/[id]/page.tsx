"use client";

import { use } from "react";
import { AdminPageHeader } from "@/shared/components/layout";
import { DataTable, Pagination } from "@/shared/components/ui";
import { useCartDetail, useCartEdit } from "@/modules/cart/hooks";
import {
  EditableCartField,
  useCartHistoryColumns,
} from "@/modules/cart/components";

interface CartDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const CartDetailPage: React.FC<CartDetailPageProps> = ({ params }) => {
  const resolvedParams = use(params);

  // 커스텀 훅으로 카트 상세 데이터 가져오기
  const {
    cartDetail,
    currentHistoryData,
    totalPages,
    isLoading,
    error,
    loadCartDetail,
  } = useCartDetail({
    cartId: resolvedParams.id,
  });

  // 카트 편집 기능 훅
  const {
    statusChoices,
    batteryLevelChoices,
    caddieChoices,
    updateName,
    updateStatus,
    updateBatteryLevel,
    updateManager,
    isLoading: isEditLoading,
    error: editError,
  } = useCartEdit({
    cartId: resolvedParams.id,
    currentGolfCourseId: cartDetail.golfCourseId,
    onUpdate: () => {
      // 상세 정보가 업데이트되면 다시 로드
      loadCartDetail();
    },
  });

  // 편집 함수 래퍼들 (타입 호환성을 위해)
  const handleNameUpdate = async (value: string | number) => {
    await updateName(String(value));
  };

  const handleStatusUpdate = async (value: string | number) => {
    await updateStatus(String(value));
  };

  const handleBatteryLevelUpdate = async (value: string | number) => {
    await updateBatteryLevel(Number(value));
  };

  const handleManagerUpdate = async (value: string | number) => {
    await updateManager(String(value));
  };

  // 테이블 컬럼 생성
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const historyColumns = useCartHistoryColumns() as any;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-10">
        <AdminPageHeader title="카트" />
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-4"></div>
            <p>카트 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-10">
        <AdminPageHeader title="카트" />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 space-y-10">
      {/* 페이지 헤더 */}
      <AdminPageHeader title="카트" />

      {/* 편집 에러 메시지 */}
      {editError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{editError}</p>
        </div>
      )}

      {/* 기본 정보 섹션 */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-600">기본 정보</h2>
        <div className="border border-gray-200 rounded-md">
          <div className="grid grid-cols-2 gap-0">
            {/* 첫 번째 행: 카트명, 상태 */}
            <div className="border-b border-gray-200">
              <EditableCartField
                label="카트명"
                value={cartDetail.name}
                onSave={handleNameUpdate}
                type="text"
                disabled={isEditLoading}
              />
            </div>
            <div className="border-b border-gray-200">
              <EditableCartField
                label="상태"
                value={cartDetail.status}
                onSave={handleStatusUpdate}
                type="select"
                options={statusChoices}
                disabled={isEditLoading}
              />
            </div>

            {/* 두 번째 행: 필드, 관리자 */}
            <div className="flex">
              <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                <span className="text-sm font-bold">필드</span>
              </div>
              <div className="flex-1 flex items-center px-4 py-3">
                <span className="text-sm text-blue-600 font-medium">
                  {cartDetail.location || "일반"}
                </span>
              </div>
            </div>
            <div>
              <EditableCartField
                label="관리자"
                value={cartDetail.managerName || ""}
                onSave={handleManagerUpdate}
                type="select"
                options={caddieChoices}
                disabled={isEditLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 추가 정보 섹션 */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-600">추가 정보</h2>
        <div className="border border-gray-200 rounded-md">
          <div className="grid grid-cols-2 gap-0">
            {/* 배터리 레벨, 골프장 */}
            <div className="border-b border-gray-200">
              <EditableCartField
                label="배터리"
                value={cartDetail.batteryLevel || 0}
                onSave={handleBatteryLevelUpdate}
                type="select"
                options={batteryLevelChoices}
                disabled={isEditLoading}
              />
            </div>
            <div className="border-b border-gray-200">
              <div className="flex">
                <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                  <span className="text-sm font-bold">골프장</span>
                </div>
                <div className="flex-1 flex items-center px-4 py-3">
                  <span className="text-sm text-black">
                    {cartDetail.golfCourseName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 이력 섹션 */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-600">이력</h2>
        <div className="space-y-6">
          {/* 테이블 */}
          <DataTable
            data={currentHistoryData}
            columns={historyColumns}
            onRowClick={() => {}}
            layout="flexible"
            containerWidth="auto"
          />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDetailPage;
