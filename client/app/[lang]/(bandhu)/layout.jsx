import Header from "@/components/Misc/Header";
import Sidebar from "@/components/Misc/Sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function MindPlayLayout({ children }) {
  return (
    <div className="h-screen flex">
      <Sidebar />

      <main className="h-screen w-full p-5 flex flex-col justify-start">
        <Header />
        {children}
      </main>

      <Toaster />
    </div>
  );
}
