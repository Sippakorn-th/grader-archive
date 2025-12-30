// types/index.ts
export interface Problem {
  slug: string;
  name: string;
  difficulty: number;
  course: string;
  total_submissions: number;
  highest_points: number;
}
// types/index.ts
// ... keep existing Problem interface ...

export interface AIAnalysis {
  reasoning: string;
  key_algorithms: string[];
  time_complexity: string;
  space_complexity: string;
  readability_score: number;
}

export interface Submission {
  problem_slug: string;
  external_id: string;
  user_handle: string;
  language: string;
  result_summary: string; // e.g., "PPPP..."
  points: number;
  memory_kb: number;
  runtime_sec: number;
  submitted_at: string;
  code_path: string;
  ai_analysis: AIAnalysis | null;
  tries: number;
}

export type ProblemDetail = Problem;
