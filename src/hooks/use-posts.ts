import { useState, useEffect } from "react";
import { MOCK_POSTS } from "@/data/mock-data";

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

export function usePosts() {
  const [posts] = useState<Post[]>(MOCK_POSTS);
  return { posts, loading: false, error: null };
}

export function usePost(dateSlug: string) {
  const post = MOCK_POSTS.find((p) => p.dateRaw === dateSlug) ?? null;
  return { post, loading: false, error: null };
}

export async function updatePostReview(
  postId: string,
  selfAssessment: PostSelfAssessment,
  status: string,
) {
  // Mock — no-op
  console.log("updatePostReview (mock)", { postId, selfAssessment, status });
}
