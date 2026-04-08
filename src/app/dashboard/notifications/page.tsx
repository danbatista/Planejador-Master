import { formatDateTime } from "@/lib/format";
import { getOrgContext } from "@/lib/org-context";

export default async function NotificationsPage() {
  const ctx = await getOrgContext();
  let items: {
    id: string;
    title: string;
    body: string | null;
    channel: string;
    type: string;
    created_at: string;
  }[] = [];

  if (!ctx.bypass) {
    const { data } = await ctx.supabase
      .from("notifications")
      .select("*")
      .eq("organization_id", ctx.orgId)
      .or(`user_id.eq.${ctx.profile.id},user_id.is.null`)
      .order("created_at", { ascending: false })
      .limit(50);
    items = (data ?? []) as typeof items;
  }

  const channelPt: Record<string, string> = {
    email: "E-mail",
    whatsapp: "WhatsApp",
    in_app: "No app",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Notificações
        </h1>
        <p className="mt-1 text-sm text-muted">
          Fila interna; e-mail e WhatsApp podem consumir esta tabela em um worker.
        </p>
      </div>
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted">
            {ctx.bypass
              ? "Modo prévia: sem notificações."
              : "Nenhuma notificação. O cron de lembretes enfileira aqui."}
          </li>
        ) : (
          items.map((n) => (
            <li
              key={n.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <span className="text-xs text-muted">{formatDateTime(n.created_at)}</span>
              </div>
              {n.body ? <p className="mt-1 text-sm text-muted">{n.body}</p> : null}
              <p className="mt-2 text-xs text-muted">
                {channelPt[n.channel] ?? n.channel} · {n.type}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
