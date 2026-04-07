import { createClient } from "@/lib/supabase/server";
import { NewPackageForm } from "./new-package-form";
import { NewServiceForm } from "./new-service-form";

const KIND_LABELS: Record<string, string> = {
  private_lesson: "Private lesson",
  group_lesson: "Group lesson",
  boarding: "Boarding",
  behavior_correction: "Behavior correction",
  puppy_training: "Puppy training",
  custom: "Custom",
};

export default async function ServicesPage() {
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
  const [{ data: services }, { data: packages }] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("organization_id", orgId)
      .order("name"),
    supabase
      .from("packages")
      .select("*")
      .eq("organization_id", orgId)
      .order("name"),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Services & packages
        </h1>
        <p className="mt-1 text-sm text-muted">
          Catalog for lessons, boarding, and bundles.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Services</h2>
          <div className="mt-3 space-y-2">
            {(services ?? []).length === 0 ? (
              <p className="text-sm text-muted">No services yet.</p>
            ) : (
              (services ?? []).map((s) => (
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
                      {s.active ? "Active" : "Inactive"}
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
          <h2 className="text-sm font-semibold text-foreground">Packages</h2>
          <div className="mt-3 space-y-2">
            {(packages ?? []).length === 0 ? (
              <p className="text-sm text-muted">No packages yet.</p>
            ) : (
              (packages ?? []).map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted">
                    {p.sessions_included} sessions
                    {p.validity_days ? ` · ${p.validity_days} days validity` : ""}
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
