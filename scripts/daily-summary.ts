import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

// --- Config ---

const APPDATA = process.env.APPDATA || "";
const USERPROFILE = process.env.USERPROFILE || "";

const COWORK_DIR = path.join(APPDATA, "Claude", "local-agent-mode-sessions");
const CLAUDE_CODE_DIR = path.join(USERPROFILE, ".claude", "projects");
const EXPORT_DIR = path.join(process.cwd(), "claude-exports");

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// --- Types ---

interface RawMessage {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  source: string;
}

interface DailyLog {
  date: string;
  parent_summary: {
    preview: string;
    gist_bullets: string[];
    reflection: string;
  };
  devlog_sections: {
    category: string;
    title: string;
    hours: number;
    content: string[];
    task_refs: string[];
    next_steps?: string[];
  }[];
  founder_score: number;
  hours_logged: number;
  impact_rating: number;
  tasks_completed: number;
  tags: string[];
  self_assessment: {
    difficulty: number;
    wentWell: string;
    improve: string;
    tomorrow: string;
  };
  score_breakdown: {
    tasks: number;
    hours: number;
    notes: number;
    variety: number;
    photos: number;
  };
  tasks: { external_id: string; name: string; status: string }[];
}

// --- File walking ---

function walkFiles(dir: string, pattern: RegExp): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  function walk(d: string) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (pattern.test(entry.name)) results.push(full);
    }
  }

  walk(dir);
  return results;
}

// --- Parsers ---

function extractTextFromContent(content: any): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((c: any) => c.type === "text" && c.text)
      .map((c: any) => c.text)
      .join("\n");
  }
  return "";
}

function readCoworkSessions(targetDate: string): RawMessage[] {
  const files = walkFiles(COWORK_DIR, /^audit\.jsonl$/);
  const messages: RawMessage[] = [];

  for (const file of files) {
    const lines = fs.readFileSync(file, "utf-8").split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        const ts = entry._audit_timestamp || "";
        if (!ts.startsWith(targetDate)) continue;
        if (entry.type !== "user" && entry.type !== "assistant") continue;

        const text = extractTextFromContent(entry.message?.content);
        if (!text || text.length < 10) continue;

        messages.push({
          role: entry.type as "user" | "assistant",
          text: text.slice(0, 3000),
          timestamp: ts,
          source: "cowork",
        });
      } catch {}
    }
  }

  return messages;
}

function readClaudeCodeSessions(targetDate: string): RawMessage[] {
  const files = walkFiles(CLAUDE_CODE_DIR, /\.jsonl$/);
  const messages: RawMessage[] = [];

  for (const file of files) {
    if (file.includes("subagents")) continue;

    const lines = fs.readFileSync(file, "utf-8").split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        const ts = entry.timestamp || "";
        if (!ts.startsWith(targetDate)) continue;
        if (entry.type !== "user" && entry.type !== "assistant") continue;

        const text = extractTextFromContent(entry.message?.content);
        if (!text || text.length < 10) continue;

        messages.push({
          role: entry.type as "user" | "assistant",
          text: text.slice(0, 3000),
          timestamp: ts,
          source: "claude-code",
        });
      } catch {}
    }
  }

  return messages;
}

function readClaudeExport(targetDate: string): RawMessage[] {
  if (!fs.existsSync(EXPORT_DIR)) return [];

  const messages: RawMessage[] = [];
  const jsonFiles = fs.readdirSync(EXPORT_DIR).filter((f) => f.endsWith(".json"));

  for (const file of jsonFiles) {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(EXPORT_DIR, file), "utf-8"));
      const conversations = Array.isArray(raw) ? raw : [];

      for (const conv of conversations) {
        const chatMessages = conv.chat_messages || [];
        for (const msg of chatMessages) {
          const ts = msg.created_at || "";
          if (!ts.startsWith(targetDate)) continue;

          const role = msg.sender === "human" ? "user" : "assistant";
          const text = typeof msg.text === "string" ? msg.text : "";
          if (!text || text.length < 10) continue;

          messages.push({
            role,
            text: text.slice(0, 3000),
            timestamp: ts,
            source: `export:${conv.name || conv.uuid || "unknown"}`,
          });
        }
      }
    } catch {}
  }

  return messages;
}

// --- Summarization ---

function buildTranscript(messages: RawMessage[]): string {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  let currentSource = "";
  const parts: string[] = [];

  for (const msg of sorted) {
    if (msg.source !== currentSource) {
      currentSource = msg.source;
      parts.push(`\n--- Session: ${currentSource} ---\n`);
    }
    const label = msg.role === "user" ? "ME" : "CLAUDE";
    parts.push(`[${label}]: ${msg.text}\n`);
  }

  return parts.join("\n");
}

