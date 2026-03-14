import { Assignment, Classroom, Lesson, ProgressRecord, Student, WritingExercise } from '../types';

const API_BASE = '/api';

async function fetchApi<T>(path: string): Promise<T[]> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
}

async function postApi<T>(path: string, data: T): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to post ${path}`);
}

async function deleteApi(path: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete ${path}/${id}`);
}

export const api = {
  getAssignments: () => fetchApi<Assignment>('/assignments'),
  saveAssignment: (assignment: Assignment) => postApi('/assignments', assignment),
  deleteAssignment: (id: string) => deleteApi('/assignments', id),

  getProgress: () => fetchApi<ProgressRecord>('/progress'),
  saveProgress: (progress: ProgressRecord) => postApi('/progress', progress),
  deleteProgress: (id: string) => deleteApi('/progress', id),

  getWritingExercises: () => fetchApi<WritingExercise>('/writing-exercises'),
  saveWritingExercise: (exercise: WritingExercise) => postApi('/writing-exercises', exercise),
  deleteWritingExercise: (id: string) => deleteApi('/writing-exercises', id),

  getLessons: () => fetchApi<Lesson>('/lessons'),
  saveLesson: (lesson: Lesson) => postApi('/lessons', lesson),
  deleteLesson: (id: string) => deleteApi('/lessons', id),

  getStudents: () => fetchApi<Student>('/students'),
  saveStudent: (student: Student) => postApi('/students', student),
  deleteStudent: (id: string) => deleteApi('/students', id),

  getClassrooms: () => fetchApi<Classroom>('/classrooms'),
  saveClassroom: (classroom: Classroom) => postApi('/classrooms', classroom),
  deleteClassroom: (id: string) => deleteApi('/classrooms', id),
};
