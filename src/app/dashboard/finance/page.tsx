import { formatMoney, paymentMethodPt, paymentStatusPt } from "@/lib/format";
import { getOrgContext } from "@/lib/org-context";
import { NewExpenseForm } from "./new-expense-form";
import { RevenueByMethodChart } from "./revenue-by-method-chart";
import { NewInvoiceForm } from "./new-invoice-form";
import { NewPaymentForm } from "./new-payment-form";

export default async function FinancePage() {
  const ctx = await getOrgContext();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  let payments: {
    id: string;
    amount_cents: number;
    method: string;
    status: string;
    paid_at: string | null;
    clients?: { name: string } | null;
  }[] = [];
  let expenses: { id: string; category: string; amount_cents: number; incurred_at: string }[] =
    [];
  let clients: { id: string; name: string }[] = [];

  if (!ctx.bypass) {
    const supabase = ctx.supabase;
    const orgId = ctx.orgId;
    const [pa, ex, cl] = await Promise.all([
      supabase
        .from("payments")
        .select("id, amount_cents, method, status, paid_at, client_id, clients(name)")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("expenses")
        .select("*")
        .eq("organization_id", orgId)
        .order("incurred_at", { ascending: false })
        .limit(50),
      supabase.from("clients").select("id, name").eq("organization_id", orgId).order("name"),
    ]);
    payments = (pa.data ?? []) as unknown as typeof payments;
    expenses = (ex.data ?? []) as {
      id: string;
      category: string;
      amount_cents: number;
      incurred_at: string;
    }[];
    clients = cl.data ?? [];
  }

  const paidPayments = payments.filter((p) => p.status === "paid");
  const revenueMonth = paidPayments
    .filter((p) => p.paid_at && new Date(p.paid_at) >= monthStart)
    .reduce((s, p) => s + p.amount_cents, 0);
  const expenseMonth = expenses
    .filter((e) => new Date(e.incurred_at) >= monthStart)
    .reduce((s, e) => s + e.amount_cents, 0);
  const profitMonth = revenueMonth - expenseMonth;

  const byMethod: Record<string, number> = {};
  for (const p of paidPayments) {
    if (p.paid_at && new Date(p.paid_at) >= monthStart) {
      byMethod[p.method] = (byMethod[p.method] ?? 0) + p.amount_cents;
    }
  }
  const chartData = Object.entries(byMethod).map(([method, cents]) => ({
    method: paymentMethodPt(method),
    revenue: cents / 100,
  }));

  const pendingDebt = payments
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .reduce((s, p) => s + p.amount_cents, 0);

  const previewClient = { id: "preview-client", name: "Cliente (prévia)" };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Financeiro</h1>
        <p className="mt-1 text-sm text-muted">
          Receitas, despesas, faturas e formas de pagamento (Pix, cartão, etc.).
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium text-muted">Receita no mês</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {formatMoney(revenueMonth)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium text-muted">Despesas no mês</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {formatMoney(expenseMonth)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium text-muted">Lucro no mês</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-accent">
            {formatMoney(profitMonth)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium text-muted">A receber</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {formatMoney(pendingDebt)}
          </p>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">
            Receita por forma de pagamento (mês)
          </h2>
          <div className="mt-4 h-64 w-full min-w-0">
            <RevenueByMethodChart data={chartData} />
          </div>
        </div>
        <div className="space-y-6">
          <NewPaymentForm
            clients={ctx.bypass && clients.length === 0 ? [previewClient] : clients}
          />
          <NewExpenseForm />
          <NewInvoiceForm
            clients={ctx.bypass && clients.length === 0 ? [previewClient] : clients}
          />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Pagamentos recentes</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {payments.length === 0 ? (
              <li className="text-muted">{ctx.bypass ? "Modo prévia." : "Nenhum."}</li>
            ) : (
              payments.map((p) => {
                const row = p as typeof p & {
                  clients: { name: string } | null;
                };
                return (
                  <li key={p.id} className="flex justify-between gap-2 border-b border-border pb-2">
                    <span className="text-muted">
                      {row.clients?.name ?? "—"} · {paymentMethodPt(p.method)}
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatMoney(p.amount_cents)} · {paymentStatusPt(p.status)}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Despesas recentes</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {expenses.length === 0 ? (
              <li className="text-muted">{ctx.bypass ? "Modo prévia." : "Nenhuma."}</li>
            ) : (
              expenses.map((ex) => (
                <li key={ex.id} className="flex justify-between gap-2 border-b border-border pb-2">
                  <span className="text-muted">{ex.category}</span>
                  <span className="font-medium tabular-nums">
                    {formatMoney(ex.amount_cents)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
