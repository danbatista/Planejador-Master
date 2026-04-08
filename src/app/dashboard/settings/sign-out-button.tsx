"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading || disabled}
      className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-sidebar disabled:opacity-60"
    >
      {disabled
        ? "Sair (desativado na prévia)"
        : loading
          ? "Saindo…"
          : "Sair"}
    </button>
  );
}
