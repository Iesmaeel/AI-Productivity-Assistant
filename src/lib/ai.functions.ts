import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

async function callAI(messages: Array<{ role: string; content: string }>) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402)
      throw new Error("AI credits exhausted. Please add credits to your Lovable workspace.");
    throw new Error(`AI request failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

const EmailInput = z.object({
  recipient: z.string().min(1),
  purpose: z.string().min(1),
  tone: z.string().min(1),
  keyPoints: z.string().optional().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are Mr. AI, a professional email writing assistant. Generate a well-structured, polished email. Return ONLY the email content with a "Subject:" line first, then a blank line, then the body. No preamble, no markdown fences, no explanations.`;
    const user = `Write an email with the following specifications.

Recipient: ${data.recipient}
Purpose: ${data.purpose}
Tone: ${data.tone}
Key points to include: ${data.keyPoints || "(none specified)"}

Format:
Subject: <compelling subject line>

<Greeting>,

<Body paragraphs — clear, concise, professional>

<Sign-off>,
[Your Name]`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

const TaskInput = z.object({
  goal: z.string().min(1),
  deadline: z.string().optional().default(""),
  context: z.string().optional().default(""),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TaskInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are Mr. AI, an expert project planner. Break down goals into clear, actionable tasks. Respond in Markdown with a numbered list. Each task must have: a **bold title**, a one-sentence description, an estimated duration, and a priority (High/Medium/Low). End with a short "Next Steps" section.`;
    const user = `Goal: ${data.goal}
Deadline: ${data.deadline || "flexible"}
Context: ${data.context || "(none)"}

Create a structured action plan of 5-8 tasks.`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are Mr. AI — a helpful, concise, professional assistant. Format answers in clean Markdown. Use short paragraphs, headings when helpful, and bullet lists for enumerations. Be friendly but not chatty.`;
    const content = await callAI([{ role: "system", content: system }, ...data.messages]);
    return { content };
  });
