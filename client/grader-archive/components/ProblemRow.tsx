// components/ProblemRow.tsx
import { Problem } from "@/types";
import StarRating from "./StarRating";
import Link from "next/link";

// Map full course names to short tags
const COURSE_MAP: Record<string, string> = {
  "Algorithm Design": "ALGO",
  "Data Structure": "DATA",
  "Digital Logic": "DIGI",
  "Database System": "DB",
};

const COURSE_BOX_HOVER_MAP: Record<string, string> = {
  ALGO: "group-hover:bg-blue-950/70 group-hover:border-blue-700/60 group-hover:text-blue-200 group-focus-visible:bg-blue-950/70 group-focus-visible:border-blue-700/60 group-focus-visible:text-blue-200",
  DATA: "group-hover:bg-red-950/70 group-hover:border-red-700/60 group-hover:text-red-200 group-focus-visible:bg-red-950/70 group-focus-visible:border-red-700/60 group-focus-visible:text-red-200",
  DB: "group-hover:bg-orange-950/70 group-hover:border-orange-700/60 group-hover:text-orange-200 group-focus-visible:bg-orange-950/70 group-focus-visible:border-orange-700/60 group-focus-visible:text-orange-200",
  DIGI: "group-hover:bg-yellow-950/70 group-hover:border-yellow-700/60 group-hover:text-yellow-100 group-focus-visible:bg-yellow-950/70 group-focus-visible:border-yellow-700/60 group-focus-visible:text-yellow-100",
  DIGITAL:
    "group-hover:bg-yellow-950/70 group-hover:border-yellow-700/60 group-hover:text-yellow-100 group-focus-visible:bg-yellow-950/70 group-focus-visible:border-yellow-700/60 group-focus-visible:text-yellow-100",
};

function CourseBadge({
  shortCourse,
  courseBoxHoverClass,
}: {
  shortCourse: string;
  courseBoxHoverClass: string;
}) {
  return (
    <span
      className={`text-[10px] font-bold tracking-wider text-zinc-500 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded w-16 text-center shrink-0 transition-colors duration-100 ${courseBoxHoverClass}`}
    >
      {shortCourse}
    </span>
  );
}

export default function ProblemRow({ problem }: { problem: Problem }) {
  const course = String(problem.course ?? "Unknown");
  const slug = String(problem.slug ?? "");
  const name = String(problem.name ?? "Untitled problem");
  const highestPoints = problem.highest_points ?? 0;
  const totalSubmissions = problem.total_submissions ?? 0;
  const shortCourse =
    COURSE_MAP[course] || course.substring(0, 4).toUpperCase();
  const isSolved = highestPoints === 100;
  const href = slug ? `/problems/${slug}` : "#";
  const courseBoxHoverClass =
    COURSE_BOX_HOVER_MAP[shortCourse] ??
    "group-hover:bg-zinc-800 group-hover:border-zinc-600 group-hover:text-zinc-200 group-focus-visible:bg-zinc-800 group-focus-visible:border-zinc-600 group-focus-visible:text-zinc-200";

  return (
    <Link
      href={href}
      className="group block p-4 border-b border-zinc-800 border-l-2 border-l-transparent hover:border-l-zinc-500 hover:bg-zinc-900/80 active:border-l-zinc-500 active:bg-zinc-900/80 focus-visible:outline-none focus-visible:bg-zinc-900/80 focus-visible:border-l-white transition-colors duration-200 cursor-pointer"
      aria-disabled={!slug}
    >
      <div className="sm:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <CourseBadge
              shortCourse={shortCourse}
              courseBoxHoverClass={courseBoxHoverClass}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-zinc-200 font-medium leading-snug group-hover:text-white transition-colors">
                {name}
              </span>
              <span className="text-xs text-zinc-500 font-mono break-all">
                {slug || "missing-slug"}
              </span>
            </div>
          </div>
          <span
            aria-hidden="true"
            className="text-zinc-700 group-hover:text-zinc-300 group-focus-visible:text-white transition-colors"
          >
            →
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 pl-[76px]">
          <StarRating rating={problem.difficulty} />
          <div className="flex flex-col items-end gap-1">
            <span
              className={`text-xs font-bold ${
                isSolved ? "text-white" : "text-zinc-500"
              }`}
            >
              {isSolved ? "SOLVED" : `${highestPoints} PTS`}
            </span>
            <span className="text-[10px] text-zinc-500">
              {totalSubmissions} subs
            </span>
          </div>
        </div>
      </div>

      <div className="hidden sm:flex items-center justify-between">
        {/* Left: Course Tag & Name */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <CourseBadge
            shortCourse={shortCourse}
            courseBoxHoverClass={courseBoxHoverClass}
          />

          <div className="flex flex-col min-w-0">
            <span className="text-zinc-200 font-medium group-hover:text-white transition-colors">
              {name}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {slug || "missing-slug"}
            </span>
          </div>
        </div>

        {/* Middle: Difficulty */}
        <div className="w-32 flex justify-center shrink-0">
          <StarRating rating={problem.difficulty} />
        </div>

        {/* Right: Stats */}
        <div className="w-40 flex items-center justify-end gap-3 shrink-0">
          <div className="flex flex-col items-end gap-1">
            <span
              className={`text-xs font-bold ${
                isSolved ? "text-white" : "text-zinc-500"
              }`}
            >
              {isSolved ? "SOLVED" : `${highestPoints} PTS`}
            </span>
            <span className="text-[10px] text-zinc-500">
              {totalSubmissions} subs
            </span>
          </div>
          <span
            aria-hidden="true"
            className="text-zinc-700 group-hover:text-zinc-300 group-focus-visible:text-white transition-colors"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
