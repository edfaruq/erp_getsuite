"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ChevronRight, AlertCircle } from "lucide-react";
import { useRoleStore } from "@/store/role.store";
import { AppRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { ReminderItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ReminderConfig = {
  id: string;
  label: string;
  query: string;
  href: string;
  priority?: "high" | "medium" | "low";
};

const ROLE_REMINDER_CONFIG: Record<AppRole, ReminderConfig[]> = {
  SALES_REP: [],
  SALES_MANAGER: [
    { id: "so-approve", label: "Sales Orders to Approve", query: "/api/otc/sales-orders?status=PENDING_APPROVAL", href: ROUTES.approvals, priority: "high" },
  ],
  INVENTORY_MANAGER: [
    { id: "pick", label: "Orders to Pick", query: "/api/otc/sales-orders?status=APPROVED", href: ROUTES.pick, priority: "high" },
    { id: "pack", label: "Orders to Pack", query: "/api/otc/sales-orders?status=PICKING", href: ROUTES.pack },
    { id: "ship", label: "Orders to Ship", query: "/api/otc/sales-orders?status=PACKING", href: ROUTES.ship },
    { id: "receive", label: "POs to Receive", query: "/api/ptp/purchase-orders?status=PENDING_RECEIPT", href: ROUTES.receive, priority: "medium" },
  ],
  AR_ANALYST: [
    { id: "invoice", label: "Sales Orders to Invoice", query: "/api/otc/sales-orders?status=SHIPPED", href: ROUTES.invoices, priority: "high" },
    { id: "open-inv", label: "Open Invoices", query: "/api/otc/invoices?status=OPEN", href: ROUTES.invoices, priority: "medium" },
  ],
  PURCHASING_MANAGER: [
    { id: "po-receipt", label: "POs Pending Receipt", query: "/api/ptp/purchase-orders?status=PENDING_RECEIPT", href: ROUTES.purchaseOrders, priority: "high" },
  ],
  AP_ANALYST: [
    { id: "bills-pay", label: "Bills to Pay", query: "/api/ptp/bills?status=APPROVED", href: ROUTES.billPayments, priority: "high" },
    { id: "bills-pending", label: "Bills Pending Approval", query: "/api/ptp/bills?status=PENDING_APPROVAL", href: ROUTES.bills, priority: "medium" },
  ],
  ACCOUNTING_MANAGER: [
    { id: "bill-approve", label: "Bills to Approve", query: "/api/ptp/bills?status=PENDING_APPROVAL", href: ROUTES.billApprovals, priority: "high" },
  ],
  CEO_CFO: [
    { id: "stock-alerts", label: "Stock Alerts (Below Minimum)", query: "/api/inventory/items?lowStock=true", href: ROUTES.analyzeInventory, priority: "high" },
  ],
};

async function fetchCount(url: string): Promise<number> {
  const res = await fetch(url);
  if (!res.ok) return 0;
  const json = await res.json();
  return (json.data ?? []).length;
}

async function loadRemindersForRole(role: AppRole): Promise<ReminderItem[]> {
  const configs = ROLE_REMINDER_CONFIG[role] ?? [];
  return Promise.all(
    configs.map(async (config) => ({
      id: config.id,
      label: config.label,
      href: config.href,
      priority: config.priority,
      count: await fetchCount(config.query),
    }))
  );
}

export function ReminderPortlet() {
  const activeRole = useRoleStore((s) => s.activeRole);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadRemindersForRole(activeRole).then((items) => {
      if (!cancelled) {
        setReminders(items);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeRole]);

  const totalCount = reminders.reduce((sum, r) => sum + r.count, 0);
  const urgentCount = reminders.filter((r) => r.priority === "high" && r.count > 0).length;

  return (
    <Card className="shadow-md border-0 ring-1 ring-border/50 overflow-hidden">
      <CardHeader className="pb-4 px-7 pt-7 bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="text-lg font-semibold flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <span>Tasks</span>
          {!loading && totalCount > 0 && (
            <Badge className="ml-auto bg-primary hover:bg-primary">{totalCount}</Badge>
          )}
        </CardTitle>
        {!loading && urgentCount > 0 && (
          <p className="text-sm text-amber-600 flex items-center gap-1.5 mt-2">
            <AlertCircle className="h-4 w-4" />
            {urgentCount} urgent task{urgentCount > 1 ? "s" : ""}
          </p>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-5">
        {loading ? (
          <p className="text-base text-muted-foreground px-4 py-6 text-center">Loading tasks...</p>
        ) : reminders.length === 0 ? (
          <p className="text-base text-muted-foreground px-4 py-6 text-center">All caught up!</p>
        ) : (
          <div className="space-y-1">
            {reminders.map((reminder) => (
              <Link
                key={reminder.id}
                href={reminder.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3.5 text-base group transition-all",
                  "hover:bg-accent/60",
                  reminder.priority === "high" && reminder.count > 0 && "bg-amber-50/50 hover:bg-amber-50"
                )}
              >
                <span
                  className={cn(
                    "flex-1 truncate",
                    reminder.priority === "high" && reminder.count > 0 ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {reminder.label}
                </span>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <Badge
                    variant={reminder.count > 0 ? "default" : "secondary"}
                    className={cn(
                      "min-w-[2rem] h-7 text-sm justify-center tabular-nums",
                      reminder.count === 0 && "opacity-40"
                    )}
                  >
                    {reminder.count}
                  </Badge>
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
