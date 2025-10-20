import { useEffect, useState } from "react";
import { apiClient } from "@/shared/lib/api-client";

export interface ContractStatusOption {
  label: string;
  value: string;
  rawId?: string;
}

interface ContractStatusApiResponse {
  id: string | number;
  value: string;
}

export function useContractStatusOptions() {
  const [options, setOptions] = useState<ContractStatusOption[]>([
    { label: "계약현황", value: "" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get<ContractStatusApiResponse[]>(
        "/v1/golf-courses/constants/contract_status/"
      )
      .then((data: ContractStatusApiResponse[]) => {
        setOptions([
          { label: "계약현황", value: "" },
          ...data.map((opt) => ({
            label: opt.value,
            value: String(opt.id),
            rawId: String(opt.id),
          })),
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { options, loading };
}
