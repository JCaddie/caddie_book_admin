// ================================
// 팀 관리 모듈 - 컴포넌트 익스포트
// ================================

export { default as TeamCard } from "./team-card";
export { default as TeamSchedule } from "./team-schedule";
export { default as TeamStatus } from "./team-status";
export { default as TeamSettingModal } from "./team-setting-modal";

// 설정 관련 export
export * from "./team-setting-config";

// ================================
// 하위 호환성을 위한 컴포넌트 alias
// ================================

/** @deprecated Use TeamCard instead */
export { default as SpecialTeamCard } from "./team-card";

/** @deprecated Use TeamSchedule instead */
export { default as SpecialTeamSchedule } from "./team-schedule";

/** @deprecated Use TeamStatus instead */
export { default as SpecialTeamStatus } from "./team-status";

/** @deprecated Use TeamSettingModal instead */
export { default as SpecialTeamSettingModal } from "./team-setting-modal";
