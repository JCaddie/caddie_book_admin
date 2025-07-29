// API ↔ 도메인 모델 데이터 변환 함수들

import type {
  EditableGolfCourse,
  GolfCourseApiResponse,
  GolfCourseDetail,
} from "../types";

import type {
  ContactInfo,
  GolfCourseDomain,
  GolfCourseOperationStats,
} from "../types/domain";

import type { GolfCourse } from "../types/ui";

/**
 * API 응답을 UI 테이블용 모델로 변환
 */
export const transformApiResponseToTableItem = (
  apiResponse: GolfCourseApiResponse,
  index: number,
  page: number = 1,
  pageSize: number = 20
): GolfCourse => {
  return {
    id: apiResponse.id,
    no: (page - 1) * pageSize + index + 1,
    name: apiResponse.name,
    region: apiResponse.region,
    contractStatus: apiResponse.contract_status,
    phone: apiResponse.phone,
    membershipType: apiResponse.membership_type,
    caddies: apiResponse.total_caddies,
    fields: apiResponse.field_count,
  };
};

/**
 * API 상세 응답을 도메인 모델로 변환
 */
export const transformDetailApiToDomain = (
  detail: GolfCourseDetail
): GolfCourseDomain => {
  const representative: ContactInfo = {
    name: detail.ceo_name || "",
    contact: "",
    email: "",
  };

  const manager: ContactInfo = {
    name: detail.manager_name || "",
    contact: detail.manager_contact || "",
    email: detail.manager_email || "",
  };

  const operationStats: GolfCourseOperationStats = {
    totalCaddies: detail.total_caddies,
    fieldCount: detail.field_count,
    cartCount: detail.cart_count,
    managerCount: detail.manager_count,
    workCount: detail.work_count,
  };

  return {
    id: detail.id,
    name: detail.name,
    region: detail.region,
    address: detail.address,
    phone: detail.phone,
    contractStatus: detail.contract_status,
    membershipType: detail.membership_type,
    contractStartDate: detail.contract_start_date,
    contractEndDate: detail.contract_end_date,
    representative,
    manager,
    operationStats,
    isActive: detail.is_active,
    createdAt: detail.created_at,
    updatedAt: detail.updated_at,
  };
};

/**
 * EditableGolfCourse를 API 요청 형태로 변환
 */
export const transformEditableToApiRequest = (formData: EditableGolfCourse) => {
  return {
    name: formData.name,
    region: formData.region,
    address: formData.address,
    contract_status: formData.contractStatus,
    membership_type: formData.membershipType,
    phone: formData.phone,
    is_active: formData.isActive,
    ceo_name: formData.representative.name,
    manager_name: formData.manager.name,
    manager_contact: formData.manager.contact,
    manager_email: formData.manager.email,
  };
};

/**
 * API 상세 응답을 EditableGolfCourse로 변환
 */
export const transformDetailToEditable = (
  detail: GolfCourseDetail
): EditableGolfCourse => {
  return {
    id: detail.id,
    name: detail.name,
    region: detail.region,
    address: detail.address,
    contractStatus: detail.contract_status,
    membershipType: detail.membership_type,
    phone: detail.phone,
    isActive: detail.is_active,
    representative: {
      name: detail.ceo_name || "",
      contact: "",
      email: "",
    },
    manager: {
      name: detail.manager_name || "",
      contact: detail.manager_contact || "",
      email: detail.manager_email || "",
    },
  };
};

/**
 * 필터 객체를 API 쿼리 파라미터로 변환
 */
export const transformFiltersToParams = (filters: {
  search?: string;
  contract?: string;
  membership_type?: string;
  isActive?: string;
  page?: number;
}) => {
  const params: Record<string, string | number | undefined> = {};

  if (filters.search) params.search = filters.search;
  if (filters.contract) params.contract_status = filters.contract;
  if (filters.membership_type) params.membership_type = filters.membership_type;
  if (filters.isActive) params.is_active = filters.isActive;
  if (filters.page) params.page = filters.page;

  return params;
};

/**
 * 날짜 문자열을 로컬 형식으로 변환
 */
export const formatDateToLocal = (dateString: string | null): string => {
  if (!dateString) return "-";

  try {
    return new Date(dateString).toLocaleDateString("ko-KR");
  } catch {
    return "-";
  }
};

/**
 * 숫자를 로컬 형식으로 변환
 */
export const formatNumberToLocal = (num: number): string => {
  return new Intl.NumberFormat("ko-KR").format(num);
};
