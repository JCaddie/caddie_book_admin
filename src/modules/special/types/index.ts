// ================================
// 특수반 관리 타입 (통합 설계 기반)
// ================================

// 공통 타입 import
export type {
  BaseGroup,
  CreateGroupRequest,
  GroupListParams,
  SpecialGroup,
} from "@/shared/types";

import type { GroupType } from "@/shared/types";

// Special 모듈 전용 확장 타입
export interface SpecialGroupUI {
  // BaseGroup으로부터 상속
  id: string;
  name: string;
  group_type: GroupType;
  golf_course_id: string;
  golf_course_name?: string;
  is_active: boolean;
  order?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
  isEmpty?: boolean;

  // SpecialGroup으로부터 상속
  color?: string;
  member_count?: number;

  // UI 전용 속성들
  isActive: boolean; // 기존 is_active와 호환성을 위한 별칭
}

// 사용되지 않는 타입들 제거됨
// 필요시 개별 컴포넌트에서 직접 정의하여 사용

// ================================
// 페이지 및 컴포넌트 Props 타입
// ================================

// 특수반 상세 페이지 Props
export interface SpecialGroupDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 실제 사용되는 Props 타입들만 유지

// 특수반 설정 모달 Props
export interface SpecialGroupSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groups: SpecialGroupUI[]) => void;
  initialGroups?: SpecialGroupUI[];
  isLoading?: boolean;
}

// 특수반 생성 모달 Props
export interface SpecialGroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  golfCourseId: string;
  golfCourseName?: string;
}

// 특수반 삭제 모달 Props
export interface SpecialGroupDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName: string;
  isLoading?: boolean;
}
