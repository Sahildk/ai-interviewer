export type InterviewType = 'behavioral' | 'technical' | 'system-design';

export interface InterviewConfig {
  type: InterviewType;
  context: string; // Resume text or job description
  difficulty: 'junior' | 'mid' | 'senior';
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ChartData {
  category: string;
  score: number;
  fullMark: number;
}

export interface FeedbackItem {
  title: string;
  description: string;
  type: 'strength' | 'improvement';
}

export interface InterviewReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  cultureFitScore: number;
  radarData: ChartData[];
  feedback: FeedbackItem[];
  summary: string;
}

export enum AppStage {
  SETUP = 'SETUP',
  INTERVIEW = 'INTERVIEW',
  REPORT = 'REPORT',
}
