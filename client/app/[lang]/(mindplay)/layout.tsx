import Header from "@/components/Misc/Header";
import Sidebar from "@/components/Misc/Sidebar";
import TourComponent from "@/components/Misc/TourComponent";

export default function MindPlayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TourComponent>
      <div className="h-screen flex">
        <Sidebar />

        <main className="h-full w-full p-5 flex flex-col justify-start">
          <Header />
          {children}
        </main>
      </div>
    </TourComponent>
  );
}
