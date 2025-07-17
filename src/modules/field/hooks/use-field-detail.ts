import { useQuery } from "@tanstack/react-query";
import { fetchFieldDetail } from "../api/field-api";
import { FieldData } from "../types";

export const useFieldDetail = (id: string) => {
  return useQuery<FieldData, Error>({
    queryKey: ["field", id],
    queryFn: () => fetchFieldDetail(id),
    enabled: !!id,
    staleTime: 0,
  });
};
