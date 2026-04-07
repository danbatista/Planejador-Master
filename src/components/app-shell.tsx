import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Profile } from "@/types/database";
import {
  BarChart3,
  Bell,
  Calendar,
  Dog,
  LayoutDashboard,
  Package,
  PawPrint,
  Receipt,
  Settings,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/services", label: "Services", icon: Package },
  { href: "/dashboard/finance", label: "Finance", icon: Wallet },
  { href: "/dashboard/progress", label: "Progress", icon: PawPrint },
  { href: "/dashboard/team", label: "Team", icon: Dog },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/reports", label: "Reports", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-sidebar lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PawPrint className="h-4 w-4" />
          </span>
          <span className="font-semibold tracking-tight">TrainPaw</span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-card hover:text-foreground"
            >
              <item.icon className="h-4 w-4 shrink-0 text-muted" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3 text-xs text-muted">
          Signed in as{" "}
          <span className="font-medium text-foreground">
            {profile.full_name || profile.email}
          </span>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PawPrint className="h-4 w-4" />
            </span>
            <span className="font-semibold">TrainPaw</span>
          </div>
          <div className="hidden flex-1 lg:block" />
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/finance"
              className="hidden items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-sidebar sm:inline-flex"
            >
              <Receipt className="h-4 w-4" />
              Finance
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-card/95 px-2 py-2 backdrop-blur lg:hidden">
          {nav.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium text-muted"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="h-16 lg:hidden" />
      </div>
    </div>
  );
}
