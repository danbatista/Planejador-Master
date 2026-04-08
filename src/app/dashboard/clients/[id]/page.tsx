import {
  formatDateTime,
  formatMoney,
  paymentMethodPt,
  paymentStatusPt,
  sessionStatusPt,
} from "@/lib/format";
import { getOrgContext } from "@/lib/org-context";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewDogForm } from "./new-dog-form";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getOrgContext();

  if (ctx.bypass) {
    return (
      <div className="space-y-8">
        <div>
          <Link
            href="/dashboard/clients"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Clientes
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Cliente exemplo
          </h1>
          <p className="mt-1 text-xs text-muted">ID da rota: {id} (somente prévia)</p>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted">
            <span>exemplo@email.com</span>
            <span>(11) 99999-0000</span>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">Cães</h2>
              <p className="mt-4 text-sm text-muted">Nenhum cão na prévia.</p>
            </section>
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">Histórico de aulas</h2>
              <p className="mt-4 text-sm text-muted">Nenhuma aula na prévia.</p>
            </section>
            <div className="grid gap-6 sm:grid-cols-2">
              <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-foreground">Pagamentos</h2>
                <p className="mt-3 text-sm text-muted">Nenhum</p>
              </section>
              <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-foreground">Faturas</h2>
                <p className="mt-3 text-sm text-muted">Nenhuma</p>
              </section>
            </div>
          </div>
          <NewDogForm clientId={id} />
        </div>
      </div>
    );
  }

  const supabase = ctx.supabase;
  const orgId = ctx.orgId;
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("organization_id", orgId)
    .single();
  if (!client) notFound();
  const [{ data: dogs }, { data: sessions }, { data: payments }, { data: invoices }] =
    await Promise.all([
      supabase
        .from("dogs")
        .select("id, name, breed, age_months")
        .eq("client_id", id)
        .order("name"),
      supabase
        .from("training_sessions")
        .select("id, start_at, status, title, dogs(name)")
        .eq("client_id", id)
        .order("start_at", { ascending: false })
        .limit(20),
      supabase
        .from("payments")
        .select("id, amount_cents, method, status, paid_at, created_at")
        .eq("client_id", id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("invoices")
        .select("id, invoice_number, amount_cents, status, due_date, issued_at")
        .eq("client_id", id)
        .order("issued_at", { ascending: false })
        .limit(20),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/clients"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Clientes
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          {client.name}
        </h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted">
          {client.email ? <span>{client.email}</span> : null}
          {client.phone ? <span>{client.phone}</span> : null}
          {client.address ? <span className="w-full">{client.address}</span> : null}
        </div>
        {client.notes ? (
          <p className="mt-4 rounded-lg border border-border bg-sidebar px-4 py-3 text-sm text-foreground">
            {client.notes}
          </p>
        ) : null}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Cães</h2>
            <ul className="mt-4 space-y-2">
              {(dogs ?? []).length === 0 ? (
                <li className="text-sm text-muted">Nenhum cão ainda.</li>
              ) : (
                (dogs ?? []).map((d) => (
                  <li key={d.id}>
                    <Link
                      href={`/dashboard/dogs/${d.id}`}
                      className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm hover:bg-sidebar"
                    >
                      <span className="font-medium text-foreground">{d.name}</span>
                      <span className="text-xs text-muted">
                        {[d.breed, d.age_months != null ? `${d.age_months} meses` : null]
                          .filter(Boolean)
                          .join(" · ") || "Perfil"}
                      </span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </section>
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Histórico de aulas</h2>
            <ul className="mt-4 divide-y divide-border">
              {(sessions ?? []).length === 0 ? (
                <li className="py-3 text-sm text-muted">Nenhuma aula ainda.</li>
              ) : (
                (sessions ?? []).map((s) => {
                  const row = s as unknown as {
                    id: string;
                    start_at: string;
                    status: string;
                    title: string | null;
                    dogs: { name: string } | null;
                  };
                  return (
                    <li key={row.id} className="flex flex-wrap items-center gap-2 py-3">
                      <span className="text-sm font-medium text-foreground">
                        {row.title || row.dogs?.name || "Aula"}
                      </span>
                      <span className="text-xs text-muted">{sessionStatusPt(row.status)}</span>
                      <span className="ml-auto text-xs text-muted">
                        {formatDateTime(row.start_at)}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </section>
          <div className="grid gap-6 sm:grid-cols-2">
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">Pagamentos</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {(payments ?? []).length === 0 ? (
                  <li className="text-muted">Nenhum</li>
                ) : (
                  (payments ?? []).map((p) => (
                    <li key={p.id} className="flex justify-between gap-2">
                      <span className="text-muted">{paymentMethodPt(p.method)}</span>
                      <span className="font-medium tabular-nums">
                        {formatMoney(p.amount_cents)}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </section>
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">Faturas</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {(invoices ?? []).length === 0 ? (
                  <li className="text-muted">Nenhuma</li>
                ) : (
                  (invoices ?? []).map((inv) => (
                    <li key={inv.id} className="flex justify-between gap-2">
                      <span className="text-muted">{inv.invoice_number}</span>
                      <span className="font-medium">{paymentStatusPt(inv.status)}</span>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>
        </div>
        <NewDogForm clientId={client.id} />
      </div>
    </div>
  );
}
