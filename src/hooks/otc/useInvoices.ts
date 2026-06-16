"use client";

import { useState, useEffect, useCallback } from "react";
import { Invoice } from "@/types/otc.types";

export function useInvoices(status?: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = status ? `?status=${status}` : "";
      const res = await fetch(`/api/otc/invoices${params}`);
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();
      setInvoices(data.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  return { invoices, loading, error, refetch: fetchInvoices };
}
