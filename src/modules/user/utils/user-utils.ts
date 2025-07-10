import { User } from "../types";

export const getUserRowKey = (user: User): string => {
  return user.id;
};

export const isEmptyUser = (user: User): boolean => {
  return !user.id || user.id.startsWith("empty-");
};

export const formatUserRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    master: "마스터",
    admin: "관리자",
    user: "사용자",
  };
  return roleMap[role] || role;
};
