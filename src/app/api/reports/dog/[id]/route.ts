import { isAuthBypass } from "@/lib/auth-bypass";
import { createClient } from "@/lib/supabase/server";
import { DogReportDocument } from "@/lib/reports/dog-report-document";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { createElement } from "react";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (isAuthBypass()) {
    const buffer = await renderToBuffer(
      createElement(DogReportDocument, {
        dog: {
          name: "Preview Dog",
          breed: "Sample breed",
          age_months: 12,
          training_goals: "Leash manners",
          behavioral_problems: "Jumping",
        },
        client: { name: "Preview Client", email: "client@example.com", phone: null },
        progress: [],
      }) as Parameters<typeof renderToBuffer>[0],
    );
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="dog-report-preview.pdf"',
      },
    });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();
  if (!profile?.organization_id) {
    return NextResponse.json({ error: "No organization" }, { status: 400 });
  }
  const { data: dog } = await supabase
    .from("dogs")
    .select(
      "id, name, breed, age_months, training_goals, behavioral_problems, clients(name, email, phone)",
    )
    .eq("id", id)
    .eq("organization_id", profile.organization_id)
    .single();
  if (!dog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const { data: progress } = await supabase
    .from("progress_entries")
    .select("*")
    .eq("dog_id", id)
    .order("recorded_at", { ascending: false })
    .limit(15);
  const client = dog.clients as unknown as {
    name: string;
    email: string | null;
    phone: string | null;
  } | null;

  const buffer = await renderToBuffer(
    createElement(DogReportDocument, {
      dog: {
        name: dog.name,
        breed: dog.breed,
        age_months: dog.age_months,
        training_goals: dog.training_goals,
        behavioral_problems: dog.behavioral_problems,
      },
      client,
      progress: progress ?? [],
    }) as Parameters<typeof renderToBuffer>[0],
  );

  await supabase.from("generated_reports").insert({
    organization_id: profile.organization_id,
    dog_id: id,
    created_by: user.id,
    report_type: "client_pdf",
    payload: { generated_at: new Date().toISOString() },
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="dog-report-${dog.name.replace(/\s+/g, "-")}.pdf"`,
    },
  });
}
