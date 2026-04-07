import { isAuthBypass } from "@/lib/auth-bypass";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  if (isAuthBypass()) redirect("/dashboard");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id, full_name")
    .eq("id", user.id)
    .single();
  if (profile?.organization_id) redirect("/dashboard");
  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Name your training business
        </h1>
        <p className="mt-2 text-sm text-muted">
          This creates your isolated workspace. You can invite trainers later.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <OnboardingForm defaultName={profile?.full_name ?? ""} />
        </div>
      </div>
    </div>
  );
}
