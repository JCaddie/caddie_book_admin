import { useQuery } from "@tanstack/react-query";
import { fetchFieldDetail } from "../api/field-api";
import { Field } from "../types";

export const useFieldDetail = (id: string) => {
  return useQuery<Field, Error>({
    queryKey: ["field", id],
    queryFn: () => fetchFieldDetail(id),
    enabled: !!id,
    staleTime: 0,
  });
};
