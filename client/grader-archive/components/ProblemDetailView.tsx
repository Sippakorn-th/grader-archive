"use client";

import { useState, useEffect } from "react";
import { Submission, ProblemDetail, TestCase } from "@/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ResultDots from "./ResultDots";
import TestCaseList from "./TestCaseList";

const BASE_STORAGE_URL =
  "https://xjjjfiacswagivjuyfbf.supabase.co/storage/v1/object/public/grader-assets/";

const TAG_DISPLAY_MAP: Record<string, string> = {
  // Algorithms
  "Minimum Spanning Tree (MST)": "MST",
  "Topological Sort / SCC": "Topo Sort",
  "Shortest Path": "Shortest Path",
  "Number Theory / Math": "Math",
  "String Algorithms": "Strings",
  "Dynamic Programming": "DP",
  "Backtracking": "Backtrack",
  "Bitmasking": "Bitmask",
  "BFS / DFS": "BFS/DFS",

  // Data Structures
  "Queue / Deque": "Deque",
  "Priority Queue": "P-Queue",
  "Hash Map / Hash Set": "HashMap",
  "Ordered Map / Ordered Set": "Ordered Map",
  "Linked List": "Linked List",
};

export default function ProblemDetailView({
  problem,
  submissions,
}: {
  problem: ProblemDetail;
  submissions: Submission[];
}) {
  // Default to the first (latest) submission
  const [selected, setSelected] = useState<Submission | null>(
    submissions[0] || null
  );
  const [codeContent, setCodeContent] = useState<string>("// Loading code...");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [showCases, setShowCases] = useState(false);

  useEffect(() => {
    setShowCases(false);
    setTestCases([]);
  }, [selected?.id]);

  const handleToggleCases = async () => {
    if (!selected) return;

    // Toggle off
    if (showCases) {
      setShowCases(false);
      return;
    }

    // Toggle on
    setShowCases(true);

    // If we already fetched for this submission, don't refetch
    if (testCases.length > 0) return;

    setLoadingCases(true);
    try {
      const res = await fetch(
        `http://localhost:8080/submissions/${selected.id}/testcases`
      );
      if (!res.ok) throw new Error("Failed to fetch cases");
      const data = await res.json();
      setTestCases(data);
    } catch (error) {
      console.error(error);
      // Optional: Handle error UI
    } finally {
      setLoadingCases(false);
    }
  };
  // Fetch code text when selected submission changes
  useEffect(() => {
    if (!selected) {
      setCodeContent("// No code available.");
      return;
    }

    const fetchCode = async () => {
      try {
        setCodeContent("// Fetching code...");
        // Construct the full URL - Ensure backslashes in DB path are handled if necessary
        const cleanPath = selected.code_path.replace(/\\/g, "/");
        const res = await fetch(`${BASE_STORAGE_URL}${cleanPath}`);
        if (!res.ok) throw new Error("Failed to load code");
        const text = await res.text();
        setCodeContent(text);
      } catch (err) {
        setCodeContent("// Error: Could not load source code file.");
      }
    };

    fetchCode();
  }, [selected]);

  if (!selected)
    return <div className="text-zinc-500">No submissions found.</div>;

  const analysis = selected.ai_analysis;

  return (
    <div className="max-w-7xl mx-auto w-full pt-10 pb-20">
      {/* 1. HEADER: Problem Info */}
      <div className="mb-8 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
            {problem.course}
          </span>
          <span className="text-zinc-500 text-sm mono">{problem.slug}</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          {problem.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Code Viewer (7/12) */}
        <div className="lg:col-span-7 h-full">
          <div className="lg:sticky lg:top-4 h-fit">
            <div className="bg-[#1e1e1e] border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
              <div className="bg-[#1e1e1e] border-b border-zinc-800 px-4 py-2 flex justify-between items-center">
                <span className="text-xs font-mono text-zinc-400">
                  {selected.code_path.split("\\").pop()?.split("/").pop()}
                </span>
                <span className="text-xs text-zinc-500">
                  {selected.language}
                </span>
              </div>
              <div className="text-sm">
                <SyntaxHighlighter
                  language={selected.language === "C++" ? "cpp" : "python"}
                  style={vscDarkPlus}
                  showLineNumbers={true}
                  // This changes the line numbers (1, 2, 3...) to a grey color
                  lineNumberStyle={{
                    color: "#71717a",
                    minWidth: "3em",
                    paddingRight: "1em",
                  }}
                  customStyle={{
                    margin: 0,
                    background: "#1e1e1e",
                    height: "calc(82vh)",
                  }}
                >
                  {codeContent}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Analysis & History (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* A. HERO STATS CARD */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">
                  Selected Submission
                </h2>
                <div className="text-2xl font-mono text-white">
                  {selected.points}{" "}
                  <span className="text-zinc-600 text-lg">/ 100</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-mono text-xl">
                  {selected.runtime_sec}s
                </div>
                <div className="text-zinc-500 text-xs">
                  {selected.memory_kb} KB
                </div>
              </div>
            </div>

            {/* Result Dots Area */}
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                {/* The Dots */}
                <ResultDots result={selected.result_summary} />

                {/* NEW: Toggle Button */}
                <button
                  onClick={handleToggleCases}
                  className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 hover:text-white transition-colors border-b border-dashed border-zinc-600 hover:border-white pb-0.5"
                >
                  {showCases ? "Hide Details" : "View Cases"}
                </button>
              </div>

              {/* NEW: Expandable List */}
              {showCases && (
                <TestCaseList cases={testCases} isLoading={loadingCases} />
              )}
            </div>

            {/* AI Analysis Grid */}
            {analysis ? (
              <div className="grid grid-cols-2 gap-3 mt-6">
                {/* Algorithm & DS Tags */}
                {analysis.key_algorithms &&
                  analysis.key_algorithms.length > 0 && (
                    <div className="col-span-2 flex flex-wrap gap-2">
                      {analysis.key_algorithms.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold text-zinc-300 bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full uppercase tracking-wide whitespace-nowrap"
                        >
                          {TAG_DISPLAY_MAP[tag] || tag}
                        </span>
                      ))}
                    </div>
                  )}
                <div className="bg-black border border-zinc-800 p-3 rounded">
                  <div className="text-[10px] text-zinc-500 uppercase mb-1">
                    Time Comp.
                  </div>
                  <div className="text-yellow-100 font-mono">
                    {analysis.time_complexity}
                  </div>
                </div>

                <div className="bg-black border border-zinc-800 p-3 rounded">
                  <div className="text-[10px] text-zinc-500 uppercase mb-1">
                    Space Comp.
                  </div>
                  <div className="text-yellow-100 font-mono">
                    {analysis.space_complexity}
                  </div>
                </div>
                <div className="col-span-2 bg-black border border-zinc-800 p-3 rounded">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-[10px] text-zinc-500 uppercase">
                      Readability
                    </div>
                    <div className="text-xs text-white font-bold">
                      {analysis.readability_score}/10
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-100/80"
                      style={{ width: `${analysis.readability_score * 10}%` }}
                    />
                  </div>
                </div>
                <div className="col-span-2 mt-2">
                  <p className="text-sm text-zinc-400 italic leading-relaxed">
                    &quot;{analysis.reasoning}&quot;
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-black border border-zinc-800 rounded text-zinc-600 text-sm text-center italic">
                No AI analysis available for this submission.
              </div>
            )}
          </div>

          {/* B. HISTORY LIST */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">
              History
            </h3>
            <div className="flex-1 overflow-y-auto border border-zinc-800 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-900/80 text-[10px] text-zinc-500 uppercase sticky top-0 backdrop-blur-sm">
                  <tr>
                    <th className="p-3 font-medium">Attempt</th>
                    <th className="p-3 font-medium">Points</th>
                    <th className="p-3 font-medium hidden sm:table-cell">
                      Runtime
                    </th>
                    <th className="p-3 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-black text-sm">
                  {submissions.map((sub, idx) => (
                    <tr
                      key={sub.external_id}
                      onClick={() => setSelected(sub)}
                      className={`cursor-pointer transition-colors hover:bg-zinc-900/50 ${
                        selected.external_id === sub.external_id
                          ? "bg-zinc-900 border-l-3 border-l-yellow-100"
                          : ""
                      }`}
                    >
                      <td className="p-3">
                        <span className="text-zinc-300">
                          Try #{submissions.length - idx}
                        </span>
                      </td>
                      <td
                        className={`p-3 font-mono font-bold ${
                          sub.points === 100
                            ? "text-emerald-500"
                            : "text-zinc-400"
                        }`}
                      >
                        {sub.points}
                      </td>
                      <td className="p-3 text-zinc-500 font-mono text-xs hidden sm:table-cell">
                        {sub.runtime_sec}s
                      </td>
                      <td className="p-3 text-right text-zinc-600 text-xs">
                        {new Date(sub.submitted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
