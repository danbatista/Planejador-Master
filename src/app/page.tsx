import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            TrainPaw
          </span>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-foreground"
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
            >
              Começar
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-sm font-medium text-accent">Operação de adestramento</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Gerencie seu negócio de adestramento em um painel simples
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Clientes, cães, agenda, pacotes, financeiro, equipe, evolução dos cães e
          análises — pensado para várias empresas desde o primeiro dia.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/signup"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90"
          >
            Criar minha conta
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-sidebar"
          >
            Já tenho conta
          </Link>
        </div>
      </main>
    </div>
  );
}
