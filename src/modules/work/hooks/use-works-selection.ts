import { useState } from "react";
import { Work } from "@/modules/work/types";

export interface UseWorksSelectionReturn {
  selectedRowKeys: string[];
  selectedRows: Work[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Work[]>>;
  handleSelectChange: (selectedRowKeys: string[], selectedRows: Work[]) => void;
  clearSelection: () => void;
}

const useWorksSelection = (): UseWorksSelectionReturn => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<Work[]>([]);

  // 선택 변경 핸들러
  const handleSelectChange = (
    newSelectedRowKeys: string[],
    newSelectedRows: Work[]
  ) => {
    // 빈 행은 선택에서 제외
    const validSelectedRows = newSelectedRows.filter(
      (row) => row.id && !row.isEmpty
    );
    const validSelectedRowKeys = validSelectedRows.map((row) => row.id);

    setSelectedRowKeys(validSelectedRowKeys);
    setSelectedRows(validSelectedRows);
  };

  // 선택 초기화
  const clearSelection = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  return {
    selectedRowKeys,
    selectedRows,
    setSelectedRowKeys,
    setSelectedRows,
    handleSelectChange,
    clearSelection,
  };
};
export { useWorksSelection };
