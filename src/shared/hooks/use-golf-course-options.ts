import { useEffect, useState } from "react";
import { apiClient } from "@/shared/lib/api-client";

export interface Option {
  label: string;
  value: string;
  rawId?: string;
}

interface OptionApiResponse {
  id: string | number | boolean;
  value: string;
}

export function useGolfCourseOptions() {
  const [contractOptions, setContractOptions] = useState<Option[]>([
    { label: "계약현황", value: "" },
  ]);
  const [membershipOptions, setMembershipOptions] = useState<Option[]>([
    { label: "종류", value: "" },
  ]);
  const [isActiveOptions, setIsActiveOptions] = useState<Option[]>([
    { label: "활성 여부", value: "" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiClient.get<OptionApiResponse[]>(
        "/api/v1/golf-courses/constants/contract_status/"
      ),
      apiClient.get<OptionApiResponse[]>(
        "/api/v1/golf-courses/constants/membership_type/"
      ),
      apiClient.get<OptionApiResponse[]>(
        "/api/v1/golf-courses/constants/is_active/"
      ),
    ])
      .then(
        ([contract, membership, isActive]: [
          OptionApiResponse[],
          OptionApiResponse[],
          OptionApiResponse[]
        ]) => {
          setContractOptions([
            { label: "계약현황", value: "" },
            ...contract.map((opt) => ({
              label: opt.value,
              value: String(opt.id),
              rawId: String(opt.id),
            })),
          ]);
          setMembershipOptions([
            { label: "종류", value: "" },
            ...membership.map((opt) => ({
              label: opt.value,
              value: String(opt.id),
              rawId: String(opt.id),
            })),
          ]);
          setIsActiveOptions([
            { label: "활성 여부", value: "" },
            ...isActive.map((opt) => ({
              label: opt.value,
              value: String(opt.id),
            })),
          ]);
        }
      )
      .finally(() => setLoading(false));
  }, []);

  return { contractOptions, membershipOptions, isActiveOptions, loading };
}
