"use client";

import { usePreviewMode } from "@/components/preview-mode";
import { createClient } from "@/lib/supabase/client";
import { canAssignAnyTrainer } from "@/lib/permissions";
import type { UserRole } from "@/types/database";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export type DogRow = {
  id: string;
  name: string;
  client_id: string;
  clients: { name: string } | null;
};
export type TrainerRow = { id: string; full_name: string | null; role: UserRole };
export type ServiceRow = { id: string; name: string; duration_minutes: number };

export function NewSessionForm({
  dogs,
  trainers,
  services,
  currentUserId,
  role,
}: {
  dogs: DogRow[];
  trainers: TrainerRow[];
  services: ServiceRow[];
  currentUserId: string;
  role: UserRole;
}) {
  const preview = usePreviewMode();
  const router = useRouter();
  const supabase = createClient();
  const [dogId, setDogId] = useState(dogs[0]?.id ?? "");
  const clientId = useMemo(() => {
    const d = dogs.find((x) => x.id === dogId);
    return d?.client_id ?? "";
  }, [dogs, dogId]);
  const defaultTrainer = canAssignAnyTrainer(role)
    ? trainers[0]?.id ?? currentUserId
    : currentUserId;
  const [trainerId, setTrainerId] = useState(
    trainers.some((t) => t.id === defaultTrainer)
      ? defaultTrainer
      : currentUserId,
  );
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [startLocal, setStartLocal] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (preview) {
      setError("Preview mode: connect Supabase and set NEXT_PUBLIC_AUTH_BYPASS=0 to save.");
      return;
    }
    setError(null);
    if (!dogId || !clientId) {
      setError("Select a dog");
      return;
    }
    if (!startLocal) {
      setError("Pick date and time");
      return;
    }
    const start = new Date(startLocal);
    if (Number.isNaN(start.getTime())) {
      setError("Invalid date");
      return;
    }
    const svc = services.find((s) => s.id === serviceId);
    const duration = svc?.duration_minutes ?? 60;
    const end = new Date(start.getTime() + duration * 60 * 1000);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Not signed in");
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();
    if (!profile?.organization_id) {
      setError("No organization");
      return;
    }
    let finalTrainer = trainerId;
    if (!canAssignAnyTrainer(role)) {
      finalTrainer = user.id;
    }
    setLoading(true);
    const { error: err } = await supabase.from("training_sessions").insert({
      organization_id: profile.organization_id,
      client_id: clientId,
      dog_id: dogId,
      trainer_id: finalTrainer,
      service_id: serviceId || null,
      title: title.trim() || null,
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      status: "scheduled",
    });
    setLoading(false);
    if (err) {
      if (err.message.includes("overlap") || err.code === "23P01") {
        setError("Schedule conflict: trainer or dog already booked.");
      } else {
        setError(err.message);
      }
      return;
    }
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      actor_id: user.id,
      action: "session.scheduled",
      entity_type: "training_session",
    });
    setTitle("");
    router.refresh();
  }

  return (
    <div className="h-fit rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">New session</h2>
      <p className="mt-1 text-xs text-muted">
        Double booking is blocked at the database layer.
      </p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-muted">Dog</label>
          <select
            value={dogId}
            onChange={(e) => setDogId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {dogs.length === 0 ? (
              <option value="">Add a dog first</option>
            ) : (
              dogs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.clients?.name ?? "Client"})
                </option>
              ))
            )}
          </select>
        </div>
        {canAssignAnyTrainer(role) ? (
          <div>
            <label className="text-xs font-medium text-muted">Instructor</label>
            <select
              value={trainerId}
              onChange={(e) => setTrainerId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name || t.id.slice(0, 8)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div>
          <label className="text-xs font-medium text-muted">Service</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {services.length === 0 ? (
              <option value="">Create services first</option>
            ) : (
              services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration_minutes} min)
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Starts</label>
          <input
            type="datetime-local"
            value={startLocal}
            onChange={(e) => setStartLocal(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <input
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading || preview || dogs.length === 0}
          className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {preview ? "Preview — disabled" : loading ? "Scheduling…" : "Schedule"}
        </button>
      </form>
    </div>
  );
}
