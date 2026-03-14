
import React, { useState, useEffect } from 'react';
import { AppView, Lesson, ProgressRecord, AppTheme, Student, Classroom, UserRole, Assignment, WritingExercise } from './types';
import { NAV_ITEMS, LESSONS as INITIAL_LESSONS, APP_THEMES } from './constants';
import HomeView from './components/HomeView';
import ReadingView from './components/ReadingView';
import WritingView from './components/WritingView';
import GamesView from './components/GamesView';
import LessonEditor from './components/LessonEditor';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import LoginView from './components/LoginView';
import { Settings, UserCheck, LogOut, User, Users, Headphones } from 'lucide-react';
import { AudioService } from './services/audioService';

import { api } from './services/api';
import { auth, signInWithGoogle, logOut } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const STUDENT_NAMES_1A3 = [
  "Hà Tâm An", "Vũ Ngọc Khánh An", "Hoàng Diệu Anh", "Quàng Tuấn Anh", "Lê Bảo Châu",
  "Trịnh Công Dũng", "Bùi Nhật Duy", "Nguyễn Nhật Duy", "Nguyễn Phạm Linh Đan", "Nguyễn Ngọc Bảo Hân",
  "Mào Trung Hiếu", "Nguyễn Bá Gia Hưng", "Vừ Gia Hưng", "Vừ Thị Ngọc Linh", "Đỗ Phan Duy Long",
  "Vừ Thành Long", "Vừ Bảo Ly", "Quàng Thị Quốc Mai", "Vừ Công Minh", "Phạm Bảo Ngọc",
  "Lò Thảo Nguyên", "Trình Chân Nguyên", "Lò Đức Phong", "Thào Thị Thảo", "Tạ Anh Thư",
  "Lò Minh Tiến", "Chang Trí Tuệ", "Cà Phương Uyên", "Bùi Uyển Vy"
];

