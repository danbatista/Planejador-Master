"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function OnboardingForm({ defaultName }: { defaultName: string }) {
  const [name, setName] = useState(
    defaultName ? `Adestramento ${defaultName}` : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: err } = await supabase.rpc(
      "create_organization_for_user",
      { org_name: name.trim() },
    );
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (!data) {
      setError("Não foi possível criar a empresa");
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="org" className="block text-sm font-medium text-foreground">
          Nome comercial
        </label>
        <input
          id="org"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-primary focus:ring-2"
          placeholder="Ex.: Cão em Foco Adestramento"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Criando ambiente…" : "Ir para o painel"}
      </button>
    </form>
  );
}
