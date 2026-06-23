export default function ProblemLoading() {
  return (
    <main className="min-h-screen bg-black text-zinc-200 px-6">
      <div className="max-w-7xl mx-auto w-full pt-10 pb-20 animate-pulse">
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-6 w-28 bg-zinc-900 border border-zinc-800 rounded" />
            <div className="h-4 w-36 bg-zinc-900 rounded" />
          </div>
          <div className="h-10 w-72 max-w-full bg-zinc-800 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#1e1e1e] border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="border-b border-zinc-800 px-4 py-3 flex justify-between">
              <div className="h-3 w-40 bg-zinc-700 rounded" />
              <div className="h-3 w-16 bg-zinc-800 rounded" />
            </div>
            <div className="space-y-3 p-5 h-[82vh]">
              {Array.from({ length: 18 }).map((_, index) => (
                <div
                  key={index}
                  className="h-3 bg-zinc-800 rounded"
                  style={{
                    width: `${
                      index % 3 === 0 ? 72 : index % 3 === 1 ? 88 : 54
                    }%`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg">
              <div className="flex justify-between mb-8">
                <div>
                  <div className="h-3 w-36 bg-zinc-800 rounded mb-3" />
                  <div className="h-8 w-24 bg-zinc-700 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-20 bg-zinc-700 rounded" />
                  <div className="h-3 w-16 bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="h-8 w-full bg-zinc-800 rounded mb-5" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 bg-black border border-zinc-800 rounded" />
                <div className="h-20 bg-black border border-zinc-800 rounded" />
                <div className="col-span-2 h-24 bg-black border border-zinc-800 rounded" />
              </div>
            </div>

            <div>
              <div className="h-4 w-24 bg-zinc-800 rounded mb-3" />
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 gap-4"
                  >
                    <div className="h-3 w-24 bg-zinc-800 rounded" />
                    <div className="h-3 w-16 bg-zinc-800 rounded" />
                    <div className="h-3 w-20 bg-zinc-800 rounded ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
