import { getOrgContext } from "@/lib/org-context";
import Link from "next/link";
import { ClientSearch } from "./client-search";
import { NewClientForm } from "./new-client-form";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const ctx = await getOrgContext();
  const term = q?.trim();
  let clients: { id: string; name: string; email: string | null; phone: string | null }[] =
    [];

  if (!ctx.bypass) {
    let query = ctx.supabase
      .from("clients")
      .select("id, name, email, phone, created_at")
      .eq("organization_id", ctx.orgId)
      .order("name", { ascending: true });
    if (term) {
      query = query.or(
        `name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`,
      );
    }
    const { data } = await query;
    clients = data ?? [];
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Clientes</h1>
          <p className="mt-1 text-sm text-muted">Cadastro de tutores e seus cães.</p>
        </div>
        <ClientSearch initial={term ?? ""} />
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-sidebar text-xs font-medium uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Contato</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted">
                      {ctx.bypass
                        ? "Modo prévia: sem dados. Formulários desativados."
                        : "Nenhum cliente. Adicione o primeiro ao lado."}
                    </td>
                  </tr>
                ) : (
                  clients.map((c) => (
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
                          Abrir
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
