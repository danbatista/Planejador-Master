"use client";

import { usePreviewMode } from "@/components/preview-mode";
import { createClient } from "@/lib/supabase/client";
import type { ServiceKind } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState } from "react";

const KINDS: { value: ServiceKind; label: string }[] = [
  { value: "private_lesson", label: "Aula particular" },
  { value: "group_lesson", label: "Aula em grupo" },
  { value: "boarding", label: "Hospedagem" },
  { value: "behavior_correction", label: "Correção comportamental" },
  { value: "puppy_training", label: "Filhote" },
  { value: "custom", label: "Personalizado" },
];

export function NewServiceForm() {
  const preview = usePreviewMode();
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<ServiceKind>("private_lesson");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");
  const [price, setPrice] = useState("");
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
    const priceCents = Math.round(parseFloat(price || "0") * 100);
    const { error: err } = await supabase.from("services").insert({
      organization_id: profile.organization_id,
      name: name.trim(),
      kind,
      description: description.trim() || null,
      duration_minutes: parseInt(duration, 10) || 60,
      price_cents: Number.isFinite(priceCents) ? priceCents : 0,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setName("");
    setDescription("");
    setPrice("");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">Novo serviço</h3>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          required
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as ServiceKind)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={15}
            step={5}
            placeholder="Duração (min)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            step={0.01}
            placeholder="Preço (R$)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading || preview}
          className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {preview ? "Prévia — desativado" : loading ? "Salvando…" : "Adicionar serviço"}
        </button>
      </form>
    </div>
  );
}
