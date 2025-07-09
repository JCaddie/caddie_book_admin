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
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
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

export default useWorksSelection;
