import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface DailyStat {
  date: string;
  score: number;
  tasksCompleted: number;
  hoursLogged: number;
  areasTouched: string[];
}

export function useDailyStats() {
  const [stats, setStats] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      const { data, error: err } = await supabase
        .from("daily_stats")
        .select("*")
        .order("date", { ascending: false });

      if (cancelled) return;

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }

      const mapped = (data ?? []).map((row: any) => ({
        date: row.date ?? "",
        score: row.score ?? row.founder_score ?? 0,
        tasksCompleted: row.tasks_completed ?? 0,
        hoursLogged: row.hours_logged ?? row.hours ?? 0,
        areasTouched: row.areas_touched ?? [],
      }));

      setStats(mapped);
      setLoading(false);
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}
