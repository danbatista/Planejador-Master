import { formatDateTime } from "@/lib/format";
import { getOrgContext } from "@/lib/org-context";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgressForm } from "./progress-form";

export default async function DogProfilePage({
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
            ← Clients
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Sample Dog
          </h1>
          <p className="mt-1 text-xs text-muted">Route id: {id} (preview only)</p>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Breed</dt>
              <dd className="font-medium text-foreground">Labrador</dd>
            </div>
            <div>
              <dt className="text-muted">Age</dt>
              <dd className="font-medium text-foreground">18 months</dd>
            </div>
          </dl>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <h2 className="text-sm font-semibold text-foreground">Progress timeline</h2>
            <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted">
              No progress entries in preview.
            </p>
          </div>
          <ProgressForm dogId={id} />
        </div>
      </div>
    );
  }

  const supabase = ctx.supabase;
  const orgId = ctx.orgId;
  const { data: dog } = await supabase
    .from("dogs")
    .select("*, clients(id, name)")
    .eq("id", id)
    .eq("organization_id", orgId)
    .single();
  if (!dog) notFound();
  const client = dog.clients as unknown as { id: string; name: string };
  const { data: progress } = await supabase
    .from("progress_entries")
    .select("*")
    .eq("dog_id", id)
    .order("recorded_at", { ascending: false })
    .limit(30);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/dashboard/clients/${client.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← {client.name}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          {dog.name}
        </h1>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {dog.breed ? (
            <div>
              <dt className="text-muted">Breed</dt>
              <dd className="font-medium text-foreground">{dog.breed}</dd>
            </div>
          ) : null}
          {dog.age_months != null ? (
            <div>
              <dt className="text-muted">Age</dt>
              <dd className="font-medium text-foreground">{dog.age_months} months</dd>
            </div>
          ) : null}
          {dog.weight_kg != null ? (
            <div>
              <dt className="text-muted">Weight</dt>
              <dd className="font-medium text-foreground">{dog.weight_kg} kg</dd>
            </div>
          ) : null}
          {dog.temperament ? (
            <div className="sm:col-span-2">
              <dt className="text-muted">Temperament</dt>
              <dd className="text-foreground">{dog.temperament}</dd>
            </div>
          ) : null}
          {dog.behavioral_problems ? (
            <div className="sm:col-span-2">
              <dt className="text-muted">Behavioral focus</dt>
              <dd className="text-foreground">{dog.behavioral_problems}</dd>
            </div>
          ) : null}
          {dog.medical_notes ? (
            <div className="sm:col-span-2">
              <dt className="text-muted">Medical</dt>
              <dd className="text-foreground">{dog.medical_notes}</dd>
            </div>
          ) : null}
          {dog.training_goals ? (
            <div className="sm:col-span-2">
              <dt className="text-muted">Training goals</dt>
              <dd className="text-foreground">{dog.training_goals}</dd>
            </div>
          ) : null}
        </dl>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Progress timeline</h2>
            <Link
              href={`/api/reports/dog/${dog.id}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              Download PDF
            </Link>
          </div>
          <ul className="space-y-3">
            {(progress ?? []).length === 0 ? (
              <li className="rounded-xl border border-border bg-card p-6 text-sm text-muted">
                No progress entries yet. Add one on the right after a session.
              </li>
            ) : (
              (progress ?? []).map((e) => (
                <li
                  key={e.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {e.title || e.entry_type}
                    </span>
                    <span className="text-xs text-muted">
                      {formatDateTime(e.recorded_at)}
                    </span>
                  </div>
                  {e.body ? (
                    <p className="mt-2 text-sm text-foreground">{e.body}</p>
                  ) : null}
                  {e.session_result ? (
                    <p className="mt-2 text-sm text-muted">
                      <span className="font-medium text-foreground">Session: </span>
                      {e.session_result}
                    </p>
                  ) : null}
                  {e.instructor_comment ? (
                    <p className="mt-2 text-sm text-muted">
                      <span className="font-medium text-foreground">Instructor: </span>
                      {e.instructor_comment}
                    </p>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </div>
        <ProgressForm dogId={dog.id} />
      </div>
    </div>
  );
}
