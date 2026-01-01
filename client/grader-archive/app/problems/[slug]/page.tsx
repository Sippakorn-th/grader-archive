// app/problems/[slug]/page.tsx

import ProblemDetailView from "@/components/ProblemDetailView";
import { ProblemDetail, Submission } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchData(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// 1. Change the type definition here to Promise
export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 2. Await the params before using them
  const { slug } = await params;

  // Parallel data fetching
  const problemData: Promise<ProblemDetail> = fetchData(
    `${API_BASE}/problems/${slug}`
  );
  const submissionsData: Promise<Submission[]> = fetchData(
    `${API_BASE}/problems/${slug}/submissions`
  );

  const [problem, submissions] = await Promise.all([
    problemData,
    submissionsData,
  ]);

  if (!problem) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
        Problem not found.
      </div>
    );
  }

  const safeSubmissions = submissions || [];

  return (
    <main className="min-h-screen bg-black text-zinc-200 px-6">
      <ProblemDetailView problem={problem} submissions={safeSubmissions} />
    </main>
  );
}
