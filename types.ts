
export enum DifficultyLevel {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3
}

export interface Subject {
  id: string;
  name: string;
  weight: number; // 1 to 5
  difficulty: DifficultyLevel;
  incidence: number; // Historical percentage (0-100)
}

export interface Task {
  id: string;
  subjectId: string;
  subjectName: string;
  durationMinutes: number;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  accuracy?: number; // 0-100 percentage of correct questions
  date: string; // ISO format YYYY-MM-DD
}

export interface UserPlan {
  dailyHours: number;
  subjects: Subject[];
  tasks: Task[];
  startDate: string;
}

export interface Stats {
  executionRate: number;
  accuracyRate: number;
  goalFulfillment: number;
}
