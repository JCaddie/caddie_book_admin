import { useCallback, useState } from "react";
import { Cart, CartSelection } from "../types";

/**
 * 카트 선택 상태 관리 훅
 */
export const useCartSelection = () => {
  const [selection, setSelection] = useState<CartSelection>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  const updateSelection = useCallback(
    (selectedRowKeys: string[], selectedRows: Cart[]) => {
      // 빈 행은 선택에서 제외
      const validSelectedRows = selectedRows.filter(
        (row) => row.id && !row.isEmpty
      );
      const validSelectedRowKeys = validSelectedRows.map((row) => row.id);

      setSelection({
        selectedRowKeys: validSelectedRowKeys,
        selectedRows: validSelectedRows,
      });
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelection({ selectedRowKeys: [], selectedRows: [] });
  }, []);

  return {
    selection,
    updateSelection,
    clearSelection,
  };
};
