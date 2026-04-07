"use client";

import { usePreviewMode } from "@/components/preview-mode";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewInvoiceForm({
  clients,
}: {
  clients: { id: string; name: string }[];
}) {
  const preview = usePreviewMode();
  const router = useRouter();
  const supabase = createClient();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dueDate, setDueDate] = useState("");
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
    const num =
      invoiceNumber.trim() ||
      `INV-${Date.now().toString(36).toUpperCase()}`;
    const { error: err } = await supabase.from("invoices").insert({
      organization_id: profile.organization_id,
      client_id: clientId,
      invoice_number: num,
      amount_cents: cents,
      status: "pending",
      due_date: dueDate || null,
      line_items: [{ description: "Services", amount_cents: cents }],
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setAmount("");
    setInvoiceNumber("");
    setDueDate("");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">Create invoice</h3>
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
          placeholder="Invoice # (optional)"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
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
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading || preview || clients.length === 0}
          className="w-full rounded-lg bg-accent py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 dark:text-slate-900"
        >
          {preview ? "Preview — disabled" : loading ? "Saving…" : "Create invoice"}
        </button>
      </form>
    </div>
  );
}
