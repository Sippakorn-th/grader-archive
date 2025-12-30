// components/ProblemRow.tsx
import { Problem } from "@/types";
import StarRating from "./StarRating";

// Map full course names to short tags
const COURSE_MAP: Record<string, string> = {
  "Algorithm Design": "ALGO",
  "Data Structure": "DATA",
  "Digital Logic": "DIGI",
  "Database System": "DB",
};

export default function ProblemRow({ problem }: { problem: Problem }) {
  const shortCourse =
    COURSE_MAP[problem.course] || problem.course.substring(0, 4).toUpperCase();
  const isSolved = problem.highest_points === 100;

  return (
    <div className="group flex items-center justify-between p-4 border-b border-zinc-800 hover:bg-zinc-900 transition-colors duration-200">
      {/* Left: Course Tag & Name */}
      <div className="flex items-center gap-4 flex-1">
        <span className="text-[10px] font-bold tracking-wider text-zinc-500 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded w-16 text-center shrink-0">
          {shortCourse}
        </span>

        <div className="flex flex-col">
          <span className="text-zinc-200 font-medium group-hover:text-white transition-colors">
            {problem.name}
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            {problem.slug}
          </span>
        </div>
      </div>

      {/* Middle: Difficulty */}
      <div className="w-32 flex justify-center shrink-0">
        <StarRating rating={problem.difficulty} />
      </div>

      {/* Right: Stats */}
      <div className="w-32 flex flex-col items-end gap-1 shrink-0">
        <span
          className={`text-xs font-bold ${
            isSolved ? "text-white" : "text-zinc-500"
          }`}
        >
          {isSolved ? "SOLVED" : `${problem.highest_points} PTS`}
        </span>
        <span className="text-[10px] text-zinc-500">
          {problem.total_submissions} subs
        </span>
      </div>
    </div>
  );
}
