"use client";

import Link from "next/link";
import {
  ShoppingCart, Plus, CheckCircle, Package, Archive, Truck, Download,
  Box, RefreshCw, ArrowLeftRight, BarChart, BarChart2, FileText, DollarSign,
  ClipboardList, Receipt, Users, PlusSquare, TrendingUp, TrendingDown,
  Settings, Settings2, ArrowRight,
} from "lucide-react";
import { useRoleStore } from "@/store/role.store";
import { ROLE_LABELS, ROLE_COLORS } from "@/constants/roles";
import { getMenuForRole, MenuIcon } from "@/constants/roleMenus";
import { ReminderPortlet } from "@/components/shared/ReminderPortlet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<MenuIcon, React.ComponentType<{ className?: string }>> = {
  ShoppingCart, Plus, CheckCircle, Package, Archive, Truck, Download,
  Box, RefreshCw, ArrowLeftRight, BarChart, BarChart2, FileText, DollarSign,
  ClipboardList, Receipt, LayoutDashboard: BarChart, Users, PlusSquare,
  TrendingUp, TrendingDown, Settings, Settings2,
};

const QUICK_LINK_PALETTE = [
  { card: "bg-blue-50 border-blue-200/80 hover:bg-blue-100/80 hover:border-blue-300", icon: "bg-blue-500 text-white", label: "text-blue-900", arrow: "text-blue-500" },
  { card: "bg-violet-50 border-violet-200/80 hover:bg-violet-100/80 hover:border-violet-300", icon: "bg-violet-500 text-white", label: "text-violet-900", arrow: "text-violet-500" },
  { card: "bg-amber-50 border-amber-200/80 hover:bg-amber-100/80 hover:border-amber-300", icon: "bg-amber-500 text-white", label: "text-amber-900", arrow: "text-amber-500" },
  { card: "bg-emerald-50 border-emerald-200/80 hover:bg-emerald-100/80 hover:border-emerald-300", icon: "bg-emerald-500 text-white", label: "text-emerald-900", arrow: "text-emerald-500" },
  { card: "bg-rose-50 border-rose-200/80 hover:bg-rose-100/80 hover:border-rose-300", icon: "bg-rose-500 text-white", label: "text-rose-900", arrow: "text-rose-500" },
  { card: "bg-cyan-50 border-cyan-200/80 hover:bg-cyan-100/80 hover:border-cyan-300", icon: "bg-cyan-600 text-white", label: "text-cyan-900", arrow: "text-cyan-600" },
  { card: "bg-indigo-50 border-indigo-200/80 hover:bg-indigo-100/80 hover:border-indigo-300", icon: "bg-indigo-500 text-white", label: "text-indigo-900", arrow: "text-indigo-500" },
  { card: "bg-orange-50 border-orange-200/80 hover:bg-orange-100/80 hover:border-orange-300", icon: "bg-orange-500 text-white", label: "text-orange-900", arrow: "text-orange-500" },
];

const ROLE_DESCRIPTIONS: Record<string, string> = {
  SALES_REP: "Create and manage sales orders for customers.",
  SALES_MANAGER: "Review and approve pending sales orders.",
  INVENTORY_MANAGER: "Handle fulfillment, receiving, and inventory operations.",
  AR_ANALYST: "Invoice shipped orders and process customer payments.",
  PURCHASING_MANAGER: "Create purchase orders and manage vendor relationships.",
  AP_ANALYST: "Process vendor bills, 3-way match, and bill payments.",
  ACCOUNTING_MANAGER: "Approve standalone bills and oversee AP workflows.",
  CEO_CFO: "Strategic oversight of items and reporting.",
};

export default function DashboardPage() {
  const activeRole = useRoleStore((s) => s.activeRole);
  const colors = ROLE_COLORS[activeRole];
  const quickLinks = getMenuForRole(activeRole).filter((m) => m.href !== "/").slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl gradient-primary p-7 lg:p-9 text-white shadow-lg shadow-primary/20">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative">
          <p className="text-white/70 text-base font-medium">Welcome!</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mt-1">
            {ROLE_LABELS[activeRole]} Dashboard
          </h1>
          <p className="text-white/80 mt-3 text-base lg:text-lg max-w-2xl leading-relaxed">
            {ROLE_DESCRIPTIONS[activeRole]}
          </p>
          <div className="flex items-center gap-2.5 mt-5">
            <span className={cn("h-3 w-3 rounded-full ring-2 ring-white/30", colors.dot)} />
            <span className="text-sm text-white/70">{ROLE_LABELS[activeRole]}</span>
          </div>
        </div>
      </div>

      <ReminderPortlet />

      <Card className="border-0 shadow-sm ring-1 ring-border/50">
        <CardHeader className="pb-4 px-7 pt-7">
          <CardTitle className="text-lg font-semibold">Quick Access</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-7 px-7">
          {quickLinks.map((link, index) => {
            const palette = QUICK_LINK_PALETTE[index % QUICK_LINK_PALETTE.length];
            const Icon = ICON_MAP[link.icon];

            return (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-4 transition-all group shadow-sm",
                  palette.card
                )}
              >
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm", palette.icon)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn("font-semibold text-sm flex-1 leading-snug", palette.label)}>
                  {link.label}
                </span>
                <ArrowRight className={cn("h-5 w-5 shrink-0 group-hover:translate-x-0.5 transition-all", palette.arrow)} />
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
