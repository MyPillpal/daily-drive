import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Idea {
  id: string;
  text: string;
  date: string;
  isPublic: boolean;
  tags: string[];
}

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      const { data, error: err } = await supabase
        .from("ideas")
        .select("*")
        .order("date", { ascending: false });

      if (cancelled) return;

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }

      const mapped = (data ?? []).map((row: any) => ({
        id: row.id,
        text: row.text ?? "",
        date: row.date ?? "",
        isPublic: row.is_public ?? true,
        tags: row.tags ?? [],
      }));

      setIdeas(mapped);
      setLoading(false);
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  const addIdea = useCallback(
    async (text: string, tags: string[] = [], visibility: "public" | "private" = "public") => {
      const newRow = {
        text,
        date: new Date().toISOString().slice(0, 10),
        is_public: visibility === "public",
        tags,
      };

      const { data, error: err } = await supabase
        .from("ideas")
        .insert(newRow)
        .select()
        .single();

      if (err) {
        console.error("Failed to insert idea:", err);
        // Optimistic fallback
        const fallback: Idea = {
          id: `i-${Date.now()}`,
          text,
          date: newRow.date,
          isPublic: newRow.is_public,
          tags,
        };
        setIdeas((prev) => [fallback, ...prev]);
        return;
      }

      setIdeas((prev) => [
        {
          id: data.id,
          text: data.text,
          date: data.date,
          isPublic: data.is_public ?? true,
          tags: data.tags ?? [],
        },
        ...prev,
      ]);
    },
    [],
  );

  return { ideas, loading, error, addIdea };
}
