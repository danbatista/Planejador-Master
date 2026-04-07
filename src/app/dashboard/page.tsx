import { formatDateTime, formatMoney } from "@/lib/format";
import { getOrgContext } from "@/lib/org-context";
import Link from "next/link";
import { Calendar, Dog, DollarSign, Users } from "lucide-react";

export default async function DashboardPage() {
  const ctx = await getOrgContext();
  if (ctx.bypass) {
    const stats = [
      { label: "Clients", value: 0, href: "/dashboard/clients", icon: Users },
      { label: "Dogs", value: 0, href: "/dashboard/clients", icon: Dog },
      { label: "Today's sessions", value: 0, href: "/dashboard/calendar", icon: Calendar },
      { label: "Month revenue", value: formatMoney(0), href: "/dashboard/finance", icon: DollarSign },
    ];
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Snapshot of your training business today.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted">{s.label}</span>
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">{s.value}</p>
            </Link>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Upcoming sessions</h2>
            <p className="mt-4 text-sm text-muted">No upcoming sessions.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Alerts</h2>
            <p className="mt-4 text-sm text-muted">0 pending or overdue payments</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
          <p className="mt-4 text-sm text-muted">No activity yet.</p>
        </div>
      </div>
    );
  }

  const supabase = ctx.supabase;
  const orgId = ctx.orgId;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    clientsCount,
    dogsCount,
    todaySessions,
    monthPayments,
    pendingPayments,
    upcoming,
    recentActivity,
  ] = await Promise.all([
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId),
    supabase
      .from("dogs")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId),
    supabase
      .from("training_sessions")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("status", "scheduled")
      .gte("start_at", startOfDay.toISOString())
      .lt("start_at", endOfDay.toISOString()),
    supabase
      .from("payments")
      .select("amount_cents")
      .eq("organization_id", orgId)
      .eq("status", "paid")
      .not("paid_at", "is", null)
      .gte("paid_at", monthStart.toISOString()),
    supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .in("status", ["pending", "overdue"]),
    supabase
      .from("training_sessions")
      .select(
        `
        id,
        start_at,
        end_at,
        title,
        client:clients (name),
        dog:dogs (name),
        trainer:profiles!training_sessions_trainer_id_fkey (full_name)
      `,
      )
      .eq("organization_id", orgId)
      .eq("status", "scheduled")
      .gte("start_at", new Date().toISOString())
      .order("start_at", { ascending: true })
      .limit(6),
    supabase
      .from("activity_log")
      .select("id, action, entity_type, created_at")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const monthRevenue =
    monthPayments.data?.reduce((s, p) => s + (p.amount_cents || 0), 0) ?? 0;

  const stats = [
    {
      label: "Clients",
      value: clientsCount.count ?? 0,
      href: "/dashboard/clients",
      icon: Users,
    },
    {
      label: "Dogs",
      value: dogsCount.count ?? 0,
      href: "/dashboard/clients",
      icon: Dog,
    },
    {
      label: "Today's sessions",
      value: todaySessions.count ?? 0,
      href: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      label: "Month revenue",
      value: formatMoney(monthRevenue),
      href: "/dashboard/finance",
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Snapshot of your training business today.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">{s.value}</p>
          </Link>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Upcoming sessions</h2>
            <Link
              href="/dashboard/calendar"
              className="text-xs font-medium text-primary hover:underline"
            >
              Open calendar
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {(upcoming.data ?? []).length === 0 ? (
              <li className="text-sm text-muted">No upcoming sessions.</li>
            ) : (
              (upcoming.data ?? []).map((row) => {
                const r = row as unknown as {
                  id: string;
                  start_at: string;
                  end_at: string;
                  title: string | null;
                  client: { name: string } | null;
                  dog: { name: string } | null;
                  trainer: { full_name: string | null } | null;
                };
                return (
                  <li
                    key={r.id}
                    className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {r.title ||
                        `${r.dog?.name ?? "Dog"} · ${r.client?.name ?? "Client"}`}
                    </span>
                    <span className="text-xs text-muted">
                      {formatDateTime(r.start_at)} · {r.trainer?.full_name ?? "Trainer"}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Alerts</h2>
            <Link
              href="/dashboard/finance"
              className="text-xs font-medium text-primary hover:underline"
            >
              Finance
            </Link>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <p className="rounded-lg bg-sidebar px-3 py-2 text-foreground">
              <span className="font-medium">{pendingPayments.count ?? 0}</span> pending or
              overdue payments
            </p>
            <p className="text-muted">
              Enable email reminders in Supabase Auth and schedule{" "}
              <code className="rounded bg-sidebar px-1 text-xs">/api/cron/reminders</code> with
              your host.
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
        <ul className="mt-4 divide-y divide-border">
          {(recentActivity.data ?? []).length === 0 ? (
            <li className="py-3 text-sm text-muted">No activity yet.</li>
          ) : (
            (recentActivity.data ?? []).map((a) => (
              <li key={a.id} className="flex flex-wrap items-baseline gap-2 py-3">
                <span className="text-sm font-medium text-foreground">{a.action}</span>
                {a.entity_type ? (
                  <span className="text-xs text-muted">{a.entity_type}</span>
                ) : null}
                <span className="ml-auto text-xs text-muted">
                  {formatDateTime(a.created_at)}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