const INITIAL_STUDENTS_1A3: Student[] = STUDENT_NAMES_1A3.map((name, index) => ({
  id: `s-1a3-${index}`,
  name,
  classId: 'c3',
  avatarColor: ['#f97316', '#2563eb', '#db2777', '#059669', '#7c3aed'][index % 5]
}));

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [writingExercises, setWritingExercises] = useState<WritingExercise[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [targetLessonId, setTargetLessonId] = useState<string | undefined>(undefined);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(APP_THEMES[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      // We don't force login view here anymore, because students/parents don't need to be logged in via Google
      // We just update the currentUser state.
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    // We always load data now, regardless of currentUser, because students/parents need data too.
    // If we want to restrict, we can check userRole, but initially we need classrooms to show in LoginView.
    
    setIsLoading(true);
    
    const unsubLessons = api.subscribeLessons((data) => {
      if (data.length === 0) {
        setLessons(INITIAL_LESSONS);
        INITIAL_LESSONS.forEach(l => api.saveLesson(l));
      } else {
        setLessons(data);
      }
    });

    const unsubProgress = api.subscribeProgress(setProgress);
    const unsubAssignments = api.subscribeAssignments(setAssignments);
    
    const unsubWriting = api.subscribeWritingExercises(async (data) => {
      if (data.length === 0) {
        const { WRITING_EXERCISES } = await import('./constants');
        setWritingExercises(WRITING_EXERCISES);
        WRITING_EXERCISES.forEach(e => api.saveWritingExercise(e));
      } else {
        setWritingExercises(data);
      }
    });

    const unsubClassrooms = api.subscribeClassrooms((data) => {
      if (data.length === 0) {
        const initialClasses = [
          { id: 'c1', name: 'Lớp 1A', grade: '1', classCode: '1A' },
          { id: 'c2', name: 'Lớp 1B', grade: '1', classCode: '1B' },
          { id: 'c3', name: 'Lớp 1A3', grade: '1', classCode: '1A3' }
        ];
        setClassrooms(initialClasses);
        initialClasses.forEach(c => api.saveClassroom(c));
      } else {
        // Ensure all existing classes have a code
        const processedData = data.map(c => {
          if (!c.classCode) {
            const code = c.name.trim().toUpperCase()
              .replace(/^LỚP\s+/i, '')
              .replace(/^LOP\s+/i, '')
              .replace(/[^A-Z0-9]/g, '');
            const updatedClass = { ...c, classCode: code || Math.random().toString(36).substring(2, 5).toUpperCase() };
            api.saveClassroom(updatedClass);
            return updatedClass;
          }
          return c;
        });
        setClassrooms(processedData);
      }
    });

    const unsubStudents = api.subscribeStudents((data) => {
      if (data.length === 0) {
        setStudents(INITIAL_STUDENTS_1A3);
        INITIAL_STUDENTS_1A3.forEach(s => api.saveStudent(s));
      } else {
        setStudents(data);
      }
    });

    const savedThemeJson = localStorage.getItem('tv1_theme');
    if (savedThemeJson) setCurrentTheme(JSON.parse(savedThemeJson));

    setIsLoading(false);

    return () => {
      unsubLessons();
      unsubProgress();
      unsubAssignments();
      unsubWriting();
      unsubClassrooms();
      unsubStudents();
    };
  }, []);

  useEffect(() => {
    // Unlock audio for iOS on first interaction
    const unlockAudio = () => {
      AudioService.getInstance().unlock();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', currentTheme.primaryColor);
    root.style.setProperty('--secondary-color', currentTheme.secondaryColor);
    root.style.setProperty('--background-color', currentTheme.backgroundColor);
    document.body.style.backgroundColor = currentTheme.backgroundColor;
    localStorage.setItem('tv1_theme', JSON.stringify(currentTheme));
  }, [currentTheme]);

  const handleSaveLesson = async (updatedLesson: Lesson) => {
    const exists = lessons.some(l => l.id === updatedLesson.id);
    let newLessons;
    if (exists) {
      newLessons = lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l);
    } else {
      newLessons = [...lessons, updatedLesson];
    }
    setLessons(newLessons);
    await api.saveLesson(updatedLesson);
    setEditingLesson(null);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    const newLessons = lessons.filter(l => l.id !== lessonId);
    setLessons(newLessons);
    await api.deleteLesson(lessonId);
  };

  const handleSaveStudents = async (newStudents: Student[]) => {
    setStudents(newStudents);
    for (const student of newStudents) {
      await api.saveStudent(student);
    }
  };

  const handleClearStudentData = async (studentIds: string[]) => {
    const progressToDelete = progress.filter(p => p.studentId && studentIds.includes(p.studentId));
    const newProgress = progress.filter(p => !p.studentId || !studentIds.includes(p.studentId));
    setProgress(newProgress);
    
    for (const p of progressToDelete) {
      await api.deleteProgress(p.id);
    }
  };

  const handleSaveAssignments = async (newAssignments: Assignment[]) => {
    setAssignments(newAssignments);
    for (const a of newAssignments) {
      await api.saveAssignment(a);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    const newAssignments = assignments.filter(a => a.id !== id);
    setAssignments(newAssignments);
    await api.deleteAssignment(id);
  };

  const handleDeleteClassroom = async (id: string) => {
    const newClassrooms = classrooms.filter(c => c.id !== id);
    setClassrooms(newClassrooms);
    await api.deleteClassroom(id);
  };

  const handleDeleteStudent = async (id: string) => {
    const newStudents = students.filter(s => s.id !== id);
    setStudents(newStudents);
    await api.deleteStudent(id);
  };

  const handleSaveWritingExercise = async (updatedExercise: WritingExercise) => {
    const newExercises = writingExercises.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex);
    setWritingExercises(newExercises);
    await api.saveWritingExercise(updatedExercise);
  };

  const handleSaveProgress = async (record: Omit<ProgressRecord, 'id' | 'timestamp'>) => {
    // Find the teacherId from the classroom of the active student
    let teacherId = auth.currentUser?.uid || 'anonymous';
    if (activeStudent) {
      const studentClass = classrooms.find(c => c.id === activeStudent.classId);
      if (studentClass && (studentClass as any).teacherId) {
        teacherId = (studentClass as any).teacherId;
      }
    }

    const newRecord: ProgressRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: Date.now(),
      studentId: activeStudent?.id,
      studentName: activeStudent?.name,
      teacherId // Include the resolved teacherId
    } as ProgressRecord & { teacherId: string };
    
    const newProgress = [newRecord, ...progress];
    setProgress(newProgress);
    await api.saveProgress(newRecord);
  };

  const handleUpdateProgress = async (updatedRecord: ProgressRecord) => {
    const newProgress = progress.map(p => p.id === updatedRecord.id ? updatedRecord : p);
    setProgress(newProgress);
    await api.saveProgress(updatedRecord);
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveStudent(null);
    setCurrentView(AppView.LOGIN);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold text-xl">Đang tải dữ liệu...</div>;
  }

  const renderView = () => {
    if (currentView === AppView.LOGIN) {
      return (
        <LoginView 
          students={students} 
          classrooms={classrooms}
          onSelectStudent={(student) => {
            setActiveStudent(student);
            setUserRole('student');
            setCurrentView(AppView.HOME);
          }}
          onSelectTeacher={() => {
            setUserRole('teacher');
            setCurrentView(AppView.HOME);
          }}
          onSelectParent={(student) => {
            setActiveStudent(student);
            setUserRole('parent');
            setCurrentView(AppView.PARENT_DASHBOARD);
          }}
        />
      );
    }

    switch (currentView) {
      case AppView.HOME:
        return <HomeView 
                 onNavigate={(view, lessonId) => {
                   setTargetLessonId(lessonId);
                   setCurrentView(view);
                 }} 
                 activeStudent={activeStudent} 
                 assignments={assignments} 
                 lessons={lessons} 
                 userRole={userRole}
               />;
      case AppView.READING:
        return (
          <ReadingView 
            lessons={lessons} 
            initialLessonId={targetLessonId}
            onBack={() => {
              setTargetLessonId(undefined);
              setCurrentView(AppView.HOME);
            }} 
            isTeacherMode={userRole === 'teacher'}
            onEditLesson={(lesson) => setEditingLesson(lesson)}
            onDeleteLesson={handleDeleteLesson}
            onSaveLesson={handleSaveLesson}
            onSaveProgress={handleSaveProgress}
          />
        );
      case AppView.WRITING:
        return (
          <WritingView 
            onBack={() => setCurrentView(AppView.HOME)} 
            onSaveProgress={handleSaveProgress}
            writingExercises={writingExercises}
            isTeacherMode={userRole === 'teacher'}
            onSaveExercise={handleSaveWritingExercise}
          />
        );
      case AppView.GAMES:
        return (
          <GamesView 
            onBack={() => setCurrentView(AppView.HOME)} 
            onSaveProgress={handleSaveProgress}
          />
        );
      case AppView.TEACHER_DASHBOARD:
        return (
          <TeacherDashboard 
            lessons={lessons} 
            progress={progress} 
            students={students}
            classrooms={classrooms}
            assignments={assignments}
            onEditLesson={(l) => setEditingLesson(l)} 
            onSaveStudents={handleSaveStudents}
            onClearStudentData={handleClearStudentData}
            onSaveClassrooms={async (c) => {
              setClassrooms(c);
              for (const classroom of c) {
                await api.saveClassroom(classroom);
              }
            }}
            onSaveAssignments={handleSaveAssignments}
            onUpdateProgress={handleUpdateProgress}
            onDeleteAssignment={handleDeleteAssignment}
            onDeleteClassroom={handleDeleteClassroom}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      case AppView.PARENT_DASHBOARD:
        return <ParentDashboard progress={progress} currentTheme={currentTheme} onUpdateTheme={setCurrentTheme} activeStudent={activeStudent} students={students} onUpdateProgress={handleUpdateProgress} />;
      default:
        return <HomeView 
                 onNavigate={(view, lessonId) => {
                   setTargetLessonId(lessonId);
                   setCurrentView(view);
                 }} 
                 activeStudent={activeStudent} 
                 assignments={assignments} 
                 lessons={lessons} 
                 userRole={userRole}
               />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {currentView !== AppView.LOGIN && (
        <header className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-orange-100">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView(AppView.HOME)}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ backgroundColor: 'var(--primary-color)' }}>
              TV
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-800 leading-none">Tiếng Việt 1</h1>
              <p className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: 'var(--primary-color)' }}>Kết Nối Tri Thức</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {activeStudent && (
              <div className="hidden md:flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold" style={{ backgroundColor: activeStudent.avatarColor }}>
                  {activeStudent.name.charAt(0)}
                </div>
                <span className="text-xs font-black text-orange-700">{activeStudent.name}</span>
              </div>
            )}

            <button 
              onClick={async () => {
                await AudioService.getInstance().recreateContext();
                await AudioService.getInstance().unlock();
                await AudioService.getInstance().speakFallback("Xin chào, âm thanh đã sẵn sàng.");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all border border-blue-100"
              title="Kiểm tra âm thanh"
            >
              <Headphones size={16} /> Thử loa
            </button>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
            >
              <LogOut size={16} /> Thoát
            </button>
          </div>
        </header>
      )}

      <main className="flex-1 p-4 md:p-8 pb-32">
        <div className="max-w-7xl mx-auto">{renderView()}</div>
      </main>

      {currentView !== AppView.LOGIN && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-orange-50 px-6 py-4 flex justify-around items-center md:justify-center md:gap-16 z-[60] shadow-2xl rounded-t-[2.5rem]">
          {NAV_ITEMS.filter(item => {
            if (userRole === 'student') return item.id !== AppView.TEACHER_DASHBOARD;
            if (userRole === 'parent') return item.id === AppView.PARENT_DASHBOARD || item.id === AppView.HOME;
            return true;
          }).map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as AppView)}
              className={`flex flex-col items-center gap-1.5 transition-all group ${currentView === item.id ? '' : 'text-gray-400'}`}
              style={currentView === item.id ? { color: 'var(--primary-color)' } : {}}
            >
              <div className={`p-2.5 rounded-2xl transition-all ${currentView === item.id ? 'text-white shadow-lg -translate-y-2' : 'group-hover:bg-orange-50'}`} style={currentView === item.id ? { backgroundColor: 'var(--primary-color)' } : {}}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${currentView === item.id ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      {editingLesson && (
        <LessonEditor lesson={editingLesson} onSave={handleSaveLesson} onCancel={() => setEditingLesson(null)} onReset={() => {}} />
      )}
    </div>
  );
};

export default App;
