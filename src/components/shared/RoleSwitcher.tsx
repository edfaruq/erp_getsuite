"use client";

import { useRouter } from "next/navigation";
import { Users, Check, ChevronDown } from "lucide-react";
import { useRoleStore } from "@/store/role.store";
import { ALL_ROLES, ROLE_LABELS, ROLE_COLORS, AppRole } from "@/constants/roles";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface RoleSwitcherProps {
  variant?: "navbar" | "sidebar";
}

export function RoleSwitcher({ variant = "navbar" }: RoleSwitcherProps) {
  const router = useRouter();
  const { activeRole, setRole } = useRoleStore();
  const roleColors = ROLE_COLORS[activeRole];

  const handleSelect = (role: AppRole) => {
    if (role === activeRole) return;
    setRole(role);
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "sidebar" ? (
          <button
            className="flex items-center gap-2.5 mt-2 w-full text-left rounded-lg px-2 py-2 -mx-2 hover:bg-white/5 transition-colors group"
            aria-label="Ganti role"
          >
            <span className={cn("h-2.5 w-2.5 rounded-full ring-2 ring-white/20 shrink-0", roleColors.dot)} />
            <span className="text-sm font-semibold text-[hsl(var(--sidebar-foreground))] group-hover:text-white flex-1 truncate">
              {ROLE_LABELS[activeRole]}
            </span>
            <ChevronDown className="h-4 w-4 text-[hsl(var(--sidebar-muted))] group-hover:text-white shrink-0" />
          </button>
        ) : (
          <Button
            variant="outline"
            className="gap-3 h-14 px-6 text-base border-primary/20 hover:border-primary/40 hover:bg-primary/5 data-[state=open]:bg-primary/5 data-[state=open]:border-primary/40"
            aria-label="Ganti role"
          >
            <Users className="h-6 w-6 text-primary shrink-0" strokeWidth={2.5} />
            <span className="text-base font-semibold max-w-[220px] truncate">
              {ROLE_LABELS[activeRole]}
            </span>
            <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={variant === "sidebar" ? "start" : "end"}
        className="w-64"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Ganti Role
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ALL_ROLES.map((role) => {
          const colors = ROLE_COLORS[role];
          const isActive = activeRole === role;

          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleSelect(role)}
              className={cn("cursor-pointer gap-3 py-2.5", isActive && colors.bg)}
            >
              <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", colors.dot)} />
              <span className={cn("flex-1 font-medium", isActive ? colors.text : "text-foreground")}>
                {ROLE_LABELS[role]}
              </span>
              {isActive && <Check className={cn("h-4 w-4 shrink-0", colors.text)} />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
