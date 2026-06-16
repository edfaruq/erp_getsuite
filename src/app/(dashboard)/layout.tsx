import { Navbar } from "@/components/shared/Navbar";
import { Sidebar } from "@/components/shared/Sidebar";
import { Footer } from "@/components/shared/Footer";
import { ToastContainer } from "@/components/shared/Toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background))]">
      <Navbar />
      <ToastContainer />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 w-full">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
