"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
} from "recharts";

// 0. TYPES
interface DataPoint {
  rank: number;
  score: number;
}

// 1. DATA GENERATOR (Strictly Typed)
const generateSteppedData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  let rankCounter = 1;

  // Format: [Number of Students, Score]
  // Adjusted: More people at 400 (Top plateau wider)
  const buckets: [number, number][] = [
    // --- THE LOW END ---
    [7, 0],
    [4, 5],
    [4, 10],

    // --- THE LONG CLIMB ---
    [5, 25],
    [4, 30],
    [5, 40],
    [4, 45],
    [5, 50],
    [5, 60],
    [6, 70],
    [6, 80],
    [5, 85],
    [6, 90],
    [8, 100],
    [6, 105],
    [6, 110],
    [4, 115],
    [5, 120],
    [2, 130],

    // --- THE BIG JUMP (Rank ~97) ---
    [3, 170],
    [3, 175],
    [3, 180],

    // --- THE MIDDLE TIER ---
    [4, 200],
    [4, 215],
    [4, 220],
    [4, 250],
    [4, 255],

    // --- THE UPPER TIER ---
    [3, 285],
    [3, 300], // The 300 Plateau
    [3, 310],
    [3, 325],

    // --- THE ELITE ---
    [5, 350], // <--- YOUR PLATEAU (Rank ~137-141)
    [9, 400], // <--- FIXED: Bigger group at 400 (Rank 142-153)
  ];

  // Expand buckets into individual data points
  buckets.forEach(([count, score]) => {
    for (let i = 0; i < count; i++) {
      if (rankCounter <= 153) {
        data.push({ rank: rankCounter, score: score });
        rankCounter++;
      }
    }
  });

  // Safety fill
  while (rankCounter <= 153) {
    data.push({ rank: rankCounter, score: 400 });
    rankCounter++;
  }

  return data;
};

const data = generateSteppedData();

// 2. OTHER EXAMS DATA
const OTHER_EXAMS = [
  { name: "Test 1: Algorithm Design", score: 200, total: 200 },
  { name: "Test 2: Algorithm Design", score: 200, total: 200 },
  {
    name: "Test 3: Algorithm Design",
    score: 190,
    total: 200,
  },
];

export default function ExamDashboard() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- HERO SECTION: FINAL EXAM --- */}
      <div className="mb-8 border border-zinc-800 bg-zinc-900/30 p-6 md:p-8 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 relative z-10">
          <div>
            <div className="inline-block px-2 py-1 bg-red-500/10 text-red-400 text-xs font-bold tracking-wider rounded mb-2 border border-red-500/20">
              FINAL EXAM OF 2110327 ALGORITHM DESIGN
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Final Exam: Advanced Algorithms
            </h2>
            <p className="text-zinc-400 mt-1 max-w-xl">
              Cumulative Distribution Graph from 153 students in the course.
            </p>
          </div>
          <div className="text-left md:text-right mt-4 md:mt-0">
            {/* <div className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
              MY SCORE
            </div> */}
            <div className="text-5xl font-black text-white">
              350<span className="text-zinc-600 text-2xl">/400</span>
            </div>
            <div className="text-emerald-400 font-bold text-sm mt-1">
              Top 7% (Rank 10th)
            </div>
          </div>
        </div>

        {/* CHART CONTAINER */}
        <div className="h-[350px] w-full mt-8 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <XAxis
                dataKey="rank"
                stroke="#555"
                tick={{ fill: "#555", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                type="number"
                domain={[0, 153]}
                ticks={[1, 17, 33, 49, 65, 81, 97, 113, 129, 145, 153]}
                label={{
                  value: "Student Rank (Low to High)",
                  position: "insideBottom",
                  offset: -10,
                  fill: "#444",
                  fontSize: 12,
                }}
              />
              <YAxis
                stroke="#555"
                tick={{ fill: "#555", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 400]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  borderColor: "#333",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
                cursor={{ stroke: "#555", strokeWidth: 1 }}
                labelFormatter={(label) => `Rank: ${label}`}
              />

              <Line
                type="linear"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#fff" }}
              />

              {/* THE "YOU ARE HERE" DOT - Positioned at Rank 141 (The right-most edge of the 350 shelf) */}
              <ReferenceDot
                x={143}
                y={350}
                r={6}
                fill="#fbbf24"
                stroke="#000"
                strokeWidth={2}
              />

              {/* THE LABEL LINE */}
              <ReferenceLine
                x={141}
                stroke="#fbbf24"
                strokeDasharray="3 3"
                opacity={0.5}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Floating Label for the Dot */}
          <div className="absolute top-[12%] right-[12%] bg-zinc-900 border border-yellow-500/50 p-2 rounded shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <div className="text-yellow-400 text-xs font-bold uppercase">
              My score
            </div>
            <div className="text-white text-sm font-bold">Rank 10th</div>
          </div>
        </div>
      </div>

      {/* --- TRACK RECORD SECTION --- */}
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-zinc-500 rounded-full"></span>
        Other exam in the course
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OTHER_EXAMS.map((exam) => (
          <div
            key={exam.name}
            className="bg-zinc-900 border border-zinc-800 p-5 rounded hover:border-zinc-700 transition-colors"
          >
            <div className="text-zinc-500 text-xs font-bold uppercase mb-2"></div>
            <div className="text-white font-bold mb-1">{exam.name}</div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-mono font-bold text-white">
                {exam.score}
              </span>
              <span className="text-zinc-600 text-sm mb-1">/{exam.total}</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 mt-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-400"
                style={{ width: `${(exam.score / exam.total) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
