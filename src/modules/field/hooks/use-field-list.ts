import { useQuery } from "@tanstack/react-query";
import { fetchFields } from "../api/field-api";
import { FieldListResponse } from "../types";

export const useFieldList = (page: number, searchTerm: string) => {
  return useQuery<FieldListResponse, Error>({
    queryKey: ["fields", page, searchTerm],
    queryFn: () => fetchFields({ page, searchTerm }),
    staleTime: 0, // 항상 네트워크에서 가져옴
  });
};
