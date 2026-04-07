import { canManageTeam } from "@/lib/permissions";
import { getOrgContext } from "@/lib/org-context";
import { RoleSelect } from "./role-select";

export default async function TeamPage() {
  const ctx = await getOrgContext();
  let members: {
    id: string;
    full_name: string | null;
    email: string | null;
    role: string;
    created_at: string;
  }[] = [];

  if (!ctx.bypass) {
    const { data } = await ctx.supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .eq("organization_id", ctx.orgId)
      .order("created_at", { ascending: true });
    members = (data ?? []) as typeof members;
  } else {
    members = [
      {
        id: ctx.profile.id,
        full_name: ctx.profile.full_name,
        email: ctx.profile.email,
        role: ctx.profile.role,
        created_at: ctx.profile.created_at,
      },
    ];
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Team</h1>
        <p className="mt-1 text-sm text-muted">
          Admin, trainer, and assistant roles with session and finance permissions.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-sidebar text-xs font-medium uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">
                    {m.full_name || m.email || m.id.slice(0, 8)}
                  </p>
                  {m.email ? <p className="text-xs text-muted">{m.email}</p> : null}
                </td>
                <td className="px-4 py-3">
                  {ctx.bypass ? (
                    <span className="capitalize text-muted">{m.role}</span>
                  ) : canManageTeam(ctx.profile.role) && m.id !== ctx.profile.id ? (
                    <RoleSelect memberId={m.id} currentRole={m.role as "admin" | "trainer" | "assistant"} />
                  ) : (
                    <span className="capitalize text-muted">{m.role}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted">
        Invite teammates from Supabase Auth (email invite) or add an API route using{" "}
        <code className="rounded bg-sidebar px-1 text-xs">inviteUserByEmail</code> with the
        service role, then attach{" "}
        <code className="rounded bg-sidebar px-1 text-xs">organization_id</code> on first login.
      </p>
    </div>
  );
}
