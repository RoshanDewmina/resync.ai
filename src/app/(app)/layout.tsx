

import { checkAuth } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import Background from "@/components/background";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  return (
    <main className="fixed h-screen w-screen">
      <ClerkProvider>
        <div className="flex h-full w-full">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Background />
            <Navbar />
            <div className="flex-1 overflow-auto p-4">
              <div className="mx-auto w-full rounded-3xl ring-1 ring-gray-200 p-4 z-10">
                <div className="rounded-2xl backdrop-blur-sm bg-white/70 ring-1 ring-inset ring-gray-900/5 p-6 overflow-auto">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClerkProvider>
      <Toaster richColors />
    </main>
  );
}
