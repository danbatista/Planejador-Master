"use client";

import { usePreviewMode } from "@/components/preview-mode";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProgressForm({ dogId }: { dogId: string }) {
  const preview = usePreviewMode();
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [goals, setGoals] = useState("");
  const [behavior, setBehavior] = useState("");
  const [plan, setPlan] = useState("");
  const [sessionResult, setSessionResult] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (preview) {
      setError("Preview mode: connect Supabase and set NEXT_PUBLIC_AUTH_BYPASS=0 to save.");
      return;
    }
    setError(null);
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setError("Not signed in");
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();
    if (!profile?.organization_id) {
      setLoading(false);
      setError("No organization");
      return;
    }
    const { error: err } = await supabase.from("progress_entries").insert({
      organization_id: profile.organization_id,
      dog_id: dogId,
      trainer_id: user.id,
      entry_type: "note",
      title: title.trim() || null,
      body: body.trim() || null,
      goals: goals.trim() || null,
      behavior_improvement: behavior.trim() || null,
      training_plan: plan.trim() || null,
      session_result: sessionResult.trim() || null,
      instructor_comment: comment.trim() || null,
      media_urls: [],
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      actor_id: user.id,
      action: "progress.created",
      entity_type: "dog",
      entity_id: dogId,
    });
    setTitle("");
    setBody("");
    setGoals("");
    setBehavior("");
    setPlan("");
    setSessionResult("");
    setComment("");
    router.refresh();
  }

  return (
    <div className="h-fit rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">Add progress</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Notes"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Goals"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Behavior improvement"
          value={behavior}
          onChange={(e) => setBehavior(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Training plan"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Session result"
          value={sessionResult}
          onChange={(e) => setSessionResult(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Instructor comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading || preview}
          className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {preview ? "Preview — disabled" : loading ? "Saving…" : "Save entry"}
        </button>
      </form>
    </div>
  );
}
