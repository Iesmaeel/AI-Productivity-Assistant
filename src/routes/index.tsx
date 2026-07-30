import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ListChecks, MessageSquare, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import mrAiBackgroundLogo from "@/assets/mr-ai-background-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mr. AI — Your intelligent workspace" },
      {
        name: "description",
        content:
          "Mr. AI is a modern AI workspace with a smart email generator, task planner, and chat assistant. Draft, plan, and think — faster.",
      },
      { property: "og:title", content: "Mr. AI — Your intelligent workspace" },
      {
        property: "og:description",
        content:
          "Smart email generator, AI task planner, and chat assistant in one clean, modern dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Draft polished, on-tone emails in seconds.",
    href: "/email",
    icon: Mail,
  },
  {
    title: "AI Task Planner",
    description: "Break any goal into a clear, prioritized plan.",
    href: "/tasks",
    icon: ListChecks,
  },
  {
    title: "AI Chat",
    description: "A focused assistant for research, ideas, and answers.",
    href: "/chat",
    icon: MessageSquare,
  },
] as const;

const stats = [
  { label: "AI Tools", value: "3", icon: Sparkles },
  { label: "Avg. draft time", value: "~4s", icon: Zap },
  { label: "Privacy", value: "First-class", icon: Shield },
];

function Dashboard() {
  return (
    <AppShell title="Dashboard" description="Welcome back to Mr. AI">
      <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-card sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
        <img
          src={mrAiBackgroundLogo.url}
          alt="Mr. AI background"
          width={1792}
          height={1024}
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-2/3 object-cover object-right opacity-90 dark:opacity-70 lg:block"
        />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            Powered by Lovable AI
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Meet <span className="text-gradient-brand">Mr. AI</span> — your intelligent workspace.
          </h2>
          <p className="mt-3 text-sm text-brand-light sm:text-base">
            {"\n"}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-brand text-brand-foreground shadow-elegant hover:opacity-95">
              <Link to="/email">
                Try Email Generator <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/chat">Open AI Chat</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent">
                <s.icon className="h-5 w-5 text-brand" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="truncate text-lg font-semibold">{s.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.href}
            to={t.href}
            className="group focus:outline-none"
          >
            <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-elegant">
              <CardHeader>
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-elegant">
                  <t.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="inline-flex items-center gap-1 text-sm font-medium text-brand">
                  Launch <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="mt-8 rounded-xl border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">Responsible AI Notice:</strong>{" "}
        Mr. AI uses generative models that can produce inaccurate or biased results. Always review
        outputs before using them in high-stakes contexts. Do not enter confidential, medical,
        legal, or personally identifiable information.
      </section>
    </AppShell>
  );
}
