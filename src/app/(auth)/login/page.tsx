import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-sm">
        <Link
          href="/"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-muted">
          Access your training workspace.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <LoginForm nextPathPromise={searchParams} />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          No account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
