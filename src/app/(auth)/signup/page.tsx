import Link from "next/link";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-sm">
        <Link
          href="/"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Voltar
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          Criar conta
        </h1>
        <p className="mt-2 text-sm text-muted">
          Comece o painel da sua empresa de adestramento em minutos.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <SignupForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
