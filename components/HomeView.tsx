
import React from 'react';
import { AppView, Student, Assignment, Lesson, UserRole } from '../types';
import { BookOpen, PenTool, Trophy, Star, ClipboardList, Calendar, ArrowRight, Gamepad2 } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: AppView, lessonId?: string) => void;
  activeStudent: Student | null;
  assignments: Assignment[];
  lessons: Lesson[];
  userRole: UserRole;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, activeStudent, assignments, lessons, userRole }) => {
  // Get active assignments (not overdue by more than 7 days)
  const activeAssignments = assignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 7;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm border border-orange-100 mb-4 animate-bounce">
           <Star className="text-yellow-400 fill-yellow-400" size={16}/>
           <p className="text-xs font-black text-orange-600 uppercase tracking-widest">
             {userRole === 'parent' ? 'Cùng bé học tập mỗi ngày!' : 'Hôm nay bé học thật giỏi nhé!'}
           </p>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-blue-900 leading-tight">
          {userRole === 'parent' 
            ? `Chào Phụ huynh của bé ${activeStudent ? activeStudent.name : ''}! 🌟`
            : `Chào ${activeStudent ? activeStudent.name : 'Bé'} thân yêu! 🌟`
          }
        </h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto font-medium">
          {userRole === 'parent'
            ? 'Ba mẹ có thể cùng bé tham gia các bài học dưới đây nhé!'
            : 'Hôm nay chúng mình cùng học gì nào? Hãy chọn một trò chơi để bắt đầu nhé!'
          }
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <MenuCard 
          title="Bé Tập Đọc" 
          description="Học phát âm và đọc chữ cùng cô giáo AI Gemini."
          icon={<BookOpen className="w-14 h-14" />}
          color="bg-green-500"
          onClick={() => onNavigate(AppView.READING)}
        />
        <MenuCard 
          title="Bé Tập Viết" 
          description="Luyện viết các nét cơ bản và chữ cái lớp 1."
          icon={<PenTool className="w-14 h-14" />}
          color="bg-blue-500"
          onClick={() => onNavigate(AppView.WRITING)}
        />
        <MenuCard 
          title="Trò Chơi" 
          description="Vui học qua các trò chơi nhận biết chữ và vần."
          icon={<Gamepad2 className="w-14 h-14" />}
          color="bg-purple-500"
          onClick={() => onNavigate(AppView.GAMES)}
        />
      </div>

      {activeAssignments.length > 0 && activeStudent && (
        <section className="bg-indigo-50 p-8 rounded-[3rem] border-4 border-dashed border-indigo-200 mt-12">
          <h3 className="text-2xl font-black text-indigo-900 mb-6 flex items-center gap-3">
            <ClipboardList className="text-indigo-600" size={28} /> Bài tập về nhà của bé
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeAssignments.map(assignment => {
              const lesson = lessons.find(l => l.id === assignment.lessonId);
              if (!lesson) return null;
              
              const isOverdue = new Date(assignment.dueDate) < new Date();
              
              return (
                <div key={assignment.id} className="bg-white p-6 rounded-[2.5rem] shadow-lg border-b-[8px] border-indigo-100 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-xl text-gray-800">{lesson.title}</h4>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-full">
                        Tập {lesson.volume}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-3">
                      <Calendar size={16} className={isOverdue ? 'text-red-500' : 'text-indigo-500'} />
                      <span className="font-bold text-gray-600">Hạn nộp:</span>
                      <span className={`font-black ${isOverdue ? 'text-red-600' : 'text-indigo-600'}`}>
                        {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {assignment.notes && (
                      <p className="text-gray-500 italic text-sm line-clamp-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        "{assignment.notes}"
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      // We can pass lessonId to navigate, but for now just go to READING view
                      onNavigate(AppView.READING, lesson.id);
                    }}
                    className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    Làm bài ngay <ArrowRight size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-blue-50 p-8 rounded-[3rem] border border-blue-100 mt-12">
        <h3 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2">
          <Star className="text-yellow-500 fill-yellow-500" size={20} /> Mẹo nhỏ cho bé:
        </h3>
        <ul className="space-y-3 text-blue-800 font-medium">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
            <span>Nếu không nghe thấy tiếng, bé hãy nhấn nút <b>"Thử loa"</b> ở góc trên màn hình nhé!</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
            <span>Trên iPhone, bé nhớ gạt nút bên hông máy để <b>tắt chế độ im lặng</b> (không hiện màu cam).</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

const MenuCard: React.FC<{ title: string; description: string; icon: React.ReactNode; color: string; onClick: () => void }> = ({ title, description, icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="group bg-white p-8 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all border-b-[12px] border-gray-100 hover:border-orange-200 hover:-translate-y-2 flex flex-col items-center text-center gap-6 active:scale-95"
  >
    <div className={`p-6 rounded-[2rem] text-white ${color} shadow-lg transition-transform group-hover:rotate-12`}>
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-black text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 font-medium leading-relaxed">{description}</p>
    </div>
  </button>
);

export default HomeView;
