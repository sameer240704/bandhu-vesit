import Sidebar from "@/components/Misc/Sidebar";

export default async function MindPlayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
