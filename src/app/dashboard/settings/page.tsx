import { getOrgContext } from "@/lib/org-context";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

export default async function SettingsPage() {
  const ctx = await getOrgContext();
  let org: { name: string; slug: string; settings: Record<string, unknown> } | null = null;

  if (!ctx.bypass) {
    const { data } = await ctx.supabase
      .from("organizations")
      .select("name, slug, settings")
      .eq("id", ctx.orgId)
      .single();
    org = data;
  } else {
    org = { name: "Empresa (prévia)", slug: "previa", settings: {} };
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Configurações
        </h1>
        <p className="mt-1 text-sm text-muted">Dados da empresa e integrações futuras.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Empresa</h2>
        {org ? (
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-muted">Nome</dt>
              <dd className="font-medium">{org.name}</dd>
            </div>
            <div>
              <dt className="text-muted">Identificador (slug)</dt>
              <dd className="font-mono text-xs">{org.slug}</dd>
            </div>
          </dl>
        ) : null}
        <p className="mt-4 text-xs text-muted">
          Futuro: Stripe, Pix, WhatsApp Business e app móvel em{" "}
          <span className="font-mono">organizations.settings</span>.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Conta</h2>
        <p className="mt-2 text-sm text-muted">{ctx.profile.email}</p>
        <p className="mt-1 text-xs capitalize text-muted">
          Função:{" "}
          {ctx.profile.role === "admin"
            ? "Administrador"
            : ctx.profile.role === "trainer"
              ? "Adestrador"
              : "Assistente"}
        </p>
        <div className="mt-4">
          <SignOutButton disabled={ctx.bypass} />
        </div>
      </div>
      <Link href="/" className="text-sm text-primary hover:underline">
        ← Site
      </Link>
    </div>
  );
}
