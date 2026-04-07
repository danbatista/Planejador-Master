import { AppShell } from "@/components/app-shell";
import { PreviewModeProvider } from "@/components/preview-mode";
import { getOrgContext } from "@/lib/org-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getOrgContext();
  return (
    <PreviewModeProvider active={ctx.bypass}>
      {ctx.bypass ? (
        <div className="border-b border-amber-500/40 bg-amber-500/15 px-4 py-2 text-center text-xs font-medium text-amber-950 dark:text-amber-100">
          Preview mode: auth and data are bypassed. Set NEXT_PUBLIC_AUTH_BYPASS=0 for real
          Supabase.
        </div>
      ) : null}
      <AppShell profile={ctx.profile}>{children}</AppShell>
    </PreviewModeProvider>
  );
}
