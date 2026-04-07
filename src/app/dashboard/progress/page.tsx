import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProgressHubPage() {
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
    .select("id, name, breed, clients(name)")
    .eq("organization_id", orgId)
    .order("name");

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
        {(dogs ?? []).length === 0 ? (
          <li className="rounded-xl border border-border bg-card p-6 text-sm text-muted">
            Add dogs from a client profile first.
          </li>
        ) : (
          (dogs ?? []).map((d) => {
            const row = d as typeof d & { clients: { name: string } | null };
            return (
              <li key={d.id}>
                <Link
                  href={`/dashboard/dogs/${d.id}`}
                  className="block rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/40"
                >
                  <p className="font-medium text-foreground">{d.name}</p>
                  <p className="text-xs text-muted">
                    {row.clients?.name}
                    {d.breed ? ` · ${d.breed}` : ""}
                  </p>
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
