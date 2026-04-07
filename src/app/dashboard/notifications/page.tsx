import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user!.id)
    .single();
  const orgId = profile!.organization_id!;
  const { data: items } = await supabase
    .from("notifications")
    .select("*")
    .eq("organization_id", orgId)
    .or(`user_id.eq.${user!.id},user_id.is.null`)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-muted">
          In-app queue; email and WhatsApp hooks attach via workers reading this table.
        </p>
      </div>
      <ul className="space-y-2">
        {(items ?? []).length === 0 ? (
          <li className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted">
            No notifications yet. Cron reminders will enqueue rows here.
          </li>
        ) : (
          (items ?? []).map((n) => (
            <li
              key={n.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <span className="text-xs text-muted">{formatDateTime(n.created_at)}</span>
              </div>
              {n.body ? <p className="mt-1 text-sm text-muted">{n.body}</p> : null}
              <p className="mt-2 text-xs capitalize text-muted">
                {n.channel} · {n.type}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
