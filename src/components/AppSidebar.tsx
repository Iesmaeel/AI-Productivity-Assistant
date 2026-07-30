import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, ListChecks, MessageSquare, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Task Planner", url: "/tasks", icon: ListChecks },
  { title: "AI Chat", url: "/chat", icon: MessageSquare },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
            <div className="absolute h-8 w-8 rotate-3 rounded-lg bg-brand-glow/50 blur-[2px]" />
            <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand shadow-elegant">
              <Sparkles className="h-5 w-5 text-brand-foreground" />
            </div>
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-bold tracking-tight text-sidebar-foreground">
              Mr. <span className="text-sidebar-primary">AI</span>
            </div>
            <div className="truncate text-xs text-sidebar-foreground/60">Intelligent workspace</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "rounded-xl transition-all duration-200",
                        active &&
                          "border border-sidebar-primary/20 bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_0_15px_-5px_color-mix(in_oklab,var(--sidebar-primary)_30%,transparent)]",
                      )}
                    >
                      <Link to={item.url}>
                        <item.icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            active ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover/menu-button:text-sidebar-primary",
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2 text-[11px] leading-relaxed text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
          AI inputs and outputs are editable. Outputs may be inaccurate — review
          before use, and avoid entering sensitive information.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
