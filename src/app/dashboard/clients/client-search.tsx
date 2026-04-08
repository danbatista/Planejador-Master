"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function ClientSearch({ initial }: { initial: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function onChange(v: string) {
    startTransition(() => {
      const p = new URLSearchParams(params.toString());
      if (v.trim()) p.set("q", v.trim());
      else p.delete("q");
      router.push(`/dashboard/clients?${p.toString()}`);
    });
  }

  return (
    <input
      type="search"
      placeholder="Buscar nome, e-mail, telefone…"
      defaultValue={initial}
      onChange={(e) => onChange(e.target.value)}
      className="w-full max-w-sm rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none ring-primary focus:ring-2 sm:w-72"
      disabled={pending}
    />
  );
}
