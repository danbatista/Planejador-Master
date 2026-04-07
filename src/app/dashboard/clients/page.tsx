import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ClientSearch } from "./client-search";
import { NewClientForm } from "./new-client-form";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
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
  let query = supabase
    .from("clients")
    .select("id, name, email, phone, created_at")
    .eq("organization_id", orgId)
    .order("name", { ascending: true });
  const term = q?.trim();
  if (term) {
    query = query.or(
      `name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`,
    );
  }
  const { data: clients } = await query;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Clients
          </h1>
          <p className="mt-1 text-sm text-muted">
            CRM for owners and their dogs.
          </p>
        </div>
        <ClientSearch initial={term ?? ""} />
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-sidebar text-xs font-medium uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Contact</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(clients ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted">
                      No clients yet. Add your first on the right.
                    </td>
                  </tr>
                ) : (
                  (clients ?? []).map((c) => (
                    <tr key={c.id} className="hover:bg-sidebar/50">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <Link
                          href={`/dashboard/clients/${c.id}`}
                          className="hover:underline"
                        >
                          {c.name}
                        </Link>
                      </td>
                      <td className="hidden px-4 py-3 text-muted sm:table-cell">
                        {c.email || c.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/dashboard/clients/${c.id}`}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <NewClientForm />
        </div>
      </div>
    </div>
  );
}
