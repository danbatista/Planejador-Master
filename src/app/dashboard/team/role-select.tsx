"use client";

import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrador" },
  { value: "trainer", label: "Adestrador" },
  { value: "assistant", label: "Assistente" },
];

export function RoleSelect({
  memberId,
  currentRole,
}: {
  memberId: string;
  currentRole: UserRole;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [role, setRole] = useState(currentRole);
  const [pending, setPending] = useState(false);

  async function onChange(v: UserRole) {
    setRole(v);
    setPending(true);
    const { error } = await supabase
      .from("profiles")
      .update({ role: v, updated_at: new Date().toISOString() })
      .eq("id", memberId);
    setPending(false);
    if (!error) router.refresh();
  }

  return (
    <select
      value={role}
      disabled={pending}
      onChange={(e) => onChange(e.target.value as UserRole)}
      className="rounded-lg border border-border bg-background px-2 py-1 text-sm"
    >
      {ROLES.map((r) => (
        <option key={r.value} value={r.value}>
          {r.label}
        </option>
      ))}
    </select>
  );
}
