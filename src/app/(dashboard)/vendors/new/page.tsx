"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewVendorPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { name: "", email: "", phone: "", address: "" },
  });

  const onSubmit = async (data: Record<string, string>) => {
    const res = await fetch("/api/ptp/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/vendors");
  };

  return (
    <div>
      <PageHeader title="Create Vendor" description="Add a new vendor to the master list." />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div className="space-y-2"><Label>Vendor Name</Label><Input {...register("name", { required: true })} /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" {...register("email")} /></div>
        <div className="space-y-2"><Label>Phone</Label><Input {...register("phone")} /></div>
        <div className="space-y-2"><Label>Address</Label><Input {...register("address")} /></div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Vendor"}</Button>
      </form>
    </div>
  );
}
