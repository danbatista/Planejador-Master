import { getOrgContext } from "@/lib/org-context";
import { NewPackageForm } from "./new-package-form";
import { NewServiceForm } from "./new-service-form";

const KIND_LABELS: Record<string, string> = {
  private_lesson: "Aula particular",
  group_lesson: "Aula em grupo",
  boarding: "Hospedagem",
  behavior_correction: "Correção comportamental",
  puppy_training: "Filhote",
  custom: "Personalizado",
};

export default async function ServicesPage() {
  const ctx = await getOrgContext();
  let services: {
    id: string;
    name: string;
    kind: string;
    description: string | null;
    duration_minutes: number;
    active: boolean;
  }[] = [];
  let packages: {
    id: string;
    name: string;
    description: string | null;
    sessions_included: number;
    validity_days: number | null;
  }[] = [];

  if (!ctx.bypass) {
    const supabase = ctx.supabase;
    const orgId = ctx.orgId;
    const [{ data: s }, { data: p }] = await Promise.all([
      supabase.from("services").select("*").eq("organization_id", orgId).order("name"),
      supabase.from("packages").select("*").eq("organization_id", orgId).order("name"),
    ]);
    services = (s ?? []) as typeof services;
    packages = (p ?? []) as typeof packages;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Serviços e pacotes
        </h1>
        <p className="mt-1 text-sm text-muted">
          Catálogo de aulas, hospedagem e combos.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Serviços</h2>
          <div className="mt-3 space-y-2">
            {services.length === 0 ? (
              <p className="text-sm text-muted">
                {ctx.bypass ? "Modo prévia: sem serviços." : "Nenhum serviço ainda."}
              </p>
            ) : (
              services.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted">
                        {KIND_LABELS[s.kind] ?? s.kind} · {s.duration_minutes} min
                      </p>
                      {s.description ? (
                        <p className="mt-2 text-sm text-muted">{s.description}</p>
                      ) : null}
                    </div>
                    <span
                      className={
                        s.active
                          ? "text-xs font-medium text-accent"
                          : "text-xs text-muted"
                      }
                    >
                      {s.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6">
            <NewServiceForm />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Pacotes</h2>
          <div className="mt-3 space-y-2">
            {packages.length === 0 ? (
              <p className="text-sm text-muted">
                {ctx.bypass ? "Modo prévia: sem pacotes." : "Nenhum pacote ainda."}
              </p>
            ) : (
              packages.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted">
                    {p.sessions_included} aula(s)
                    {p.validity_days ? ` · válido por ${p.validity_days} dias` : ""}
                  </p>
                  {p.description ? (
                    <p className="mt-2 text-sm text-muted">{p.description}</p>
                  ) : null}
                </div>
              ))
            )}
          </div>
          <div className="mt-6">
            <NewPackageForm />
          </div>
        </div>
      </div>
    </div>
  );
}
