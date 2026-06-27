// app/problems/[slug]/page.tsx

import ProblemDetailView from "@/components/ProblemDetailView";
import { ProblemDetail } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchData(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const problem: ProblemDetail | null = await fetchData(
    `${API_BASE}/problems/${slug}`
  );

  if (!problem) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
        Problem not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-zinc-200 px-6">
      <ProblemDetailView problem={problem} slug={slug} />
    </main>
  );
}
