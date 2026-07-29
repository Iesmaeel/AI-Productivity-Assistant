import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-subtle">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold">{title}</h1>
              {description ? (
                <p className="truncate text-xs text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {actions}
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

export function Disclaimer() {
  return (
    <div className="mt-6 rounded-lg border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
      <strong className="font-semibold text-foreground">Responsible AI Notice:</strong>{" "}
      Mr. AI can make mistakes. Outputs are AI-generated suggestions — review, edit, and verify
      before sending, sharing, or acting on them. Do not submit sensitive personal data.
    </div>
  );
}
