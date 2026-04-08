import { isAuthBypass } from "@/lib/auth-bypass";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";
import { redirect } from "next/navigation";

export const BYPASS_ORG_ID = "00000000-0000-4000-8000-000000000001";

export { isAuthBypass } from "@/lib/auth-bypass";

function bypassProfile(): Profile {
  const now = new Date().toISOString();
  return {
    id: "00000000-0000-4000-8000-000000000002",
    organization_id: BYPASS_ORG_ID,
    email: "preview@local.dev",
    full_name: "Adestrador (prévia)",
    phone: null,
    avatar_url: null,
    role: "admin",
    work_hours: null,
    created_at: now,
    updated_at: now,
  };
}

export type OrgContext =
  | { bypass: true; orgId: string; profile: Profile }
  | {
      bypass: false;
      orgId: string;
      profile: Profile;
      supabase: Awaited<ReturnType<typeof createClient>>;
    };

export async function getOrgContext(): Promise<OrgContext> {
  if (isAuthBypass()) {
    return {
      bypass: true,
      orgId: BYPASS_ORG_ID,
      profile: bypassProfile(),
    };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!profile?.organization_id) redirect("/onboarding");
  return {
    bypass: false,
    orgId: profile.organization_id,
    profile,
    supabase,
  };
}
