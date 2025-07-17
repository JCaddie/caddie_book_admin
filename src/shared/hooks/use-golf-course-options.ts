import { useEffect, useState } from "react";

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
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    setLoading(true);
    Promise.all([
      fetch(
        `${API_BASE_URL}/api/v1/golf-courses/constants/contract_status/`
      ).then((res) => res.json()),
      fetch(
        `${API_BASE_URL}/api/v1/golf-courses/constants/membership_type/`
      ).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/v1/golf-courses/constants/is_active/`).then(
        (res) => res.json()
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
