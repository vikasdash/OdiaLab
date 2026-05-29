export interface Course {
  id: string;
  title: string;
  category: string;
  price: string;
  rating: number;
  description: string;
  lessonsCount: number;
  studentsCount: number;
  isEnrolled?: boolean;
  thumbnail: string;
  isLive?: boolean;
  syllabus: string[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number; // index (0-3)
  explanation: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface QuizResult {
  id: string;
  category: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface StudyPlannerItem {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export interface StudentProfile {
  name: string;
  email: string;
  goal: string;
  streak: number;
  studyMinutes: number;
  joinDate: string;
  savedNotes: string[];
  solvedCount: number;
}
