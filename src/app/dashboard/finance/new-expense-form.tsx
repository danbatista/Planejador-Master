"use client";

import { usePreviewMode } from "@/components/preview-mode";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewExpenseForm() {
  const preview = usePreviewMode();
  const router = useRouter();
  const supabase = createClient();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [incurred, setIncurred] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (preview) {
      setError(
        "Modo prévia: configure o Supabase e defina NEXT_PUBLIC_AUTH_BYPASS=0 para salvar.",
      );
      return;
    }
    setError(null);
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setError("Sessão expirada. Entre novamente.");
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();
    if (!profile?.organization_id) {
      setLoading(false);
      setError("Empresa não encontrada");
      return;
    }
    const cents = Math.round(parseFloat(amount || "0") * 100);
    const { error: err } = await supabase.from("expenses").insert({
      organization_id: profile.organization_id,
      category: category.trim() || "geral",
      description: description.trim() || null,
      amount_cents: cents,
      incurred_at: incurred,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setCategory("");
    setDescription("");
    setAmount("");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">Nova despesa</h3>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          required
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          required
          type="number"
          min={0}
          step={0.01}
          placeholder="Valor (R$)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={incurred}
          onChange={(e) => setIncurred(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading || preview}
          className="w-full rounded-lg border border-border py-2 text-sm font-semibold hover:bg-sidebar disabled:opacity-60"
        >
          {preview ? "Prévia — desativado" : loading ? "Salvando…" : "Salvar despesa"}
        </button>
      </form>
    </div>
  );
}