async function summarize(messages: RawMessage[], targetDate: string): Promise<DailyLog> {
  const transcript = buildTranscript(messages);

  const maxChars = 180_000;
  const truncated =
    transcript.length > maxChars
      ? transcript.slice(0, maxChars) + "\n\n[...transcript truncated for length...]"
      : transcript;

  const prompt = `You are analyzing a founder's Claude AI conversations from ${targetDate} to generate a structured daily log entry.

Here are all the conversations from that day:

<transcript>
${truncated}
</transcript>

Based on these conversations, generate a JSON object representing a daily log entry. Analyze what the founder worked on, what they accomplished, what decisions were made, and what topics were discussed.

Rules:
- Focus on substantive work conversations. Ignore trivial exchanges, greetings, or test messages.
- Categorize work into sections like "Hardware", "Software", "Business", "Design", "Research", "Personal", etc. based on the actual content.
- The founder_score (0-100) should reflect productivity level based on depth and breadth of work discussed.
- hours_logged should be your best estimate based on conversation timestamps and depth.
- Extract any task-like items mentioned (things completed, things to do).
- The reflection should be a natural-sounding end-of-day thought.
- Be specific — reference actual topics, decisions, and outcomes from the conversations.

Return ONLY valid JSON matching this exact schema (no markdown, no backticks, no explanation):

{
  "parent_summary": {
    "preview": "One-line summary of the day",
    "gist_bullets": ["3-6 key bullet points about what happened"],
    "reflection": "A natural end-of-day reflection paragraph"
  },
  "devlog_sections": [
    {
      "category": "Category name",
      "title": "Section title",
      "hours": 1.5,
      "content": ["Paragraph 1 about what was done", "Paragraph 2 with details"],
      "task_refs": ["TASK-ID"],
      "next_steps": ["What to do next"]
    }
  ],
  "founder_score": 72,
  "hours_logged": 6.5,
  "impact_rating": 7,
  "tasks_completed": 5,
  "tags": ["tag1", "tag2"],
  "self_assessment": {
    "difficulty": 7,
    "wentWell": "What went well",
    "improve": "What to improve",
    "tomorrow": "Plans for tomorrow"
  },
  "score_breakdown": {
    "tasks": 80,
    "hours": 65,
    "notes": 70,
    "variety": 60,
    "photos": 0
  },
  "tasks": [
    { "external_id": "TASK-001", "name": "Task description", "status": "completed" }
  ]
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const parsed = JSON.parse(text) as Omit<DailyLog, "date">;
  return { date: targetDate, ...parsed };
}

// --- Database writes ---

async function writeToDB(log: DailyLog): Promise<void> {
  const { data: existing } = await supabase
    .from("posts")
    .select("id")
    .eq("date", log.date)
    .limit(1);

  const postPayload = {
    date: log.date,
    parent_summary: log.parent_summary,
    devlog_sections: log.devlog_sections,
    founder_score: log.founder_score,
    hours_logged: log.hours_logged,
    impact_rating: log.impact_rating,
    tasks_completed: log.tasks_completed,
    tags: log.tags,
    status: "draft",
    self_assessment: log.self_assessment,
    score_breakdown: log.score_breakdown,
  };

  let postId: string;

  if (existing && existing.length > 0) {
    postId = existing[0].id;
    const { error } = await supabase
      .from("posts")
      .update(postPayload)
      .eq("id", postId);
    if (error) throw new Error(`Failed to update post: ${error.message}`);
    console.log(`  Updated existing post ${postId}`);
  } else {
    const { data, error } = await supabase
      .from("posts")
      .insert(postPayload)
      .select("id")
      .single();
    if (error) throw new Error(`Failed to insert post: ${error.message}`);
    postId = data.id;
    console.log(`  Created new post ${postId}`);
  }

  if (log.tasks.length > 0) {
    const taskPayloads = log.tasks.map((t) => ({
      external_id: t.external_id,
      name: t.name,
      status: t.status,
      date: log.date,
      post_id: postId,
    }));

    const { error } = await supabase.from("tasks").upsert(taskPayloads, {
      onConflict: "external_id",
      ignoreDuplicates: true,
    });
    if (error) console.warn(`  Warning: task upsert issue: ${error.message}`);
    else console.log(`  Wrote ${log.tasks.length} tasks`);
  }

  const statsPayload = {
    date: log.date,
    founder_score: log.founder_score,
    tasks_completed: log.tasks_completed,
    hours_logged: log.hours_logged,
    areas_touched: log.tags,
  };

  const { error: statsErr } = await supabase
    .from("daily_stats")
    .upsert(statsPayload, { onConflict: "date" });
  if (statsErr) console.warn(`  Warning: daily_stats upsert issue: ${statsErr.message}`);
  else console.log(`  Wrote daily_stats`);
}

// --- Main ---

async function main() {
  const targetDate = process.argv[2] || new Date().toISOString().split("T")[0];

  console.log(`\n📋 Daily Summary Pipeline — ${targetDate}\n`);
  console.log("Reading conversations...");

  const coworkMsgs = readCoworkSessions(targetDate);
  console.log(`  Cowork sessions: ${coworkMsgs.length} messages`);

  const codeMsgs = readClaudeCodeSessions(targetDate);
  console.log(`  Claude Code sessions: ${codeMsgs.length} messages`);

  const exportMsgs = readClaudeExport(targetDate);
  console.log(`  Export files: ${exportMsgs.length} messages`);

  const allMessages = [...coworkMsgs, ...codeMsgs, ...exportMsgs];
  console.log(`  Total: ${allMessages.length} messages\n`);

  if (allMessages.length === 0) {
    console.log("No conversations found for this date. Nothing to do.");
    process.exit(0);
  }

  console.log("Summarizing via Anthropic API...");
  const log = await summarize(allMessages, targetDate);
  console.log(`  Score: ${log.founder_score} | Hours: ${log.hours_logged} | Tasks: ${log.tasks_completed}`);
  console.log(`  Preview: ${log.parent_summary.preview}\n`);

  console.log("Writing to Supabase...");
  await writeToDB(log);

  console.log("\nDone!\n");
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
