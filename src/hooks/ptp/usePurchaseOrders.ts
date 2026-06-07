"use client";

import { useState, useEffect, useCallback } from "react";
import { PurchaseOrder } from "@/types/ptp.types";

export function usePurchaseOrders(status?: string) {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = status ? `?status=${status}` : "";
      const res = await fetch(`/api/ptp/purchase-orders${params}`);
      if (!res.ok) throw new Error("Failed to fetch purchase orders");
      const data = await res.json();
      setOrders(data.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
