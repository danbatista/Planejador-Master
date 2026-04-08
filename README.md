# PataPro

Plataforma SaaS multiempresa para adestradores: clientes, cães, agenda, serviços, financeiro, equipe, evolução e relatórios.

## Configuração

1. Copie `.env.example` para `.env.local` e defina URL e chave anônima do Supabase. Para o cron de lembretes, use `SUPABASE_SERVICE_ROLE_KEY` e `CRON_SECRET`.
2. Prévia só de interface: `NEXT_PUBLIC_AUTH_BYPASS=1` e abra `/dashboard` sem login (não carrega nem grava dados).
3. Aplique `supabase/migrations` no SQL do Supabase ou via CLI.
4. No Auth do Supabase, ative e-mail e Google e defina o redirect para `{APP_URL}/auth/callback`.
5. `npm install` e `npm run dev`.

## Cron

POST `/api/cron/reminders` com cabeçalho `Authorization: Bearer $CRON_SECRET` para enfileirar lembretes (worker de e-mail lê a tabela `notifications`).
