"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ThreeWayMatchProps {
  poAmount: number;
  receiptQty: number;
  expectedQty: number;
  billAmount: number;
}

export function ThreeWayMatch({ poAmount, receiptQty, expectedQty, billAmount }: ThreeWayMatchProps) {
  const qtyMatch = receiptQty === expectedQty;
  const amountMatch = Math.abs(poAmount - billAmount) < 0.01;
  const allMatch = qtyMatch && amountMatch;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          3-Way Match
          <Badge variant={allMatch ? "default" : "destructive"}>
            {allMatch ? "Matched" : "Mismatch"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>PO Amount: {formatCurrency(poAmount)}</span>
          {amountMatch ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Receipt Qty: {receiptQty} / {expectedQty}</span>
          {qtyMatch ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Bill Amount: {formatCurrency(billAmount)}</span>
          {amountMatch ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
        </div>
      </CardContent>
    </Card>
  );
}
