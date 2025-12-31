import React from "react";

export default function ResultDots({ result }: { result: string }) {
  const cleanResult = result.replace(/[\[\]]/g, "");
  return (
    <div className="flex gap-0.5">
      {cleanResult.split("").map((char, i) => {
        let color = "bg-zinc-800"; // Default/Unknown
        if (char === "P")
          color = "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.6)]";
        if (char === "-") color = "bg-rose-600";
        if (char === "x") color = "bg-amber-500";
        if (char === "T") color = "bg-amber-500"; // Time Limit (common in CP)

        return (
          <div
            key={i}
            className={`w-1.5 h-3 rounded-[1px] ${color}`}
            title={`Test Case ${i + 1}: ${char}`}
          />
        );
      })}
    </div>
  );
}
