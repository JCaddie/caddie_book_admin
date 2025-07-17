import { useEffect, useState } from "react";

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
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/v1/golf-courses/constants/contract_status/`)
      .then((res) => res.json())
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
