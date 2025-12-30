import ArchiveDashboard from "@/components/ArchiveDashboard";
import { Problem } from "@/types";

async function getProblems(): Promise<Problem[]> {
  try {
    const res = await fetch("http://localhost:8080/problems", {
      cache: "no-store", // Ensure fresh data on every load, or use 'force-cache' if static
    });

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    // Return empty array or mock data for safety
    return [];
  }
}

export default async function Page() {
  const problems = await getProblems();

  return (
    <main className="min-h-screen bg-black text-zinc-200 px-6 pb-20">
      <ArchiveDashboard initialData={problems} />
    </main>
  );
}
