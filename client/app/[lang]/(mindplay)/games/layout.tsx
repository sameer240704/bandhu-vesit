import Socket from "@/components/Misc/Socket";

export default function MindPlayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      <main className="h-full w-full flex flex-col justify-start">
        {children}
      </main>

      <Socket />
    </div>
  );
}
