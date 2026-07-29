import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell, Disclaimer } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ListChecks, Loader2, Copy, RefreshCw } from "lucide-react";
import { planTasks } from "@/lib/ai.functions";
import { Markdown } from "@/lib/markdown";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Mr. AI" },
      {
        name: "description",
        content: "Turn any goal into a clear, prioritized action plan with Mr. AI's task planner.",
      },
      { property: "og:title", content: "AI Task Planner — Mr. AI" },
      { property: "og:description", content: "Structured, prioritized plans in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const plan = useServerFn(planTasks);
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!goal.trim()) {
      toast.error("Please describe your goal.");
      return;
    }
    setLoading(true);
    try {
      const res = await plan({ data: { goal, deadline, context } });
      setOutput(res.content);
      setEditing(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <AppShell title="AI Task Planner" description="Break any goal into a prioritized action plan">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="h-4 w-4 text-brand" /> Plan brief
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="goal">Goal</Label>
              <Textarea
                id="goal"
                placeholder="e.g. Launch a product waitlist landing page"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={3}
                maxLength={1000}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deadline">Deadline (optional)</Label>
              <Input
                id="deadline"
                placeholder="e.g. In 2 weeks"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="context">Context (optional)</Label>
              <Textarea
                id="context"
                placeholder="Team size, constraints, existing assets…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={4}
                maxLength={2000}
              />
            </div>
            <Button
              onClick={submit}
              disabled={loading}
              className="w-full bg-gradient-brand text-brand-foreground shadow-elegant hover:opacity-95"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Planning…
                </>
              ) : (
                <>Generate Plan</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Your action plan</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing((e) => !e)}
                disabled={!output}
              >
                {editing ? "Preview" : "Edit"}
              </Button>
              <Button variant="outline" size="sm" onClick={submit} disabled={loading || !output}>
                <RefreshCw className="mr-1 h-3.5 w-3.5" /> Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
                <Copy className="mr-1 h-3.5 w-3.5" /> Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!output ? (
              <div className="grid place-items-center rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                Your structured plan will appear here.
              </div>
            ) : editing ? (
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                rows={22}
                className="font-mono text-sm"
              />
            ) : (
              <div className="prose-sm max-w-none rounded-lg border bg-background p-4 text-sm">
                <Markdown content={output} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Disclaimer />
    </AppShell>
  );
}
