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
      setLoading(true);
      const { data, error: err } = await supabase
        .from("daily_stats")
        .select("*")
        .order("date", { ascending: true });

      if (err) {
        if (!cancelled) { setError(err.message); setLoading(false); }
        return;
      }

      const mapped = (data ?? []).map((row: any) => ({
        date: row.date,
        score: row.founder_score ?? 0,
        tasksCompleted: row.tasks_completed ?? 0,
        hoursLogged: row.hours_logged ?? 0,
        areasTouched: row.areas_touched ?? [],
      }));

      if (!cancelled) { setStats(mapped); setLoading(false); }
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}
