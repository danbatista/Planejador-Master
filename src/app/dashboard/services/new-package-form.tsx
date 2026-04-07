"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewPackageForm() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sessions, setSessions] = useState("5");
  const [validity, setValidity] = useState("");
  const [price, setPrice] = useState("");
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
    const priceCents = Math.round(parseFloat(price || "0") * 100);
    const { error: err } = await supabase.from("packages").insert({
      organization_id: profile.organization_id,
      name: name.trim(),
      description: description.trim() || null,
      sessions_included: parseInt(sessions, 10) || 1,
      validity_days: validity ? parseInt(validity, 10) : null,
      price_cents: Number.isFinite(priceCents) ? priceCents : 0,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setName("");
    setDescription("");
    setSessions("5");
    setValidity("");
    setPrice("");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">New package</h3>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          required
          placeholder="Name (e.g. 10-lesson bundle)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={1}
            placeholder="Sessions included"
            value={sessions}
            onChange={(e) => setSessions(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            placeholder="Validity (days)"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <input
          type="number"
          min={0}
          step={0.01}
          placeholder="Price (BRL)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
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
          {loading ? "Saving…" : "Add package"}
        </button>
      </form>
    </div>
  );
}
