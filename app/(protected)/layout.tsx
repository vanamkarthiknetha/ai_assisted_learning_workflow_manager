import { requireAuth } from "@/lib/session";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={session.user?.name} />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
