export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-black text-zinc-200 px-6 pb-20">
      <div className="max-w-4xl mx-auto w-full animate-pulse">
        <div className="pt-10 flex justify-between items-end mb-2">
          <div className="h-12 w-80 max-w-full bg-zinc-800 rounded" />
        </div>

        <div className="sticky top-0 z-20 bg-black py-4 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
          <div className="h-9 w-full md:w-64 bg-zinc-900 border border-zinc-800" />
          <div className="h-4 w-28 bg-zinc-900 rounded flex-1" />
          <div className="flex gap-3">
            <div className="h-9 w-28 bg-zinc-900 border border-zinc-800" />
            <div className="h-9 w-40 bg-zinc-900 border border-zinc-800" />
          </div>
        </div>

        <div className="border-t border-zinc-800 min-h-[50vh] pt-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-b border-zinc-800"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="h-6 w-16 bg-zinc-900 border border-zinc-800 rounded" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-56 bg-zinc-800 rounded" />
                  <div className="h-3 w-32 bg-zinc-900 rounded" />
                </div>
              </div>
              <div className="hidden sm:block h-4 w-24 bg-zinc-900 rounded" />
              <div className="h-4 w-16 bg-zinc-900 rounded" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
