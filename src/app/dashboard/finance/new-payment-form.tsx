"use client";

import { usePreviewMode } from "@/components/preview-mode";
import { createClient } from "@/lib/supabase/client";
import type { PaymentMethod, PaymentStatus } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState } from "react";

const METHODS: PaymentMethod[] = [
  "pix",
  "credit_card",
  "cash",
  "bank_transfer",
];

export function NewPaymentForm({
  clients,
}: {
  clients: { id: string; name: string }[];
}) {
  const preview = usePreviewMode();
  const router = useRouter();
  const supabase = createClient();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [status, setStatus] = useState<PaymentStatus>("paid");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (preview) {
      setError("Preview mode: connect Supabase and set NEXT_PUBLIC_AUTH_BYPASS=0 to save.");
      return;
    }
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
    const cents = Math.round(parseFloat(amount || "0") * 100);
    const { error: err } = await supabase.from("payments").insert({
      organization_id: profile.organization_id,
      client_id: clientId || null,
      amount_cents: cents,
      method,
      status,
      paid_at: status === "paid" ? new Date().toISOString() : null,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setAmount("");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">Record payment</h3>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          required
          type="number"
          min={0}
          step={0.01}
          placeholder="Amount (BRL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m.replace("_", " ")}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PaymentStatus)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading || preview || clients.length === 0}
          className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {preview ? "Preview — disabled" : loading ? "Saving…" : "Save payment"}
        </button>
      </form>
    </div>
  );
}
