export interface GolfCourse {
  id: string;
  no: number;
  name: string;
  region: string;
  contractStatus: string;
  phone: string;
  membershipType: string;
  caddies: number;
  fields: number;
  isEmpty?: boolean;
}

export interface GolfCourseDetail {
  id: string;
  name: string;
  region: string;
  address: string;
  phone: string;
  ceo_name: string;
  membership_type: string;
  contract_status: string;
  contract_start_date: string;
  contract_end_date: string;
  manager_name: string;
  manager_contact: string;
  manager_email: string;
  total_caddies: number;
  field_count: number;
  cart_count: number;
  manager_count: number;
  work_count: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface GolfCourseListResponse {
  success: boolean;
  message: string;
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: GolfCourse[];
}

export interface GolfCourseFilters {
  contract: string;
  holes: string;
  membershipType: string;
  category: string;
  dailyTeams: string;
}

export interface EditableGolfCourse {
  id: string;
  name: string;
  region: string;
  address: string;
  contractStatus: string;
  contractStartDate: string;
  contractEndDate: string;
  phone: string;
  representative: {
    name: string;
    contact: string;
    email: string;
  };
  manager: {
    name: string;
    contact: string;
    email: string;
  };
}
