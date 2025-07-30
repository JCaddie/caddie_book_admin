import { useQuery } from "@tanstack/react-query";
import { fetchFieldDetail } from "../api/field-api";
import { Field, FieldDetailApiResponse } from "../types";

export const useFieldDetail = (id: string) => {
  return useQuery<Field, Error>({
    queryKey: ["field", id],
    queryFn: async () => {
      const response = await fetchFieldDetail(id);
      return response.data; // API 응답의 data 필드에서 Field 데이터 추출
    },
    enabled: !!id,
    staleTime: 0,
  });
};
