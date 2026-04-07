"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewDogForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [weight, setWeight] = useState("");
  const [temperament, setTemperament] = useState("");
  const [behavioral, setBehavioral] = useState("");
  const [medical, setMedical] = useState("");
  const [goals, setGoals] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setError("Not signed in");
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();
    if (!profile?.organization_id) {
      setLoading(false);
      setError("No organization");
      return;
    }
    const { data, error: err } = await supabase
      .from("dogs")
      .insert({
        organization_id: profile.organization_id,
        client_id: clientId,
        name: name.trim(),
        breed: breed.trim() || null,
        age_months: ageMonths ? parseInt(ageMonths, 10) : null,
        weight_kg: weight ? parseFloat(weight) : null,
        temperament: temperament.trim() || null,
        behavioral_problems: behavioral.trim() || null,
        medical_notes: medical.trim() || null,
        training_goals: goals.trim() || null,
      })
      .select("id")
      .single();
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      actor_id: user.id,
      action: "dog.created",
      entity_type: "dog",
      entity_id: data.id,
    });
    setName("");
    setBreed("");
    setAgeMonths("");
    setWeight("");
    setTemperament("");
    setBehavioral("");
    setMedical("");
    setGoals("");
    router.refresh();
    router.push(`/dashboard/dogs/${data.id}`);
  }

  return (
    <div className="h-fit rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">Add dog</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          required
          placeholder="Dog name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          placeholder="Breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            placeholder="Age (months)"
            value={ageMonths}
            onChange={(e) => setAgeMonths(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="number"
            step="0.1"
            min={0}
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <input
          placeholder="Temperament"
          value={temperament}
          onChange={(e) => setTemperament(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Behavioral problems"
          value={behavioral}
          onChange={(e) => setBehavioral(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Medical notes"
          value={medical}
          onChange={(e) => setMedical(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Training goals"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 dark:text-slate-900"
        >
          {loading ? "Saving…" : "Save dog"}
        </button>
      </form>
    </div>
  );
}
