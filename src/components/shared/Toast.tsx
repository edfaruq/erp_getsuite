"use client";

import { useToastStore } from "@/store/toast.store";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const styles = {
  success: {
    bar: "bg-emerald-500",
    icon: <CheckCircle className="h-4 w-4 text-white shrink-0" />,
  },
  error: {
    bar: "bg-red-500",
    icon: <XCircle className="h-4 w-4 text-white shrink-0" />,
  },
  info: {
    bar: "bg-blue-500",
    icon: <Info className="h-4 w-4 text-white shrink-0" />,
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-[5.5rem] left-0 right-0 z-50 flex flex-col gap-1 pointer-events-none">
      {toasts.map((toast) => {
        const s = styles[toast.type];
        return (
          <div
            key={toast.id}
            className={`${s.bar} w-full flex items-center gap-3 px-6 py-2.5 shadow-md pointer-events-auto animate-in slide-in-from-top-2 duration-200`}
          >
            {s.icon}
            <span className="text-sm font-medium text-white flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white transition-colors ml-auto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
