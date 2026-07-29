// Minimal, safe-ish markdown renderer for AI outputs (headings, bold, italics,
// inline code, lists, code blocks, links). No dangerouslySetInnerHTML.
import { Fragment, type ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex =
    /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2]) parts.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[4]) parts.push(<em key={key++}>{m[4]}</em>);
    else if (m[6])
      parts.push(
        <code key={key++} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
          {m[6]}
        </code>,
      );
    else if (m[8])
      parts.push(
        <a
          key={key++}
          href={m[9]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline underline-offset-2 hover:opacity-80"
        >
          {m[8]}
        </a>,
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(
        <pre
          key={key++}
          className="my-3 overflow-x-auto rounded-lg border bg-muted/60 p-3 font-mono text-xs"
        >
          <code>{buf.join("\n")}</code>
        </pre>,
      );
      continue;
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const text = h[2];
      const cls =
        level <= 2
          ? "mt-4 mb-2 text-lg font-bold"
          : level === 3
            ? "mt-3 mb-1 text-base font-semibold"
            : "mt-2 mb-1 text-sm font-semibold";
      out.push(
        <div key={key++} className={cls}>
          {renderInline(text)}
        </div>,
      );
      i++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      out.push(
        <ul key={key++} className="my-2 list-disc space-y-1 pl-5">
          {buf.map((b, j) => (
            <li key={j}>{renderInline(b)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      out.push(
        <ol key={key++} className="my-2 list-decimal space-y-1 pl-5">
          {buf.map((b, j) => (
            <li key={j}>{renderInline(b)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    if (line.trim() === "") {
      out.push(<div key={key++} className="h-2" />);
      i++;
      continue;
    }
    out.push(
      <p key={key++} className="my-1 leading-relaxed">
        {renderInline(line)}
      </p>,
    );
    i++;
  }
  return <Fragment>{out}</Fragment>;
}
