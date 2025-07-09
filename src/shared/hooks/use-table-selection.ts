"use client";

import { useState, useEffect, useMemo } from "react";
import { UseTableSelectionReturn } from "@/shared/types/table";
import { isEmptyRow } from "@/shared/components/ui/base-table";

interface UseTableSelectionProps<T> {
  data: T[];
  extractRowKey: (record: T) => string;
  selectedRowKeys?: string[];
  onSelectChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
}

export function useTableSelection<T extends Record<string, unknown>>({
  data,
  extractRowKey,
  selectedRowKeys = [],
  onSelectChange,
}: UseTableSelectionProps<T>): UseTableSelectionReturn<T> {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(
    []
  );

  // 외부에서 전달된 selectedRowKeys가 있으면 사용, 없으면 내부 상태 사용
  const currentSelectedKeys =
    selectedRowKeys.length > 0 ? selectedRowKeys : internalSelectedKeys;

  // 빈 행이 아닌 실제 데이터만 필터링
  const realData = useMemo(() => {
    return data.filter((record) => !isEmptyRow(record));
  }, [data]);

  // 선택된 행 데이터 계산
  const selectedRows = useMemo(() => {
    return realData.filter((item) =>
      currentSelectedKeys.includes(extractRowKey(item))
    );
  }, [realData, currentSelectedKeys, extractRowKey]);

  // 전체 선택 상태 계산
  const isAllSelected = useMemo(() => {
    return (
      realData.length > 0 && currentSelectedKeys.length === realData.length
    );
  }, [realData.length, currentSelectedKeys.length]);

  // 부분 선택 상태 계산
  const isIndeterminate = useMemo(() => {
    return (
      currentSelectedKeys.length > 0 &&
      currentSelectedKeys.length < realData.length
    );
  }, [currentSelectedKeys.length, realData.length]);

  // 외부 selectedRowKeys 변경 시 내부 상태 초기화
  useEffect(() => {
    if (selectedRowKeys.length === 0) {
      setInternalSelectedKeys([]);
    }
  }, [selectedRowKeys]);

  // 개별 행 선택/해제
  const handleRowSelect = (record: T, checked: boolean) => {
    const key = extractRowKey(record);
    let newSelectedKeys: string[];

    if (checked) {
      newSelectedKeys = [...currentSelectedKeys, key];
    } else {
      newSelectedKeys = currentSelectedKeys.filter((k) => k !== key);
    }

    // 외부 selectedRowKeys가 없으면 내부 상태 업데이트
    if (selectedRowKeys.length === 0) {
      setInternalSelectedKeys(newSelectedKeys);
    }

    // 선택된 행 데이터 계산
    const newSelectedRows = realData.filter((item) =>
      newSelectedKeys.includes(extractRowKey(item))
    );

    // 외부 콜백 호출
    onSelectChange?.(newSelectedKeys, newSelectedRows);
  };

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    let newSelectedKeys: string[];

    if (checked) {
      newSelectedKeys = realData.map((record) => extractRowKey(record));
    } else {
      newSelectedKeys = [];
    }

    // 외부 selectedRowKeys가 없으면 내부 상태 업데이트
    if (selectedRowKeys.length === 0) {
      setInternalSelectedKeys(newSelectedKeys);
    }

    // 선택된 행 데이터 계산
    const newSelectedRows = checked ? [...realData] : [];

    // 외부 콜백 호출
    onSelectChange?.(newSelectedKeys, newSelectedRows);
  };

  // 선택 상태 초기화
  const clearSelection = () => {
    const newSelectedKeys: string[] = [];

    if (selectedRowKeys.length === 0) {
      setInternalSelectedKeys(newSelectedKeys);
    }

    onSelectChange?.(newSelectedKeys, []);
  };

  return {
    selectedRowKeys: currentSelectedKeys,
    selectedRows,
    isAllSelected,
    isIndeterminate,
    handleRowSelect,
    handleSelectAll,
    clearSelection,
  };
}
