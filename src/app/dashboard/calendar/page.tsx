import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";
import {
  NewSessionForm,
  type DogRow,
  type ServiceRow,
  type TrainerRow,
} from "./new-session-form";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id, role")
    .eq("id", user!.id)
    .single();
  const orgId = profile!.organization_id!;
  const start = from ? new Date(from) : new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  const { data: sessions } = await supabase
    .from("training_sessions")
    .select(
      `
      id,
      start_at,
      end_at,
      status,
      title,
      attendance_confirmed,
      client:clients (name),
      dog:dogs (name),
      trainer:profiles!training_sessions_trainer_id_fkey (full_name),
      service:services (name)
    `,
    )
    .eq("organization_id", orgId)
    .gte("start_at", start.toISOString())
    .lt("start_at", end.toISOString())
    .order("start_at", { ascending: true });
  const [{ data: dogs }, { data: trainers }, { data: services }] = await Promise.all([
    supabase
      .from("dogs")
      .select("id, name, client_id, clients(name)")
      .eq("organization_id", orgId)
      .order("name"),
    supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("organization_id", orgId)
      .order("full_name"),
    supabase
      .from("services")
      .select("id, name, duration_minutes")
      .eq("organization_id", orgId)
      .eq("active", true)
      .order("name"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Calendar
        </h1>
        <p className="mt-1 text-sm text-muted">
          Week view with conflict-safe scheduling (trainer and dog).
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {(sessions ?? []).length === 0 ? (
            <p className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted">
              No sessions this week.
            </p>
          ) : (
            (sessions ?? []).map((row) => {
              const s = row as unknown as {
                id: string;
                start_at: string;
                end_at: string;
                status: string;
                title: string | null;
                attendance_confirmed: boolean;
                client: { name: string } | null;
                dog: { name: string } | null;
                trainer: { full_name: string | null } | null;
                service: { name: string } | null;
              };
              return (
                <div
                  key={s.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {s.title ||
                          `${s.dog?.name ?? "Dog"} · ${s.client?.name ?? "Client"}`}
                      </p>
                      <p className="text-xs text-muted">
                        {s.service?.name ?? "Custom"} · {s.trainer?.full_name ?? "Trainer"}
                      </p>
                    </div>
                    <span className="rounded-full bg-sidebar px-2 py-0.5 text-xs capitalize text-foreground">
                      {s.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {formatDateTime(s.start_at)} — {formatDateTime(s.end_at)}
                    {s.attendance_confirmed ? " · Confirmed" : ""}
                  </p>
                </div>
              );
            })
          )}
        </div>
        <NewSessionForm
          dogs={(dogs ?? []) as unknown as DogRow[]}
          trainers={(trainers ?? []) as unknown as TrainerRow[]}
          services={(services ?? []) as unknown as ServiceRow[]}
          currentUserId={user!.id}
          role={profile!.role}
        />
      </div>
    </div>
  );
}
