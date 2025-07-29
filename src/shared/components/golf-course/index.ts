// 하위 호환성을 위한 re-export (새로운 모듈 컴포넌트 사용)
export {
  GolfCourseInfo,
  GolfCourseForm,
  EditableGolfCourseInfo,
  OperationCards,
} from "@/modules/golf-course/components";

// 타입도 함께 export
export type {
  GolfCourseFormProps,
  OperationCard,
} from "@/modules/golf-course/components";
