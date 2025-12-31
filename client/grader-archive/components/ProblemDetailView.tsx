"use client";

import { useState, useEffect, useMemo } from "react";
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

type SortKey = "date" | "score" | "runtime";
type FilterType = "all" | "solved" | "unsolved";

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

  // Sorting & Filtering State
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setShowCases(false);
    setTestCases([]);
  }, [selected?.id]);

  const handleToggleCases = async () => {
    if (!selected) return;

    if (showCases) {
      setShowCases(false);
      return;
    }

    setShowCases(true);
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
    } finally {
      setLoadingCases(false);
    }
  };

  useEffect(() => {
    if (!selected) {
      setCodeContent("// No code available.");
      return;
    }

    const fetchCode = async () => {
      try {
        setCodeContent("// Fetching code...");
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

  // --- Sorting & Filtering Logic ---
  const processedSubmissions = useMemo(() => {
    // 1. Map to preserve original "Attempt #" based on initial index
    // Assuming 'submissions' prop comes in descending order (latest first)
    let temp = submissions.map((sub, idx) => ({
      ...sub,
      originalAttemptNum: submissions.length - idx,
    }));

    // 2. Filter
    if (filter === "solved") {
      temp = temp.filter((s) => s.points === 100);
    } else if (filter === "unsolved") {
      temp = temp.filter((s) => s.points < 100);
    }

    // 3. Sort
    temp.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      switch (sortKey) {
        case "date":
          valA = new Date(a.submitted_at).getTime();
          valB = new Date(b.submitted_at).getTime();
          break;
        case "score":
          valA = a.points;
          valB = b.points;
          break;
        case "runtime":
          valA = a.runtime_sec;
          valB = b.runtime_sec;
          break;
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return temp;
  }, [submissions, filter, sortKey, sortDir]);

  // Helper to handle the "Sort By" dropdown change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "best") {
      setSortKey("score");
      setSortDir("desc");
    } else if (value === "fastest") {
      setSortKey("runtime");
      setSortDir("asc");
    } else {
      setSortKey("date");
      setSortDir("desc");
    }
  };

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
                <ResultDots result={selected.result_summary} />
                <button
                  onClick={handleToggleCases}
                  className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 hover:text-white transition-colors border-b border-dashed border-zinc-600 hover:border-white pb-0.5"
                >
                  {showCases ? "Hide Details" : "View Cases"}
                </button>
              </div>

              {showCases && (
                <TestCaseList cases={testCases} isLoading={loadingCases} />
              )}
            </div>

            {/* AI Analysis Grid */}
            {analysis ? (
              <div className="grid grid-cols-2 gap-3 mt-6">
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                History
              </h3>
              {/* Controls */}
              <div className="flex gap-2">
                {/* 1. Filter Dropdown */}
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                  className="bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 rounded px-2 py-1 focus:outline-none focus:border-zinc-700"
                >
                  <option value="all">All</option>
                  <option value="solved">Solved</option>
                  <option value="unsolved">Unsolved</option>
                </select>

                {/* 2. Sort Dropdown */}
                <select
                  value={
                    sortKey === "score"
                      ? "best"
                      : sortKey === "runtime"
                      ? "fastest"
                      : "date"
                  }
                  onChange={handleSortChange}
                  className="bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 rounded px-2 py-1 focus:outline-none focus:border-zinc-700"
                >
                  <option value="date">Most Recent</option>
                  <option value="best">Highest Score</option>
                  <option value="fastest">Fastest</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border border-zinc-800 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-900/80 text-[10px] text-zinc-500 uppercase sticky top-0 backdrop-blur-sm z-10">
                  <tr>
                    <th className="p-3 font-medium cursor-pointer hover:text-zinc-300">
                      Attempt
                    </th>
                    <th
                      className="p-3 font-medium cursor-pointer hover:text-zinc-300"
                      onClick={() => {
                        if (sortKey === "score")
                          setSortDir(sortDir === "asc" ? "desc" : "asc");
                        else {
                          setSortKey("score");
                          setSortDir("desc");
                        }
                      }}
                    >
                      Points{" "}
                      {sortKey === "score" && (sortDir === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="p-3 font-medium hidden sm:table-cell cursor-pointer hover:text-zinc-300"
                      onClick={() => {
                        if (sortKey === "runtime")
                          setSortDir(sortDir === "asc" ? "desc" : "asc");
                        else {
                          setSortKey("runtime");
                          setSortDir("asc");
                        }
                      }}
                    >
                      Runtime{" "}
                      {sortKey === "runtime" && (sortDir === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="p-3 font-medium text-right cursor-pointer hover:text-zinc-300"
                      onClick={() => {
                        if (sortKey === "date")
                          setSortDir(sortDir === "asc" ? "desc" : "asc");
                        else {
                          setSortKey("date");
                          setSortDir("desc");
                        }
                      }}
                    >
                      Time{" "}
                      {sortKey === "date" && (sortDir === "asc" ? "↑" : "↓")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-black text-sm">
                  {processedSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-zinc-600">
                        No submissions match filter.
                      </td>
                    </tr>
                  ) : (
                    processedSubmissions.map((sub) => (
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
                            Try #{sub.originalAttemptNum}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
