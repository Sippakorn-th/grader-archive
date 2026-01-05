"use client";

import { useState, useMemo } from "react";
import { Problem } from "@/types";
import ProblemRow from "./ProblemRow";
import ExamDashboard from "./ExamDashboard"; // <--- Import the new component

const COURSES = [
  "All",
  "Data Structure",
  "Algorithm Design",
  "Digital Logic",
  "Database System",
];

export default function ArchiveDashboard({
  initialData,
}: {
  initialData: Problem[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [hideUnsolved, setHideUnsolved] = useState(false);

  // NEW STATE: Toggle between List and Exam Mode
  const [isExamMode, setIsExamMode] = useState(false);

  // Filter Logic (Same as before)
  const filteredProblems = useMemo(() => {
    return initialData.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      const matchesCourse =
        selectedCourse === "All" || p.course === selectedCourse;
      const matchesStatus = hideUnsolved ? p.highest_points === 100 : true;
      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [initialData, search, selectedCourse, hideUnsolved]);

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* HEADER SECTION */}
      <div className="pt-10 flex justify-between items-end mb-2">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white">
            GRADER<span className="text-zinc-600">ARCHIVE</span>
          </h1>
        </div>
      </div>

      {/* CONTROLS SECTION */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md py-4 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
        {/* HIDE SEARCH IN EXAM MODE TO CLEAN UP UI */}
        {!isExamMode ? (
          <>
            {/* Search */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search problems..."
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-none px-4 py-2 focus:outline-none focus:border-zinc-500 placeholder-zinc-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Problem Count */}
            <div className="flex-1 text-zinc-500 text-sm pl-2">
              {filteredProblems.length} problems found
            </div>
          </>
        ) : (
          // Spacer to keep buttons to the right in Exam Mode
          <div className="flex-1"></div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 text-sm items-center">
          {/* --- THE KILLER FEATURE TOGGLE --- */}
          <button
            onClick={() => setIsExamMode(!isExamMode)}
            className={`flex items-center gap-2 px-3 py-2 border transition-all ${
              isExamMode
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                : "bg-black text-zinc-400 border-zinc-800 hover:border-zinc-500 hover:text-white"
            }`}
          >
            {isExamMode ? "← Back to Problems" : "🏆 Exam Stats"}
          </button>

          {/* Regular Filters (Hide in Exam Mode to reduce clutter) */}
          {!isExamMode && (
            <>
              <button
                onClick={() => setHideUnsolved(!hideUnsolved)}
                className={`px-3 py-2 border transition-colors ${
                  hideUnsolved
                    ? "bg-zinc-100 text-black border-white"
                    : "bg-black text-zinc-500 border-zinc-800 hover:border-zinc-600"
                }`}
              >
                Hide Unsolved
              </button>

              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="bg-black text-zinc-300 border border-zinc-800 px-3 py-2 focus:outline-none hover:border-zinc-600 cursor-pointer"
              >
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* CONTENT AREA - SWAPS BETWEEN LIST AND DASHBOARD */}
      <div className="border-t border-zinc-800 min-h-[50vh] pt-6">
        {isExamMode ? (
          <ExamDashboard />
        ) : (
          <>
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <ProblemRow key={problem.slug} problem={problem} />
              ))
            ) : (
              <div className="py-20 text-center text-zinc-600">
                No problems match your filters.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
