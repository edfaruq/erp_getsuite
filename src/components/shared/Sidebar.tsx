"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart, Plus, CheckCircle, Package, Archive, Truck, Download,
  Box, RefreshCw, ArrowLeftRight, BarChart, BarChart2, FileText, DollarSign,
  ClipboardList, Receipt, LayoutDashboard, Users, PlusSquare, TrendingUp,
  TrendingDown, Settings, Settings2, Warehouse,
} from "lucide-react";
import { useRoleStore } from "@/store/role.store";
import { getMenuForRole } from "@/constants/roleMenus";
import { MenuIcon } from "@/constants/roleMenus";
import { RoleSwitcher } from "@/components/shared/RoleSwitcher";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<MenuIcon, React.ComponentType<{ className?: string }>> = {
  ShoppingCart, Plus, CheckCircle, Package, Archive, Truck, Download,
  Box, RefreshCw, ArrowLeftRight, BarChart, BarChart2, FileText, DollarSign,
  ClipboardList, Receipt, LayoutDashboard, Users, PlusSquare, TrendingUp,
  TrendingDown, Settings, Settings2, Warehouse,
};

function menuPath(href: string) {
  return href.split("?")[0];
}

export function Sidebar() {
  const pathname = usePathname();
  const activeRole = useRoleStore((s) => s.activeRole);
  const menuItems = getMenuForRole(activeRole);

  return (
    <aside className="w-72 shrink-0 bg-[hsl(var(--sidebar))] flex flex-col border-r border-[hsl(var(--sidebar-border))]">
      <div className="px-5 py-6 border-b border-[hsl(var(--sidebar-border))]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--sidebar-muted))]">
          Active Role
        </p>
        <RoleSwitcher variant="sidebar" />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--sidebar-muted))]">
          Navigation
        </p>
        {menuItems.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const basePath = menuPath(item.href);
          const isActive =
            pathname === basePath || (basePath !== "/" && pathname.startsWith(basePath));

          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all duration-150",
                isActive
                  ? "bg-[hsl(var(--sidebar-accent))] text-white shadow-md"
                  : "text-[hsl(var(--sidebar-muted))] hover:bg-white/5 hover:text-[hsl(var(--sidebar-foreground))]"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-[hsl(var(--sidebar-muted))] group-hover:text-white/80"
                )}
              />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
