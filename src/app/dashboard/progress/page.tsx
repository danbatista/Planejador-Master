import { getOrgContext } from "@/lib/org-context";
import Link from "next/link";

export default async function ProgressHubPage() {
  const ctx = await getOrgContext();
  let dogs: { id: string; name: string; breed: string | null; clients: { name: string } | null }[] =
    [];

  if (!ctx.bypass) {
    const { data } = await ctx.supabase
      .from("dogs")
      .select("id, name, breed, clients(name)")
      .eq("organization_id", ctx.orgId)
      .order("name");
    dogs = (data ?? []) as unknown as typeof dogs;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Progress tracking
        </h1>
        <p className="mt-1 text-sm text-muted">
          Open a dog to add notes, timeline entries, and export a client PDF.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {dogs.length === 0 ? (
          <li className="rounded-xl border border-border bg-card p-6 text-sm text-muted">
            {ctx.bypass
              ? "Preview mode: add dogs when using Supabase."
              : "Add dogs from a client profile first."}
          </li>
        ) : (
          dogs.map((d) => (
            <li key={d.id}>
              <Link
                href={`/dashboard/dogs/${d.id}`}
                className="block rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/40"
              >
                <p className="font-medium text-foreground">{d.name}</p>
                <p className="text-xs text-muted">
                  {d.clients?.name}
                  {d.breed ? ` · ${d.breed}` : ""}
                </p>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
