"use client";

import Link from "next/link";
import { RoleSwitcher } from "@/components/shared/RoleSwitcher";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
      <div className="flex h-24 lg:h-[5.5rem] items-center justify-between px-8 lg:px-10">
        <Link href="/" className="group">
          <div className="flex flex-col leading-[0.85]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">UNDIP</p>
            <span className="font-bold text-3xl lg:text-4xl tracking-tight text-foreground -mt-1">GetSuite</span>
          </div>
        </Link>

        <RoleSwitcher variant="navbar" />
      </div>
    </header>
  );
}
