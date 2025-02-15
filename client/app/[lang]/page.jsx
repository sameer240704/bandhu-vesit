import Navbar from "@/components/Home/Navbar";

export default function Home() {
  return (
    <div className="relative h-screen" suppressHydrationWarning>
      <Navbar />

      <main className="h-full mx-auto px-5 flex-center">
        <h1 className="text-3xl font-semibold">Hello World</h1>
      </main>
    </div>
  );
}
