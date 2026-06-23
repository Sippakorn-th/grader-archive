"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-black text-zinc-200 px-6 flex items-center justify-center">
      <div className="max-w-md w-full border border-zinc-800 bg-zinc-950 p-6 rounded-lg text-center">
        <h1 className="text-2xl font-black text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          The page could not finish loading. You can retry or return to the
          problem list.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-zinc-100 text-black text-sm font-bold"
          >
            Try again
          </button>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="px-4 py-2 border border-zinc-700 text-zinc-300 text-sm"
          >
            Back to problems
          </button>
        </div>
      </div>
    </main>
  );
}
