import { getOrgContext } from "@/lib/org-context";
import Link from "next/link";

export default async function ReportsPage() {
  const ctx = await getOrgContext();
  let dogs: { id: string; name: string; clients: { name: string } | null }[] = [];
  let generated: {
    id: string;
    dog_id: string;
    report_type: string;
    created_at: string;
    dogs: { name: string } | null;
  }[] = [];

  if (!ctx.bypass) {
    const supabase = ctx.supabase;
    const orgId = ctx.orgId;
    const [{ data: d }, { data: g }] = await Promise.all([
      supabase
        .from("dogs")
        .select("id, name, clients(name)")
        .eq("organization_id", orgId)
        .order("name")
        .limit(30),
      supabase
        .from("generated_reports")
        .select("id, dog_id, report_type, created_at, dogs(name)")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    dogs = (d ?? []) as unknown as typeof dogs;
    generated = (g ?? []) as unknown as typeof generated;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reports</h1>
        <p className="mt-1 text-sm text-muted">
          Client-facing PDFs bundle profile, progress, goals, and notes.
        </p>
      </div>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Export by dog</h2>
        {dogs.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            {ctx.bypass ? "Preview mode: no dogs." : "No dogs yet."}
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {dogs.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-2">
                <span className="text-sm text-foreground">
                  {d.name}
                  <span className="text-muted"> · {d.clients?.name}</span>
                </span>
                <Link
                  href={`/api/reports/dog/${d.id}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Download PDF
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Recent exports</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {generated.length === 0 ? (
            <li>{ctx.bypass ? "Preview mode." : "None yet."}</li>
          ) : (
            generated.map((g) => (
              <li key={g.id}>
                {g.dogs?.name ?? "Dog"} · {g.report_type} ·{" "}
                {new Date(g.created_at).toLocaleString()}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
