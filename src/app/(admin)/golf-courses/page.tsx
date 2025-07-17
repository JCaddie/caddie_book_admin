"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import RoleGuard from "@/shared/components/auth/role-guard";
import {
  Button,
  ConfirmationModal,
  Dropdown,
  EmptyState,
  SearchWithButton,
  SelectableDataTable,
} from "@/shared/components/ui";

import { useGolfCourseList } from "@/modules/golf-course/hooks/use-golf-course-list";
import Pagination from "@/shared/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { GOLF_COURSE_TABLE_COLUMNS } from "@/shared/constants/golf-course";
import { deleteGolfCourse } from "@/modules/golf-course/api/golf-course-api";
// import type { GolfCourse } from "@/modules/golf-course/types/golf-course";

const FIELD_COUNT_OPTIONS = [
  { label: "필드 수", value: "" },
  ...Array.from({ length: 9 }, (_, i) => ({
    label: `${i + 1}`,
    value: String(i + 1),
  })),
];

const GolfCoursesPage: React.FC = () => {
  // 드롭다운 옵션 상태
  const [contractOptions, setContractOptions] = useState<
    { label: string; value: string; rawId?: string }[]
  >([{ label: "계약현황", value: "" }]);
  const [membershipOptions, setMembershipOptions] = useState<
    { label: string; value: string; rawId?: string }[]
  >([{ label: "종류", value: "" }]);
  const [isActiveOptions, setIsActiveOptions] = useState<
    { label: string; value: string }[]
  >([{ label: "활성 여부", value: "" }]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // 옵션 fetch
  useEffect(() => {
    setLoadingOptions(true);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    Promise.all([
      fetch(
        `${API_BASE_URL}/api/v1/golf-courses/constants/contract_status/`
      ).then((res) => res.json()),
      fetch(
        `${API_BASE_URL}/api/v1/golf-courses/constants/membership_type/`
      ).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/v1/golf-courses/constants/is_active/`).then(
        (res) => res.json()
      ),
    ])
      .then(
        ([contract, membership, isActive]: [
          Array<{ id: string | boolean; value: string }>,
          Array<{ id: string; value: string }>,
          Array<{ id: boolean; value: string }>
        ]) => {
          setContractOptions([
            { label: "계약현황", value: "" },
            ...contract.map((opt) => ({
              label: opt.value,
              value: String(opt.id),
              rawId: String(opt.id),
            })),
          ]);
          setMembershipOptions([
            { label: "종류", value: "" },
            ...membership.map((opt) => ({
              label: opt.value,
              value: String(opt.id),
              rawId: String(opt.id),
            })),
          ]);
          setIsActiveOptions([
            { label: "활성 여부", value: "" },
            ...isActive.map((opt) => ({
              label: opt.value,
              value: String(opt.id),
            })),
          ]);
        }
      )
      .finally(() => setLoadingOptions(false));
  }, []);

  // 선택 상태 관리
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // URL 검색 파라미터 처리
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page") || 1);
  const searchTerm = searchParams.get("search") || "";

  // 드롭다운 value는 URL에서 읽음
  const contractValue = searchParams.get("contract") || "";
  const fieldCountValue = searchParams.get("field_count") || "";
  const membershipValue = searchParams.get("membership_type") || "";
  const isActiveValue = searchParams.get("isActive") || "";

  // 드롭다운 변경 핸들러 (모두 선택 시 파라미터 삭제)
  const handleDropdownChange = (key: string, value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1"); // 필터 변경 시 페이지 1로
    router.push(`?${params.toString()}`);
  };

  // URL 파라미터 기반 필터 객체 생성
  const filters = {
    contract: searchParams.get("contract") || "",
    field_count: searchParams.get("field_count") || "",
    membership_type: searchParams.get("membership_type") || "",
    category: "", // 필요시 추가 구현
  } as import("@/modules/golf-course/types/golf-course").GolfCourseFilters;
  const { data, isLoading, isError } = useGolfCourseList(
    currentPage,
    searchTerm,
    filters
  );

  // 행 클릭 핸들러
  const handleRowClick = (record: Record<string, unknown>) => {
    if ((record as { isEmpty?: boolean }).isEmpty) return;
    window.location.href = `/golf-courses/${record.id}`;
  };

  // 선택 변경 핸들러
  const handleUpdateSelection = useCallback(
    (keys: string[]) => {
      const filteredKeys = keys.filter((key) => {
        const record = (data?.results ?? []).find((item) => item.id === key);
        return record && !(record as { isEmpty?: boolean }).isEmpty;
      });
      setSelectedRowKeys(filteredKeys);
    },
    [data]
  );

  // 삭제 핸들러 등 기존 로직 동일
  const handleDeleteSelected = useCallback(() => {
    if (selectedRowKeys.length === 0) return;
    setIsDeleteModalOpen(true);
  }, [selectedRowKeys]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedRowKeys.length === 0) return;
    setIsDeleting(true);
    try {
      await Promise.all(selectedRowKeys.map((id) => deleteGolfCourse(id)));
      // 삭제 후 리스트 새로고침 (React Query invalidate 등 필요시 추가)
      window.location.reload();
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedRowKeys]);

  const handleCreateClick = useCallback(() => {
    window.location.href = "/golf-courses/new";
  }, []);

  // 로딩/에러/빈 상태 처리
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg">
        로딩 중...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center h-96 text-lg text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const hasNoResults = (data?.results?.length ?? 0) === 0;

  // no(목록 번호) 자동 부여
  interface GolfCourseAPI {
    id: string;
    name: string;
    region: string;
    contract_status: string;
    phone: string;
    membership_type: string;
    total_caddies: number;
    field_count: number;
  }
  const tableData: Record<string, unknown>[] = (
    (data?.results ?? []) as unknown as GolfCourseAPI[]
  ).map((item, idx) => {
    const contractLabel =
      contractOptions.find((opt) => opt.value === String(item.contract_status))
        ?.label || item.contract_status;
    const membershipLabel =
      membershipOptions.find(
        (opt) => opt.value === String(item.membership_type)
      )?.label || item.membership_type;
    return {
      id: item.id,
      no: ((data?.page ?? 1) - 1) * (data?.page_size ?? 20) + idx + 1,
      name: item.name,
      region: item.region,
      contractStatus: contractLabel,
      phone: item.phone,
      membershipType: membershipLabel,
      caddies: item.total_caddies,
      fields: item.field_count,
    };
  });

  return (
    <RoleGuard requiredRoles={["MASTER", "ADMIN"]}>
      <div className="bg-white rounded-xl p-8 space-y-6">
        {/* 제목 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">골프장 리스트</h2>
        </div>

        {/* 액션바 */}
        <div className="flex items-center justify-between">
          {/* 왼쪽: 총 건수 */}
          <div className="text-base font-bold text-gray-900">
            총 {data?.count ?? 0}건
          </div>

          {/* 오른쪽: 필터 및 액션 버튼들 */}
          <div className="flex items-center gap-8">
            {/* 필터 드롭다운들 */}
            <div className="flex items-center gap-2">
              <Dropdown
                options={contractOptions}
                value={contractValue}
                onChange={(value) => handleDropdownChange("contract", value)}
                placeholder="계약상태"
                containerClassName="w-[106px]"
                disabled={loadingOptions}
              />
              <Dropdown
                options={FIELD_COUNT_OPTIONS}
                value={fieldCountValue}
                onChange={(value) => handleDropdownChange("field_count", value)}
                placeholder="필드수"
                containerClassName="w-[106px]"
              />
              <Dropdown
                options={membershipOptions}
                value={membershipValue}
                onChange={(value) =>
                  handleDropdownChange("membership_type", value)
                }
                placeholder="회원제 구분"
                containerClassName="w-[106px]"
                disabled={loadingOptions}
              />
              <Dropdown
                options={isActiveOptions}
                value={isActiveValue}
                onChange={(value) => handleDropdownChange("isActive", value)}
                placeholder="활성화 여부"
                containerClassName="w-[106px]"
                disabled={loadingOptions}
              />
            </div>

            {/* 검색 및 버튼 그룹 */}
            <div className="flex items-center gap-4">
              <SearchWithButton placeholder="검색어 입력" />

              {/* 삭제 버튼 */}
              <Button
                variant="secondary"
                size="md"
                onClick={handleDeleteSelected}
                disabled={selectedRowKeys.length === 0 || isDeleting}
                className="w-24"
              >
                삭제
              </Button>

              {/* 생성 버튼 */}
              <Button
                variant="primary"
                size="md"
                className="w-24"
                onClick={handleCreateClick}
                icon={<Plus size={24} />}
              >
                생성
              </Button>
            </div>
          </div>
        </div>

        {/* 테이블 또는 빈 상태 */}
        {hasNoResults ? (
          <div className="space-y-4">
            {/* 테이블 헤더 */}
            <div className="bg-gray-50 rounded-t-md border border-gray-200 p-4">
              <div className="flex items-center gap-8">
                <div className="w-12 text-center">
                  <span className="text-sm font-bold text-gray-600">No.</span>
                </div>
                <div className="w-48">
                  <span className="text-sm font-bold text-gray-600">
                    골프장명
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm font-bold text-gray-600">시/구</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm font-bold text-gray-600">
                    계약 현황
                  </span>
                </div>
                <div className="w-36 text-center">
                  <span className="text-sm font-bold text-gray-600">
                    대표 번호
                  </span>
                </div>
                <div className="w-32 text-center">
                  <span className="text-sm font-bold text-gray-600">
                    회원제/퍼블릭
                  </span>
                </div>
                <div className="w-20 text-center">
                  <span className="text-sm font-bold text-gray-600">캐디</span>
                </div>
                <div className="w-20 text-center">
                  <span className="text-sm font-bold text-gray-600">필드</span>
                </div>
              </div>
            </div>

            {/* 빈 상태 */}
            <EmptyState className="rounded-t-none border-t-0" />
          </div>
        ) : (
          <div className="space-y-6">
            <SelectableDataTable
              columns={GOLF_COURSE_TABLE_COLUMNS}
              data={tableData}
              onRowClick={handleRowClick}
              selectedRowKeys={selectedRowKeys}
              onSelectChange={handleUpdateSelection}
              selectable
              layout="flexible"
              className="w-full"
            />

            <Pagination totalPages={data?.total_pages ?? 1} />
          </div>
        )}

        {/* 삭제 확인 모달 */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="골프장 삭제"
          message={`선택한 ${selectedRowKeys.length}개의 골프장을 삭제하시겠습니까?`}
          confirmText="삭제"
          isLoading={isDeleting}
        />
      </div>
    </RoleGuard>
  );
};

export default GolfCoursesPage;
