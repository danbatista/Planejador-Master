import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();
  const { data: org } = profile?.organization_id
    ? await supabase
        .from("organizations")
        .select("name, slug, settings")
        .eq("id", profile.organization_id)
        .single()
    : { data: null };

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Workspace profile and integration placeholders.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Workspace</h2>
        {org ? (
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-muted">Name</dt>
              <dd className="font-medium">{org.name}</dd>
            </div>
            <div>
              <dt className="text-muted">Slug</dt>
              <dd className="font-mono text-xs">{org.slug}</dd>
            </div>
          </dl>
        ) : null}
        <p className="mt-4 text-xs text-muted">
          Future: Stripe customer portal, Pix provider keys, WhatsApp Business API
          tokens, and mobile push stored in{" "}
          <span className="font-mono">organizations.settings</span>.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Account</h2>
        <p className="mt-2 text-sm text-muted">{user?.email}</p>
        <p className="mt-1 text-xs capitalize text-muted">Role: {profile?.role}</p>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </div>
      <Link href="/" className="text-sm text-primary hover:underline">
        ← Marketing site
      </Link>
    </div>
  );
}
