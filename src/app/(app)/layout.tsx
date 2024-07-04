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
    <main className="fixed h-screen">
      <ClerkProvider>
        <div className="flex h-full ">
          <Sidebar />

          <main className="flex">
            <Background />
            <Navbar />
            <div className="mx-auto max-w-full rounded-3xl ring-1 ring-gray-200 mt-1  lg:mx-0 lg:max-w-none flex gap-4  p-4  h-full w-full z-10 overflow-hidden">
              <>
                <div className="rounded-2xl backdrop-blur-sm bg-white/70 ring-1  ring-inset ring-gray-900/5 justify-center min-w-full overflow-scroll p-6">
                  {children}
                </div>
              </>
            </div>
          </main>
        </div>
      </ClerkProvider>
      <Toaster richColors />
    </main>
  );
}

// import { checkAuth } from "@/lib/auth/utils";
// import { Toaster } from "@/components/ui/sonner";
// import Navbar from "@/components/Navbar";
// import Sidebar from "@/components/Sidebar";
// import { ClerkProvider } from "@clerk/nextjs";
// import Background from "@/components/background";

// export default async function AppLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   await checkAuth();
//   return (
//     <main className="h-screen overflow-hidden">
//       <ClerkProvider>
//         <div className="flex h-full">
//           <div className="fixed top-0 left-0 h-full z-20">
//             <Sidebar />
//           </div>
//           <div className="flex flex-col flex-1 ml-64">
//             <div className="fixed top-0 left-0 w-full z-10">
//               <Background />
//               <Navbar />
//             </div>
//             <div className="flex-1 overflow-auto p-4 z-10">
//               <div className="mx-auto max-w-full rounded-3xl ring-1 ring-gray-200 lg:mx-0 lg:max-w-none flex gap-4 p-4 h-full w-full z-10">
//                 <div className="rounded-2xl backdrop-blur-sm bg-white/70 ring-1 ring-inset ring-gray-900/5 justify-center min-w-full overflow-scroll p-6">
//                   {children}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </ClerkProvider>
//       <Toaster richColors />
//     </main>
//   );
// }
