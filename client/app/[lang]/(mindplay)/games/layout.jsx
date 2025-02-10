import Socket from "@/components/Misc/Socket";

export default function MindPlayLayout({ children }) {
  return (
    <div className="h-full flex">
      <main className="h-full w-full flex flex-col justify-start">
        {children}
      </main>

      <Socket />
    </div>
  );
}
