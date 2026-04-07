# TrainPaw

Multi-tenant SaaS for dog trainers: clients, dogs, scheduling, services, finance, team roles, progress tracking, analytics, and PDF reports.

## Setup

1. Copy `.env.example` to `.env.local` and set Supabase URL and anon key. For reminder cron, set `SUPABASE_SERVICE_ROLE_KEY` and `CRON_SECRET`.
2. Optional UI-only preview: set `NEXT_PUBLIC_AUTH_BYPASS=1` and open `/dashboard` without signing in (no data is loaded or saved).
3. Apply `supabase/migrations` in the Supabase SQL editor or CLI.
4. In Supabase Auth, enable Email and Google providers and set the redirect URL to `{APP_URL}/auth/callback`.
5. `npm install` and `npm run dev`.

## Cron

POST `/api/cron/reminders` with header `Authorization: Bearer $CRON_SECRET` to queue session reminder rows (email worker reads `notifications`).
