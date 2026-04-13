import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Task {
  id: string;
  externalId: string;
  name: string;
  date: string;
  status: string;
  postId: string | null;
}

export function useTasks(postId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      let query = supabase.from("tasks").select("*").order("date", { ascending: false });

      if (postId) {
        query = query.eq("post_id", postId);
      }

      const { data, error: err } = await query;

      if (err) {
        if (!cancelled) { setError(err.message); setLoading(false); }
        return;
      }

      const mapped = (data ?? []).map((row: any) => ({
        id: row.id,
        externalId: row.external_id ?? "",
        name: row.name ?? "",
        date: row.date ?? "",
        status: row.status ?? "",
        postId: row.post_id ?? null,
      }));

      if (!cancelled) { setTasks(mapped); setLoading(false); }
    }

    fetch();
    return () => { cancelled = true; };
  }, [postId]);

  return { tasks, loading, error };
}
