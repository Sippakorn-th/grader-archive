import React from "react";
import { TestCase } from "@/types";

interface TestCaseListProps {
  cases: TestCase[];
  isLoading: boolean;
}

export default function TestCaseList({ cases, isLoading }: TestCaseListProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-zinc-500 text-xs animate-pulse">
        Loading test cases...
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-500 text-xs">
        No details available.
      </div>
    );
  }

  // Helper to map raw result text to UI Badges
  const getBadge = (raw: string | null) => {
    if (!raw) return { text: "UNKNOWN", color: "text-zinc-500" };

    if (raw === "P")
      return {
        text: "PASS",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      };
    if (raw.includes("Time Limit"))
      return {
        text: "TIME LIMIT EXCEEDED",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      };
    if (raw.includes("Wrong Answer") || raw.includes("-"))
      return {
        text: "WRONG ANSWER",
        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      };
    if (raw.includes("Crashed") || raw.includes("x"))
      return {
        text: "ERROR",
        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      };

    return { text: "UNKNOWN", color: "text-zinc-400 bg-zinc-800" };
  };

  return (
    <div className="overflow-hidden border-t border-zinc-800 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] text-zinc-500 uppercase border-b border-zinc-800">
            <th className="py-2 pl-2 font-medium">#</th>
            <th className="py-2 font-medium">Result</th>
            <th className="py-2 text-right font-medium">Time</th>
            <th className="py-2 pr-2 text-right font-medium">Mem</th>
          </tr>
        </thead>
        <tbody className="text-xs font-mono">
          {cases.map((tc) => {
            const badge = getBadge(tc.result_text);
            return (
              <tr
                key={tc.testcase_num}
                className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30"
              >
                <td className="py-2 pl-2 text-zinc-500">{tc.testcase_num}</td>
                <td className="py-2">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.color}`}
                  >
                    {badge.text}
                  </span>
                </td>
                <td className="py-2 text-right text-zinc-400">
                  {tc.runtime_sec !== null
                    ? `${tc.runtime_sec.toFixed(3)}s`
                    : "-"}
                </td>
                <td className="py-2 pr-2 text-right text-zinc-500">
                  {tc.memory_mb !== null ? `${tc.memory_mb}MB` : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
