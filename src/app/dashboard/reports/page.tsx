import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ReportsPage() {
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
  const { data: dogs } = await supabase
    .from("dogs")
    .select("id, name, clients(name)")
    .eq("organization_id", orgId)
    .order("name")
    .limit(30);
  const { data: generated } = await supabase
    .from("generated_reports")
    .select("id, dog_id, report_type, created_at, dogs(name)")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Reports
        </h1>
        <p className="mt-1 text-sm text-muted">
          Client-facing PDFs bundle profile, progress, goals, and notes.
        </p>
      </div>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Export by dog</h2>
        <ul className="mt-4 space-y-2">
          {(dogs ?? []).map((d) => {
            const row = d as typeof d & { clients: { name: string } | null };
            return (
              <li key={d.id} className="flex items-center justify-between gap-2">
                <span className="text-sm text-foreground">
                  {d.name}
                  <span className="text-muted"> · {row.clients?.name}</span>
                </span>
                <Link
                  href={`/api/reports/dog/${d.id}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Download PDF
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Recent exports</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {(generated ?? []).length === 0 ? (
            <li>None yet.</li>
          ) : (
            (generated ?? []).map((g) => {
              const row = g as typeof g & { dogs: { name: string } | null };
              return (
                <li key={g.id}>
                  {row.dogs?.name ?? "Dog"} · {g.report_type} ·{" "}
                  {new Date(g.created_at).toLocaleString()}
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}
