"use client";

import { use } from "react";
import { AdminPageHeader } from "@/shared/components/layout";
import { DataTable, Pagination } from "@/shared/components/ui";
import { useCartDetail } from "@/modules/cart/hooks";
import { cartHistoryColumns } from "@/modules/cart/components";
import { CART_STATUS_STYLES } from "@/modules/cart/constants";
import { CartStatus } from "@/modules/cart/types";

interface CartDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 상태 뱃지 컴포넌트
const StatusBadge: React.FC<{ status: CartStatus }> = ({ status }) => {
  const styleClass = CART_STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${styleClass}`}
    >
      {status}
    </span>
  );
};

const CartDetailPage: React.FC<CartDetailPageProps> = ({ params }) => {
  const resolvedParams = use(params);

  // 커스텀 훅으로 카트 상세 데이터 가져오기
  const {
    cartDetail,
    currentHistoryData,
    currentPage,
    totalPages,
    handlePageChange,
  } = useCartDetail({ cartId: resolvedParams.id });

  // 테이블 컬럼 생성
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const historyColumns = cartHistoryColumns() as any;

  return (
    <div className="bg-white rounded-xl p-8 space-y-10">
      {/* 페이지 헤더 */}
      <AdminPageHeader title="카트" />

      {/* 기본 정보 섹션 */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-600">기본 정보</h2>
        <div className="border border-gray-200 rounded-md">
          <div className="grid grid-cols-2 gap-0">
            {/* 첫 번째 행: 카트명, 상태 */}
            <div className="border-b border-gray-200 flex">
              <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                <span className="text-sm font-bold">카트명</span>
              </div>
              <div className="flex-1 flex items-center px-4 py-3">
                <span className="text-sm text-black">{cartDetail.name}</span>
              </div>
            </div>
            <div className="border-b border-gray-200 flex">
              <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                <span className="text-sm font-bold">상태</span>
              </div>
              <div className="flex-1 flex items-center px-4 py-3">
                <StatusBadge status={cartDetail.status} />
              </div>
            </div>

            {/* 두 번째 행: 필드, 관리자 */}
            <div className="flex">
              <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                <span className="text-sm font-bold">필드</span>
              </div>
              <div className="flex-1 flex items-center px-4 py-3">
                <span className="text-sm text-blue-600 font-medium">
                  {cartDetail.fieldName}
                </span>
              </div>
            </div>
            <div className="flex">
              <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                <span className="text-sm font-bold">관리자</span>
              </div>
              <div className="flex-1 flex items-center px-4 py-3">
                <span className="text-sm text-black">
                  {cartDetail.managerName}
                </span>
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
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDetailPage;
