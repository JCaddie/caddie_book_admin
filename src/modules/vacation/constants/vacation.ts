import { VacationRequestType, VacationStatus, VacationRequest } from "../types";
import { Column } from "@/shared/types/table";

export const VACATION_REQUEST_TYPES: VacationRequestType[] = ["휴무", "대기"];

export const VACATION_STATUSES: VacationStatus[] = ["검토 중", "승인", "반려"];

export const VACATION_REQUEST_TYPE_OPTIONS = [
  { value: "", label: "신청구분" },
  { value: "휴무", label: "휴무" },
  { value: "대기", label: "대기" },
];

export const VACATION_STATUS_OPTIONS = [
  { value: "", label: "상태" },
  { value: "검토 중", label: "검토 중" },
  { value: "승인", label: "승인" },
  { value: "반려", label: "반려" },
];

// DataTable용 컬럼 정의
export const VACATION_TABLE_COLUMNS: Column<VacationRequest>[] = [
  {
    key: "requestType",
    title: "신청구분",
    width: 120,
    align: "center",
  },
  {
    key: "caddieName",
    title: "이름",
    width: 160,
    align: "center",
  },
  {
    key: "reason",
    title: "사유",
    width: 360,
    align: "left",
  },
  {
    key: "phone",
    title: "연락처",
    width: 140,
    align: "center",
  },
  {
    key: "status",
    title: "상태",
    width: 100,
    align: "center",
  },
  {
    key: "approver",
    title: "승인자",
    width: 120,
    align: "center",
    render: (value: unknown) => String(value || "-"),
  },
  {
    key: "requestDate",
    title: "요청일자",
    width: 140,
    align: "center",
  },
  {
    key: "actions",
    title: "",
    width: 100,
    align: "center",
  },
];

export const VACATION_SEARCH_PLACEHOLDER = "캐디 검색";

export const VACATION_REQUEST_COUNT_LABEL = "요청";
