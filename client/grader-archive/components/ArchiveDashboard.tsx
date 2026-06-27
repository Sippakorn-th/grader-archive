"use client";

import { useState, useMemo } from "react";
import { Problem } from "@/types";
import ProblemRow from "./ProblemRow";

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

  const filteredProblems = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return initialData.filter((p) => {
      const name = String(p.name ?? "");
      const slug = String(p.slug ?? "");
      const course = String(p.course ?? "");
      const highestPoints = p.highest_points ?? 0;
      const matchesSearch =
        name.toLowerCase().includes(normalizedSearch) ||
        slug.toLowerCase().includes(normalizedSearch);
      const matchesCourse =
        selectedCourse === "All" || course === selectedCourse;
      const matchesStatus = hideUnsolved ? highestPoints === 100 : true;
      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [initialData, search, selectedCourse, hideUnsolved]);

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* HEADER SECTION */}
      <div className="pt-8 sm:pt-10 flex justify-between items-end mb-2">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">
            GRADER<span className="text-zinc-600">ARCHIVE</span>
          </h1>
        </div>
      </div>

      {/* CONTROLS SECTION */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md py-4 border-b border-zinc-800 flex flex-col md:flex-row gap-3 md:gap-4 justify-between items-stretch md:items-center">
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
        <div className="w-full md:w-auto flex-1 text-zinc-500 text-sm pl-0 md:pl-2">
          {filteredProblems.length} problems found
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 md:flex gap-3 text-sm items-center w-full md:w-auto">
          <button
            onClick={() => setHideUnsolved(!hideUnsolved)}
            className={`px-3 py-2 border transition-colors whitespace-nowrap ${
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
            className="w-full bg-black text-zinc-300 border border-zinc-800 px-3 py-2 focus:outline-none hover:border-zinc-600 cursor-pointer"
          >
            {COURSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-zinc-800 min-h-[50vh] pt-6">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem, index) => (
            <ProblemRow
              key={problem.slug ?? `problem-${index}`}
              problem={problem}
            />
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
