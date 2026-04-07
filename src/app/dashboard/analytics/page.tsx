import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/format";
import { AnalyticsCharts } from "./analytics-charts";

export default async function AnalyticsPage() {
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

  const [{ data: dogs }, { data: sessions }, { data: payments }] = await Promise.all([
    supabase.from("dogs").select("breed, behavioral_problems").eq("organization_id", orgId),
    supabase
      .from("training_sessions")
      .select("status, trainer_id, profiles!training_sessions_trainer_id_fkey(full_name)")
      .eq("organization_id", orgId),
    supabase
      .from("payments")
      .select("amount_cents, status, paid_at, created_at")
      .eq("organization_id", orgId),
  ]);

  const breedCounts = new Map<string, number>();
  for (const d of dogs ?? []) {
    const b = (d.breed || "Unknown").trim() || "Unknown";
    breedCounts.set(b, (breedCounts.get(b) ?? 0) + 1);
  }
  const breedData = [...breedCounts.entries()]
    .map(([breed, count]) => ({ breed, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const problemCounts = new Map<string, number>();
  for (const d of dogs ?? []) {
    const raw = d.behavioral_problems?.trim();
    if (!raw) continue;
    for (const part of raw
      .split(/[,;]/)
      .map((s: string) => s.trim())
      .filter(Boolean)) {
      problemCounts.set(part, (problemCounts.get(part) ?? 0) + 1);
    }
  }
  const problemData = [...problemCounts.entries()]
    .map(([problem, count]) => ({ problem, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const statusCounts: Record<string, number> = {};
  for (const s of sessions ?? []) {
    statusCounts[s.status] = (statusCounts[s.status] ?? 0) + 1;
  }
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    status: status.replace("_", " "),
    count,
  }));

  const trainerCompleted = new Map<string, number>();
  for (const s of sessions ?? []) {
    if (s.status !== "completed") continue;
    const row = s as typeof s & {
      profiles: { full_name: string | null } | null;
    };
    const name = row.profiles?.full_name || "Trainer";
    trainerCompleted.set(name, (trainerCompleted.get(name) ?? 0) + 1);
  }
  const trainerData = [...trainerCompleted.entries()]
    .map(([name, sessions_completed]) => ({ name, sessions_completed }))
    .sort((a, b) => b.sessions_completed - a.sessions_completed)
    .slice(0, 8);

  const monthKeys: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const dt = new Date();
    dt.setMonth(dt.getMonth() - i);
    monthKeys.push(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`);
  }
  const revenueByMonth = new Map<string, number>();
  for (const k of monthKeys) revenueByMonth.set(k, 0);
  for (const p of payments ?? []) {
    if (p.status !== "paid" || !p.paid_at) continue;
    const d = new Date(p.paid_at);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (revenueByMonth.has(k)) {
      revenueByMonth.set(k, (revenueByMonth.get(k) ?? 0) + p.amount_cents);
    }
  }
  const trendData = monthKeys.map((k) => ({
    month: k.slice(5),
    revenue: (revenueByMonth.get(k) ?? 0) / 100,
  }));

  const totalPaid = (payments ?? [])
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount_cents, 0);
  const completed = sessions?.filter((s) => s.status === "completed").length ?? 0;
  const scheduled = sessions?.filter((s) => s.status === "scheduled").length ?? 0;
  const completionRate =
    completed + scheduled > 0
      ? Math.round((completed / (completed + scheduled)) * 100)
      : 0;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted">
          Breeds, behavioral themes, session outcomes, revenue trend, trainer load.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted">Lifetime paid revenue</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{formatMoney(totalPaid)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted">Session completion rate</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{completionRate}%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted">Dogs in CRM</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{dogs?.length ?? 0}</p>
        </div>
      </div>
      <AnalyticsCharts
        trendData={trendData}
        statusData={statusData}
        breedData={breedData}
        trainerData={trainerData}
        problemData={problemData}
      />
    </div>
  );
}
