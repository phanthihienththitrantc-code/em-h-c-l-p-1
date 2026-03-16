
export enum AppView {
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  LESSON_LIST = 'LESSON_LIST',
  READING = 'READING',
  WRITING = 'WRITING',
  GAMES = 'GAMES',
  TEACHER_DASHBOARD = 'TEACHER_DASHBOARD',
  PARENT_DASHBOARD = 'PARENT_DASHBOARD'
}

export type UserRole = 'teacher' | 'student' | 'parent' | null;

export interface AppTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  backgroundImage?: string;
}

export interface Classroom {
  id: string;
  name: string;
  grade: string;
  classCode?: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  avatarColor: string;
  avatarIcon?: string;
}

export interface ProgressRecord {
  id: string;
  studentId?: string;
  studentName?: string;
  lessonId: string;
  lessonTitle: string;
  activityType: 'reading' | 'writing' | 'exercise';
  score: number;
  comment: string;
  timestamp: number;
  audioUrl?: string;
  audioBase64?: string;
  teacherAudioBase64?: string;
  teacherScore?: number;
  parentAudioBase64?: string;
  parentScore?: number;
}

export interface MatchingPair {
  id: string;
  word: string;
  targetValue: string;
  type: 'sound' | 'image';
}

export interface Exercise {
  id: string;
  type: 'selection' | 'matching' | 'word_finding' | 'riddle' | 'fill_blank';
  question: string;
  hint?: string;
  options?: string[];
  correctAnswer?: string;
  expectedConcept: string;
  matchingPairs?: MatchingPair[];
}

export interface LessonContent {
  sounds?: string[];
  words?: string[];
  sentences?: string[];
  paragraphs?: string[];
  exercises?: Exercise[];
}

export interface Lesson {
  id: string;
  title: string;
  pageNumber: number;
  volume: 1 | 2;
  type: 'alphabet' | 'syllable' | 'story' | 'review';
  content: LessonContent;
  customAudio?: Record<string, string>; // mapping of text to base64 audio
  videoLink?: string; // YouTube, Vimeo, etc. video link
  textAlignment?: {
    sentences?: 'left' | 'center' | 'right';
    paragraphs?: 'left' | 'center' | 'right';
  };
}

export interface Assignment {
  id: string;
  lessonId: string;
  dueDate: string;
  notes: string;
  createdAt: string;
}

export type WritingCategory = 'Chữ cái' | 'Vần' | 'Từ ngữ';

export interface WritingExercise {
  id: string;
  category: WritingCategory;
  label: string;
  text: string;
  videoUrl?: string;
}
