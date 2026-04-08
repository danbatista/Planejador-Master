import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
  }
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Cliente admin não configurado", sent: 0 },
      { status: 503 },
    );
  }
  const now = new Date();
  const horizon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const { data: sessions } = await admin
    .from("training_sessions")
    .select(
      "id, organization_id, trainer_id, client_id, dog_id, start_at, client_reminder_sent_at, instructor_reminder_sent_at, clients(email, name), dogs(name), profiles!training_sessions_trainer_id_fkey(email, full_name)",
    )
    .eq("status", "scheduled")
    .gte("start_at", now.toISOString())
    .lte("start_at", horizon.toISOString());

  let queued = 0;
  for (const s of sessions ?? []) {
    const row = s as unknown as {
      id: string;
      organization_id: string;
      client_reminder_sent_at: string | null;
      instructor_reminder_sent_at: string | null;
      clients: { email: string | null; name: string } | null;
      dogs: { name: string } | null;
      profiles: { email: string | null; full_name: string | null } | null;
    };
    if (!row.client_reminder_sent_at && row.clients?.email) {
      await admin.from("notifications").insert({
        organization_id: row.organization_id,
        user_id: null,
        channel: "email",
        type: "session_reminder_client",
        title: "Aula de adestramento amanhã",
        body: `Lembrete: aula de ${row.dogs?.name ?? "seu cão"} — ${row.clients.name}.`,
        metadata: { session_id: row.id, to: row.clients.email },
      });
      await admin
        .from("training_sessions")
        .update({ client_reminder_sent_at: now.toISOString() })
        .eq("id", row.id);
      queued += 1;
    }
    if (!row.instructor_reminder_sent_at && row.profiles?.email) {
      await admin.from("notifications").insert({
        organization_id: row.organization_id,
        user_id: null,
        channel: "email",
        type: "session_reminder_trainer",
        title: "Aula na sua agenda",
        body: `Você tem uma aula em breve: ${row.dogs?.name ?? "cão"}.`,
        metadata: { session_id: row.id, to: row.profiles.email },
      });
      await admin
        .from("training_sessions")
        .update({ instructor_reminder_sent_at: now.toISOString() })
        .eq("id", row.id);
      queued += 1;
    }
  }
  return NextResponse.json({
    ok: true,
    notifications_queued: queued,
    whatsapp_ready:
      "Guarde o telefone do cliente e envie via WhatsApp Cloud API a partir do metadata das notificações.",
  });
}
