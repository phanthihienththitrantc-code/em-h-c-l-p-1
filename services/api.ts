import { Assignment, Classroom, Lesson, ProgressRecord, Student, WritingExercise } from '../types';
import { db, auth } from '../firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, query, where } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo?: any[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function saveDoc<T extends { id: string }>(path: string, data: T): Promise<void> {
  try {
    // If data already has a teacherId, preserve it. Otherwise use current user or anonymous.
    const dataToSave = { ...data, teacherId: (data as any).teacherId || auth.currentUser?.uid || 'anonymous' };
    await setDoc(doc(db, path, data.id), dataToSave);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

async function delDoc(path: string, id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export const api = {
  subscribeAssignments: (callback: (data: Assignment[]) => void) => {
    return onSnapshot(collection(db, 'assignments'), (snapshot) => {
      callback(snapshot.docs.map(d => d.data() as Assignment));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'assignments'));
  },
  saveAssignment: (assignment: Assignment) => saveDoc('assignments', assignment),
  deleteAssignment: (id: string) => delDoc('assignments', id),

  subscribeProgress: (callback: (data: ProgressRecord[]) => void) => {
    return onSnapshot(collection(db, 'progress'), (snapshot) => {
      callback(snapshot.docs.map(d => d.data() as ProgressRecord));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'progress'));
  },
  saveProgress: (progress: ProgressRecord) => saveDoc('progress', progress),
  deleteProgress: (id: string) => delDoc('progress', id),

  subscribeWritingExercises: (callback: (data: WritingExercise[]) => void) => {
    return onSnapshot(collection(db, 'writing_exercises'), (snapshot) => {
      callback(snapshot.docs.map(d => d.data() as WritingExercise));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'writing_exercises'));
  },
  saveWritingExercise: (exercise: WritingExercise) => saveDoc('writing_exercises', exercise),
  deleteWritingExercise: (id: string) => delDoc('writing_exercises', id),

  subscribeLessons: (callback: (data: Lesson[]) => void) => {
    return onSnapshot(collection(db, 'lessons'), (snapshot) => {
      callback(snapshot.docs.map(d => d.data() as Lesson));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'lessons'));
  },
  saveLesson: (lesson: Lesson) => saveDoc('lessons', lesson),
  deleteLesson: (id: string) => delDoc('lessons', id),

  subscribeStudents: (callback: (data: Student[]) => void) => {
    return onSnapshot(collection(db, 'students'), (snapshot) => {
      callback(snapshot.docs.map(d => d.data() as Student));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'students'));
  },
  saveStudent: (student: Student) => saveDoc('students', student),
  deleteStudent: (id: string) => delDoc('students', id),

  subscribeClassrooms: (callback: (data: Classroom[]) => void) => {
    return onSnapshot(collection(db, 'classrooms'), (snapshot) => {
      callback(snapshot.docs.map(d => d.data() as Classroom));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'classrooms'));
  },
  saveClassroom: (classroom: Classroom) => saveDoc('classrooms', classroom),
  deleteClassroom: (id: string) => delDoc('classrooms', id),
};
