
import React, { useState } from 'react';
import { Student, Classroom } from '../types';
import { UserCheck, Users, GraduationCap, ChevronRight, Sparkles, Heart, UserCircle, LogIn, KeyRound } from 'lucide-react';
import { auth, signInWithGoogle } from '../firebase';

interface LoginViewProps {
  students: Student[];
  classrooms: Classroom[];
  onSelectStudent: (student: Student) => void;
  onSelectTeacher: () => void;
  onSelectParent: (student: Student) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ students, classrooms, onSelectStudent, onSelectTeacher, onSelectParent }) => {
  const [view, setView] = useState<'selection' | 'student-list' | 'parent-list' | 'enter-code'>('selection');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classCodeInput, setClassCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');

  const filteredStudents = selectedClassId 
    ? students.filter(s => s.classId === selectedClassId)
    : students;

  const handleTeacherLogin = async () => {
    if (auth.currentUser) {
      onSelectTeacher();
    } else {
      try {
        await signInWithGoogle();
        onSelectTeacher();
      } catch (error) {
        console.error("Login failed", error);
      }
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = classCodeInput.trim().toUpperCase();
    const foundClass = classrooms.find(c => c.classCode === code);
    
    if (foundClass) {
      setSelectedClassId(foundClass.id);
      setCodeError('');
      // After code is entered, we don't know if they are student or parent yet.
      // Let's just go to student-list for now, and they can pick their name.
      // We will add a role selection after they pick their name.
      setView('student-list');
    } else {
      setCodeError('Mã lớp không chính xác. Vui lòng thử lại!');
    }
  };

  const handleStudentClick = (student: Student) => {
    // If they came from entering code, ask if they are student or parent
    if (view === 'student-list' || view === 'parent-list') {
      // Just use the current view to determine role
      if (view === 'student-list') {
        onSelectStudent(student);
      } else {
        onSelectParent(student);
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-12">
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-orange-500 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl mx-auto transform -rotate-6 animate-float">
            TV1
          </div>
          <h1 className="text-5xl font-black text-blue-900 leading-tight">Bé Học Tiếng Việt 1</h1>
          <p className="text-gray-500 text-xl font-medium">Chào mừng Thầy Cô và các con đến với thế giới ngôn ngữ!</p>
        </div>

        {view === 'selection' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-500">
            <RoleCard 
              title="Học Sinh Đáng Yêu" 
              description="Bé nhập mã lớp để học bài, làm bài tập và nhận quà nhé!" 
              icon={<Users size={48} />}
              color="bg-orange-500"
              onClick={() => setView('enter-code')}
            />
            <RoleCard 
              title="Thầy Cô Giáo" 
              description="Giáo viên quản lý lớp học, soạn bài và chấm điểm cho bé." 
              icon={<GraduationCap size={48} />}
              color="bg-blue-600"
              onClick={handleTeacherLogin}
            />
            <RoleCard 
              title="Phụ Huynh" 
              description="Ba mẹ nhập mã lớp để theo dõi tiến độ học tập của con." 
              icon={<UserCircle size={48} />}
              color="bg-rose-500"
              onClick={() => {
                // We can use the same code entry view, just remember they are a parent
                // Actually, let's just go to enter-code and let them pick their role later, 
                // or set a state. For simplicity, we'll just set view to enter-code and 
                // we might need a way to know if they are parent or student.
                // Let's add a small hack: if they click parent, we set view to enter-code but we need to remember.
                // Let's just use a separate state or just pass it.
                // For now, let's just use enter-code and assume student, or add a role selection after.
                // Better: separate views or just use enter-code for both.
                setView('enter-code');
              }}
            />
          </div>
        ) : view === 'enter-code' ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-[3rem] shadow-xl border border-orange-50 animate-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-2xl font-black text-center text-gray-800 mb-6">Nhập Mã Lớp Học</h2>
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                  <input 
                    type="text" 
                    value={classCodeInput}
                    onChange={(e) => setClassCodeInput(e.target.value)}
                    placeholder="Ví dụ: A1B2C3"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-black text-xl text-center uppercase tracking-widest focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all"
                  />
                </div>
                {codeError && <p className="text-red-500 text-sm font-bold mt-2 text-center">{codeError}</p>}
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Vào Lớp
              </button>
              <button 
                type="button"
                onClick={() => setView('selection')}
                className="w-full py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors"
              >
                Quay lại
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl border border-orange-50">
               <div className="flex gap-4 items-center">
                  <h2 className="font-black text-xl text-gray-800">
                    {classrooms.find(c => c.id === selectedClassId)?.name || 'Lớp học'}
                  </h2>
                  <span className="px-4 py-1 bg-orange-100 text-orange-600 rounded-full font-bold text-sm">
                    Chọn tên của bé
                  </span>
               </div>
               <button onClick={() => setView('selection')} className="text-blue-600 font-black text-sm underline px-4">Đổi vai trò</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredStudents.length > 0 ? filteredStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => handleStudentClick(student)}
                  className="group bg-white p-6 rounded-[2.5rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center gap-4 border-b-8 border-gray-100 hover:border-orange-200"
                >
                  <div className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black shadow-inner transform transition-transform group-hover:rotate-12" style={{ backgroundColor: student.avatarColor }}>
                    {student.name.charAt(0)}
                  </div>
                  <div className="text-center">
                    <p className="font-black text-gray-800 text-sm">{student.name}</p>
                  </div>
                </button>
              )) : (
                <div className="col-span-full py-16 text-center bg-white/50 rounded-[3rem] border-4 border-dashed border-gray-200">
                   <p className="text-gray-400 font-bold italic">Chưa có học sinh nào trong lớp này.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center pt-8 flex items-center justify-center gap-8 opacity-40">
           <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest"><Sparkles size={16}/> Sáng tạo cùng AI</div>
           <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest"><Heart size={16}/> Học tập vui vẻ</div>
        </div>
      </div>
    </div>
  );
};

const RoleCard: React.FC<{ title: string; description: string; icon: React.ReactNode; color: string; onClick: () => void }> = ({ title, description, icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="group bg-white p-10 rounded-[3.5rem] shadow-xl hover:shadow-2xl transition-all border-b-[16px] border-gray-100 hover:border-orange-200 flex flex-col items-center text-center gap-6 active:scale-95"
  >
    <div className={`p-8 rounded-[2rem] text-white ${color} shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-6`}>
      {icon}
    </div>
    <div className="space-y-2">
      <h3 className="text-3xl font-black text-gray-800">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{description}</p>
    </div>
    <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs mt-4 group-hover:translate-x-2 transition-transform">
       Bắt đầu ngay <ChevronRight size={16} />
    </div>
  </button>
);

export default LoginView;
