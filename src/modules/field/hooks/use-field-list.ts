import { useQuery } from "@tanstack/react-query";
import { fetchFields } from "../api/field-api";
import { Field } from "../types";

export interface FieldListApiResponse {
  results: Field[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const useFieldList = (page: number, searchTerm: string) => {
  return useQuery<FieldListApiResponse, Error>({
    queryKey: ["fields", page, searchTerm],
    queryFn: () => fetchFields({ page, searchTerm }),
    staleTime: 0, // 항상 네트워크에서 가져옴
  });
};
