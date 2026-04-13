import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export interface Idea {
  id: string;
  text: string;
  date: string;
  isPublic: boolean;
  tags: string[];
}

function mapIdea(row: any): Idea {
  return {
    id: row.id,
    text: row.text ?? "",
    date: row.date ?? "",
    isPublic: row.visibility === "public",
    tags: row.tags ?? [],
  };
}

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("ideas")
      .select("*")
      .order("date", { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setIdeas((data ?? []).map(mapIdea));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const addIdea = useCallback(
    async (text: string, tags: string[] = [], visibility: "public" | "private" = "public") => {
      const today = format(new Date(), "yyyy-MM-dd");
      const { error: err } = await supabase.from("ideas").insert({
        text,
        tags,
        visibility,
        date: today,
      });

      if (err) throw err;
      await fetchIdeas();
    },
    [fetchIdeas],
  );

  return { ideas, loading, error, addIdea };
}
