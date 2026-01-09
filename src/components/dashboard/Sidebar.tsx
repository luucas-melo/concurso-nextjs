"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Bell,
  Settings,
  LogOut,
  Plus,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";
import { toast } from "sonner";
import { useTransition } from "react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userEmail?: string;
}

const Sidebar = ({ isCollapsed, onToggle, userEmail }: SidebarProps) => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Meus Concursos", path: "/dashboard/exams" },
    { icon: Bell, label: "Alertas", path: "/dashboard/alerts" },
    { icon: Settings, label: "Configurações", path: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logout();
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                C
              </span>
            </div>
            <span className="font-display font-bold text-lg">
              ConcursoTrack
            </span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "p-2 rounded-lg hover:bg-secondary transition-colors",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* New Exam Button */}
      <div className="p-4">
        <Link href="/dashboard/exams/new">
          <Button
            variant="hero"
            className={cn("w-full", isCollapsed && "px-0")}
          >
            <Plus className="w-5 h-5" />
            {!isCollapsed && <span>Novo Concurso</span>}
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border">
        {!isCollapsed && userEmail && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-muted-foreground truncate">
              {userEmail}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          disabled={isPending}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>{isPending ? "Saindo..." : "Sair"}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
