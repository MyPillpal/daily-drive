import { useState, useCallback } from "react";
import { MOCK_IDEAS } from "@/data/mock-data";

export interface Idea {
  id: string;
  text: string;
  date: string;
  isPublic: boolean;
  tags: string[];
}

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>(MOCK_IDEAS);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const addIdea = useCallback(
    async (text: string, tags: string[] = [], visibility: "public" | "private" = "public") => {
      const newIdea: Idea = {
        id: `i-${Date.now()}`,
        text,
        date: new Date().toISOString().slice(0, 10),
        isPublic: visibility === "public",
        tags,
      };
      setIdeas((prev) => [newIdea, ...prev]);
    },
    [],
  );

  return { ideas, loading, error, addIdea };
}
