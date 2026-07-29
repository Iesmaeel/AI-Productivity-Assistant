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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Loader2, Copy, RefreshCw } from "lucide-react";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Mr. AI" },
      {
        name: "description",
        content: "Generate polished, professional emails with AI. Choose tone, purpose, and key points.",
      },
      { property: "og:title", content: "Smart Email Generator — Mr. AI" },
      { property: "og:description", content: "Draft on-brand, on-tone emails in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const tones = ["Professional", "Friendly", "Concise", "Persuasive", "Apologetic", "Enthusiastic"];

function EmailPage() {
  const gen = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!recipient.trim() || !purpose.trim()) {
      toast.error("Please fill in recipient and purpose.");
      return;
    }
    setLoading(true);
    try {
      const res = await gen({ data: { recipient, purpose, tone, keyPoints } });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <AppShell title="Smart Email Generator" description="Draft polished emails with structured prompts">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-brand" /> Email brief
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Head of Marketing at Acme Inc."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                placeholder="e.g. Follow up on last week's proposal and propose a meeting."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={3}
                maxLength={1000}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="points">Key points (optional)</Label>
              <Textarea
                id="points"
                placeholder="Bullet key facts, dates, or asks — one per line."
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>Generate Email</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Editable draft</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={submit} disabled={loading || !output}>
                <RefreshCw className="mr-1 h-3.5 w-3.5" /> Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
                <Copy className="mr-1 h-3.5 w-3.5" /> Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your generated email will appear here. You can edit it freely before sending."
              rows={20}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
      <Disclaimer />
    </AppShell>
  );
}
