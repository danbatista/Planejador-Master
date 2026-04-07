import type { UserRole } from "@/types/database";

export function canManageTeam(role: UserRole) {
  return role === "admin";
}

export function canManageFinance(role: UserRole) {
  return role === "admin" || role === "assistant";
}

export function canDeleteSessions(role: UserRole) {
  return role === "admin" || role === "assistant";
}

export function canAssignAnyTrainer(role: UserRole) {
  return role === "admin" || role === "assistant";
}
