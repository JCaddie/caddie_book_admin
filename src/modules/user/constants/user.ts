export const USER_ROLES = {
  MASTER: "master",
  ADMIN: "admin",
  USER: "user",
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.MASTER]: "마스터",
  [USER_ROLES.ADMIN]: "관리자",
  [USER_ROLES.USER]: "사용자",
} as const;
