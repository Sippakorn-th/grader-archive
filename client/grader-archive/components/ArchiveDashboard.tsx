"use client";

import { useState, useMemo } from "react";
import { Problem } from "@/types";
import ProblemRow from "./ProblemRow";

// Available filters based on your data
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

  // Filter Logic
  const filteredProblems = useMemo(() => {
    return initialData.filter((p) => {
      // 1. Text Search
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());

      // 2. Course Filter
      const matchesCourse =
        selectedCourse === "All" || p.course === selectedCourse;

      // 3. Status Filter (Optional: Hide if 100 points)
      const matchesStatus = hideUnsolved ? p.highest_points === 100 : true;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [initialData, search, selectedCourse, hideUnsolved]);
  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* HEADER SECTION */}
      <div className="pt-10">
        <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
          GRADER<span className="text-zinc-600">ARCHIVE</span>
        </h1>
      </div>

      {/* CONTROLS SECTION */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md py-4 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
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

        {/* NEW LOCATION: Problem Count (Option 1) */}
        <div className="flex-1 text-zinc-500 text-sm pl-2">
          {filteredProblems.length} problems found
        </div>

        {/* Filters */}
        <div className="flex gap-3 text-sm">
          {/* Toggle Unsolved */}
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

          {/* Course Dropdown */}
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
        </div>
      </div>

      {/* LIST SECTION */}
      <div className="border-t border-zinc-800 min-h-[50vh]">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <ProblemRow key={problem.slug} problem={problem} />
          ))
        ) : (
          <div className="py-20 text-center text-zinc-600">
            No problems match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
