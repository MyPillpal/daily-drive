import { useState } from "react";
import { MOCK_DAILY_STATS } from "@/data/mock-data";

export interface DailyStat {
  date: string;
  score: number;
  tasksCompleted: number;
  hoursLogged: number;
  areasTouched: string[];
}

export function useDailyStats() {
  const [stats] = useState<DailyStat[]>(MOCK_DAILY_STATS);
  return { stats, loading: false, error: null };
}
