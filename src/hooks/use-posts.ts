import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format, parseISO } from "date-fns";

export interface PostSection {
  category: string;
  title: string;
  hours: number;
  content: string[];
  taskRefs: string[];
  nextSteps?: string[];
}

export interface PostSelfAssessment {
  difficulty: number;
  wentWell: string;
  improve: string;
  tomorrow: string;
}

export interface PostScoreBreakdown {
  tasks: number;
  hours: number;
  notes: number;
  variety: number;
  photos: number;
}

export interface PostTask {
  id: string;
  externalId: string;
  name: string;
  completed: boolean;
}

export interface Post {
  id: string;
  dateRaw: string;
  date: string;
  dayOfWeek: string;
  founderScore: number;
  hours: number;
  impact: number;
  tasksCompleted: number;
  preview: string;
  tags: string[];
  tasks: PostTask[];
  gistBullets: string[];
  reflection: string;
  sections: PostSection[];
  selfAssessment: PostSelfAssessment;
  scoreBreakdown: PostScoreBreakdown | null;
  status: string;
}

function normalizeSection(s: any): PostSection {
  return {
    category: s.category ?? "",
    title: s.title ?? "",
    hours: s.hours ?? 0,
    content: s.content ?? [],
    taskRefs: s.taskRefs ?? s.task_refs ?? [],
    nextSteps: s.nextSteps ?? s.next_steps ?? undefined,
  };
}

function normalizeAssessment(a: any): PostSelfAssessment {
  return {
    difficulty: a?.difficulty ?? 5,
    wentWell: a?.wentWell ?? a?.went_well ?? "",
    improve: a?.improve ?? "",
    tomorrow: a?.tomorrow ?? "",
  };
}

function normalizeBreakdown(b: any): PostScoreBreakdown | null {
  if (!b) return null;
  return {
    tasks: b.tasks ?? 0,
    hours: b.hours ?? 0,
    notes: b.notes ?? 0,
    variety: b.variety ?? 0,
    photos: b.photos ?? 0,
  };
}

function formatDate(dateStr: string): string {
  const d = parseISO(dateStr);
  return format(d, "EEEE, MMMM d");
}

function mapPost(row: any, tasks: any[]): Post {
  const parentSummary = row.parent_summary ?? {};
  const sections = (row.devlog_sections ?? []).map(normalizeSection);

  return {
    id: row.id,
    dateRaw: row.date,
    date: formatDate(row.date),
    dayOfWeek: format(parseISO(row.date), "EEEE"),
    founderScore: row.founder_score ?? 0,
    hours: row.hours_logged ?? 0,
    impact: row.impact_rating ?? 0,
    tasksCompleted: row.tasks_completed ?? 0,
    preview: parentSummary.preview ?? "",
    tags: row.tags ?? [],
    tasks: tasks.map((t) => ({
      id: t.id,
      externalId: t.external_id ?? "",
      name: t.name ?? "",
      completed: t.status === "completed",
    })),
    gistBullets: parentSummary.gist_bullets ?? parentSummary.gistBullets ?? [],
    reflection: parentSummary.reflection ?? "",
    sections,
    selfAssessment: normalizeAssessment(row.self_assessment),
    scoreBreakdown: normalizeBreakdown(row.score_breakdown),
    status: row.status ?? "draft",
  };
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      const { data: postsData, error: postsErr } = await supabase
        .from("posts")
        .select("*")
        .order("date", { ascending: false });

      if (postsErr) {
        if (!cancelled) { setError(postsErr.message); setLoading(false); }
        return;
      }

      const { data: tasksData, error: tasksErr } = await supabase
        .from("tasks")
        .select("*");

      if (tasksErr) {
        if (!cancelled) { setError(tasksErr.message); setLoading(false); }
        return;
      }

      const tasksByPostId = (tasksData ?? []).reduce<Record<string, any[]>>((acc, t) => {
        const pid = t.post_id;
        if (pid) { acc[pid] = acc[pid] || []; acc[pid].push(t); }
        return acc;
      }, {});

      const mapped = (postsData ?? []).map((row) =>
        mapPost(row, tasksByPostId[row.id] ?? [])
      );

      if (!cancelled) { setPosts(mapped); setLoading(false); }
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { posts, loading, error };
}

export function usePost(dateSlug: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      const { data: postsData, error: postsErr } = await supabase
        .from("posts")
        .select("*")
        .eq("date", dateSlug)
        .limit(1);

      if (postsErr) {
        if (!cancelled) { setError(postsErr.message); setLoading(false); }
        return;
      }

      const row = postsData?.[0];
      if (!row) {
        if (!cancelled) { setPost(null); setLoading(false); }
        return;
      }

      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .eq("post_id", row.id);

      if (!cancelled) {
        setPost(mapPost(row, tasksData ?? []));
        setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [dateSlug]);

  return { post, loading, error };
}

export async function updatePostReview(
  postId: string,
  selfAssessment: PostSelfAssessment,
  status: string,
) {
  const { error } = await supabase
    .from("posts")
    .update({
      self_assessment: selfAssessment,
      status,
    })
    .eq("id", postId);

  if (error) throw error;
}
