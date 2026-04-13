import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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

function mapRow(row: any): Post {
  return {
    id: row.id,
    dateRaw: row.date_raw ?? row.date ?? "",
    date: row.date_display ?? row.date ?? "",
    dayOfWeek: row.day_of_week ?? "",
    founderScore: row.founder_score ?? 0,
    hours: row.hours ?? 0,
    impact: row.impact ?? 0,
    tasksCompleted: row.tasks_completed ?? 0,
    preview: row.preview ?? "",
    tags: row.tags ?? [],
    tasks: (row.tasks ?? []).map((t: any) => ({
      id: t.id ?? "",
      externalId: t.external_id ?? t.externalId ?? "",
      name: t.name ?? "",
      completed: t.completed ?? false,
    })),
    gistBullets: row.gist_bullets ?? [],
    reflection: row.reflection ?? "",
    sections: (row.sections ?? []).map((s: any) => ({
      category: s.category ?? "",
      title: s.title ?? "",
      hours: s.hours ?? 0,
      content: s.content ?? [],
      taskRefs: s.task_refs ?? s.taskRefs ?? [],
      nextSteps: s.next_steps ?? s.nextSteps ?? undefined,
    })),
    selfAssessment: row.self_assessment
      ? {
          difficulty: row.self_assessment.difficulty ?? 5,
          wentWell: row.self_assessment.went_well ?? row.self_assessment.wentWell ?? "",
          improve: row.self_assessment.improve ?? "",
          tomorrow: row.self_assessment.tomorrow ?? "",
        }
      : { difficulty: 5, wentWell: "", improve: "", tomorrow: "" },
    scoreBreakdown: row.score_breakdown
      ? {
          tasks: row.score_breakdown.tasks ?? 0,
          hours: row.score_breakdown.hours ?? 0,
          notes: row.score_breakdown.notes ?? 0,
          variety: row.score_breakdown.variety ?? 0,
          photos: row.score_breakdown.photos ?? 0,
        }
      : null,
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
      const { data, error: err } = await supabase
        .from("posts")
        .select("*")
        .order("date_raw", { ascending: false });

      if (cancelled) return;

      if (err) {
        // Try alternate column name
        const { data: data2, error: err2 } = await supabase
          .from("posts")
          .select("*")
          .order("date", { ascending: false });

        if (cancelled) return;
        if (err2) {
          setError(err2.message);
          setLoading(false);
          return;
        }
        setPosts((data2 ?? []).map(mapRow));
        setLoading(false);
        return;
      }

      setPosts((data ?? []).map(mapRow));
      setLoading(false);
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
      // Try date_raw first, then date
      let { data, error: err } = await supabase
        .from("posts")
        .select("*")
        .eq("date_raw", dateSlug)
        .maybeSingle();

      if (!data && !err) {
        const res = await supabase
          .from("posts")
          .select("*")
          .eq("date", dateSlug)
          .maybeSingle();
        data = res.data;
        err = res.error;
      }

      if (cancelled) return;

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }

      setPost(data ? mapRow(data) : null);
      setLoading(false);
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
      self_assessment: {
        difficulty: selfAssessment.difficulty,
        went_well: selfAssessment.wentWell,
        improve: selfAssessment.improve,
        tomorrow: selfAssessment.tomorrow,
      },
      status,
    })
    .eq("id", postId);

  if (error) {
    console.error("updatePostReview failed:", error);
    throw error;
  }
}
