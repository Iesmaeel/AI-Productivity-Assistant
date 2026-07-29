import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell, Disclaimer } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Trash2, Sparkles, Pencil, Check, X } from "lucide-react";
import { chatReply } from "@/lib/ai.functions";
import { Markdown } from "@/lib/markdown";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Mr. AI" },
      {
        name: "description",
        content: "A focused AI chat assistant for research, ideas, and answers. Edit messages and refine replies.",
      },
      { property: "og:title", content: "AI Chat — Mr. AI" },
      { property: "og:description", content: "Have a focused conversation with Mr. AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const send = useServerFn(chatReply);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.content }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reach AI");
      setMessages(next);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const clear = () => {
    setMessages([]);
    setEditingIdx(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditValue(messages[idx].content);
  };

  const saveEdit = () => {
    if (editingIdx == null) return;
    const updated = messages.map((m, i) => (i === editingIdx ? { ...m, content: editValue } : m));
    setMessages(updated);
    setEditingIdx(null);
  };

  return (
    <AppShell title="AI Chat" description="Focused, editable conversations with Mr. AI">
      <Card className="flex h-[calc(100vh-10rem)] flex-col overflow-hidden shadow-card">
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-brand">
              <Sparkles className="h-3.5 w-3.5 text-brand-foreground" />
            </div>
            Mr. AI Assistant
          </div>
          <Button variant="ghost" size="sm" onClick={clear} disabled={messages.length === 0}>
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Clear
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div className="max-w-sm">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand shadow-elegant">
                  <Sparkles className="h-6 w-6 text-brand-foreground" />
                </div>
                <h3 className="mt-3 text-base font-semibold">How can I help today?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask a question, brainstorm ideas, or paste text to summarize.
                </p>
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`group flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {editingIdx === i ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={4}
                        className="bg-background text-foreground"
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setEditingIdx(null)}>
                          <X className="mr-1 h-3.5 w-3.5" /> Cancel
                        </Button>
                        <Button size="sm" onClick={saveEdit}>
                          <Check className="mr-1 h-3.5 w-3.5" /> Save
                        </Button>
                      </div>
                    </div>
                  ) : m.role === "assistant" ? (
                    <Markdown content={m.content} />
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                  {editingIdx !== i && (
                    <button
                      onClick={() => startEdit(i)}
                      className={`mt-2 inline-flex items-center gap-1 text-[11px] opacity-0 transition-opacity group-hover:opacity-70 hover:!opacity-100 ${
                        m.role === "user" ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-3">
          <CardContent className="p-0">
            <div className="flex items-end gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder="Message Mr. AI…  (Shift + Enter for newline)"
                rows={2}
                className="resize-none"
                maxLength={4000}
              />
              <Button
                onClick={submit}
                disabled={loading || !input.trim()}
                className="h-10 bg-gradient-brand text-brand-foreground shadow-elegant hover:opacity-95"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
      <Disclaimer />
    </AppShell>
  );
}
