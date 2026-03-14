
import React, { useState, useRef } from 'react';
import { Lesson, ProgressRecord, Student, Classroom, Assignment } from '../types';
import { Users, BookCheck, TrendingUp, Plus, X, Search, GraduationCap, UserPlus, Play, Download, Square, FileUp, Share2, UploadCloud, FolderPlus, Trash2, AlertTriangle, UserMinus, Headphones, History, Calendar, Star, Mic, Trophy, PenTool, ClipboardList } from 'lucide-react';

interface TeacherDashboardProps {
  lessons: Lesson[];
  progress: ProgressRecord[];
  students: Student[];
  classrooms: Classroom[];
  assignments: Assignment[];
  onEditLesson: (lesson: Lesson) => void;
  onSaveStudents: (newStudents: Student[]) => void;
  onSaveClassrooms: (newClassrooms: Classroom[]) => void;
  onClearStudentData: (studentIds: string[]) => void;
  onSaveAssignments: (newAssignments: Assignment[]) => void;
  onUpdateProgress?: (updatedRecord: ProgressRecord) => void;
  onDeleteAssignment?: (id: string) => void;
  onDeleteClassroom?: (id: string) => void;
  onDeleteStudent?: (id: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  lessons, progress, students, classrooms, assignments, 
  onEditLesson, onSaveStudents, onSaveClassrooms, onClearStudentData, 
  onSaveAssignments, onUpdateProgress,
  onDeleteAssignment, onDeleteClassroom, onDeleteStudent
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'assignments'>('progress');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showDeleteClassConfirm, setShowDeleteClassConfirm] = useState<string | null>(null);
  const [showDeleteStudentConfirm, setShowDeleteStudentConfirm] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>(classrooms[0]?.id || '');
  const [selectedStudentHistory, setSelectedStudentHistory] = useState<Student | null>(null);
  
  const [newStudentName, setNewStudentName] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [gradingRecord, setGradingRecord] = useState<ProgressRecord | null>(null);
  const [newScore, setNewScore] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');
  const [isRecordingTeacher, setIsRecordingTeacher] = useState(false);
  const [teacherAudioBase64, setTeacherAudioBase64] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecordingTeacher = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setTeacherAudioBase64(base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecordingTeacher(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Vui lòng cấp quyền truy cập micro để ghi âm.");
    }
  };

  const handleStopRecordingTeacher = () => {
    if (mediaRecorderRef.current && isRecordingTeacher) {
      mediaRecorderRef.current.stop();
      setIsRecordingTeacher(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newAssignmentLessonId, setNewAssignmentLessonId] = useState(lessons[0]?.id || '');
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('');
  const [newAssignmentNotes, setNewAssignmentNotes] = useState('');

  const handleAddAssignment = () => {
    if (!newAssignmentLessonId || !newAssignmentDueDate) return;
    const newAssignment: Assignment = {
      id: 'a-' + Date.now(),
      lessonId: newAssignmentLessonId,
      dueDate: newAssignmentDueDate,
      notes: newAssignmentNotes,
      createdAt: new Date().toISOString()
    };
    onSaveAssignments([newAssignment, ...assignments]);
    setNewAssignmentNotes('');
    setShowAddAssignment(false);
  };

  const handleDeleteAssignment = (id: string) => {
    if (onDeleteAssignment) {
      onDeleteAssignment(id);
    } else {
      onSaveAssignments(assignments.filter(a => a.id !== id));
    }
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;
    const newStudent: Student = {
      id: Date.now().toString(),
      name: newStudentName,
      classId: selectedClassId,
      avatarColor: ['#f97316', '#2563eb', '#db2777', '#059669', '#7c3aed'][Math.floor(Math.random() * 5)]
    };
    onSaveStudents([...students, newStudent]);
    setNewStudentName('');
    setShowAddStudent(false);
  };

  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    
    // Generate code from name: remove "Lớp", remove spaces, keep alphanumeric
    const sanitizedName = newClassName.trim().toUpperCase()
      .replace(/^LỚP\s+/i, '') // Remove "Lớp " prefix
      .replace(/^LOP\s+/i, '')  // Remove "Lop " prefix
      .replace(/[^A-Z0-9]/g, ''); // Keep only alphanumeric
    
    const newClass: Classroom = {
      id: 'c-' + Date.now(),
      name: newClassName,
      grade: '1',
      classCode: sanitizedName || Math.random().toString(36).substring(2, 5).toUpperCase()
    };
    const updatedClasses = [...classrooms, newClass];
    onSaveClassrooms(updatedClasses);
    if (!selectedClassId) setSelectedClassId(newClass.id);
    setNewClassName('');
    setShowAddClass(false);
  };

  const handleDeleteClass = (id: string) => {
    const classToDelete = classrooms.find(c => c.id === id);
    if (!classToDelete) return;
    const affectedStudents = students.filter(s => s.classId === id);
    const affectedStudentIds = affectedStudents.map(s => s.id);
    const updatedClasses = classrooms.filter(c => c.id !== id);
    
    if (onDeleteClassroom) {
      onDeleteClassroom(id);
    } else {
      onSaveClassrooms(updatedClasses);
    }
    
    const updatedStudents = students.filter(s => s.classId !== id);
    onSaveStudents(updatedStudents);
    onClearStudentData(affectedStudentIds);
    if (selectedClassId === id) setSelectedClassId(updatedClasses[0]?.id || '');
    setShowDeleteClassConfirm(null);
  };

  const handleDeleteStudent = (id: string) => {
    if (onDeleteStudent) {
      onDeleteStudent(id);
    } else {
      onSaveStudents(students.filter(s => s.id !== id));
    }
    onClearStudentData([id]);
    setShowDeleteStudentConfirm(null);
    if (selectedStudentHistory?.id === id) setSelectedStudentHistory(null);
  };

  const handlePlayAudio = (record: ProgressRecord) => {
    if (playingAudioId === record.id) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
      return;
    }
    const audioUrl = record.audioBase64 ? `data:audio/webm;base64,${record.audioBase64}` : record.audioUrl;
    if (!audioUrl) return;
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => setPlayingAudioId(null);
    audioRef.current = audio;
    setPlayingAudioId(record.id);
  };

  const classStudents = students.filter(s => s.classId === selectedClassId);
  const studentHistory = selectedStudentHistory 
    ? progress.filter(p => p.studentId === selectedStudentHistory.id)
    : [];

  return (
    <div className="space-y-10 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-indigo-900">Bảng Điều Khiển Giáo Viên</h2>
          <p className="text-indigo-400 font-bold">Chào mừng Thầy Cô đã trở lại với lớp học!</p>
        </div>
        <div className="flex bg-white p-2 rounded-[2rem] shadow-lg ring-4 ring-indigo-50">
          <button 
            onClick={() => setActiveTab('progress')} 
            className={`px-8 py-3 rounded-[1.5rem] font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'progress' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-indigo-600'}`}
          >
            <History size={18} /> Tiến độ học tập
          </button>
          <button 
            onClick={() => setActiveTab('assignments')} 
            className={`px-8 py-3 rounded-[1.5rem] font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'assignments' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-indigo-600'}`}
          >
            <ClipboardList size={18} /> Giao bài tập
          </button>
        </div>
      </div>

      {activeTab === 'progress' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT QUẢN LÝ LỚP HỌC */}
          <div className="lg:col-span-4 space-y-6">
             <div className="flex gap-4 mb-6">
              <button onClick={() => setShowAddClass(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-indigo-600 font-black rounded-2xl shadow-sm border border-indigo-50 hover:bg-indigo-50 transition-all text-sm">
                <FolderPlus size={16} /> Thêm Lớp
              </button>
              <button 
                onClick={() => setShowAddStudent(true)} 
                disabled={classrooms.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all text-sm"
              >
                <UserPlus size={16} /> Thêm HS
              </button>
            </div>
             <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-indigo-50">
                <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2"><GraduationCap size={20} className="text-indigo-600" /> Quản lý Lớp Học</h3>

              <div className="space-y-3">
                {classrooms.map(c => (
                  <div key={c.id} className="relative group">
                    <button
                      onClick={() => { setSelectedClassId(c.id); setSelectedStudentHistory(null); }}
                      className={`w-full p-5 rounded-2xl font-black text-left transition-all border-b-4 flex flex-col justify-between ${selectedClassId === c.id ? 'bg-indigo-600 text-white border-indigo-900 shadow-lg' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate pr-8">{c.name}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] shrink-0 ${selectedClassId === c.id ? 'bg-white/20' : 'bg-gray-200 text-gray-400'}`}>
                          {students.filter(s => s.classId === c.id).length} HS
                        </span>
                      </div>
                      {c.classCode && (
                        <div className={`mt-2 text-xs font-bold ${selectedClassId === c.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                          Mã lớp: <span className="tracking-widest uppercase">{c.classCode}</span>
                        </div>
                      )}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowDeleteClassConfirm(c.id); }}
                      className="absolute right-3 top-4 p-2 text-red-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
           </section>
        </div>

        {/* CỘT DANH SÁCH HỌC SINH & LỊCH SỬ */}
        <div className="lg:col-span-8">
           {!selectedStudentHistory ? (
             <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-indigo-50 min-h-[400px]">
                <h3 className="text-2xl font-black text-gray-800 mb-8">
                  {classrooms.find(c => c.id === selectedClassId)?.name ? `Học sinh lớp ${classrooms.find(c => c.id === selectedClassId)?.name}` : 'Chọn một lớp học'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classStudents.map(student => (
                    <div key={student.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-md border border-transparent hover:border-indigo-100 transition-all cursor-pointer" onClick={() => setSelectedStudentHistory(student)}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-sm" style={{ backgroundColor: student.avatarColor }}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-gray-800">{student.name}</p>
                          <p className="text-[10px] font-bold text-indigo-500 uppercase flex items-center gap-1">
                            <History size={10} /> Xem lịch sử ({progress.filter(p => p.studentId === student.id).length})
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowDeleteStudentConfirm(student.id); }}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <UserMinus size={18} />
                      </button>
                    </div>
                  ))}
                  {selectedClassId && classStudents.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-300 italic border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center gap-4">
                       <Users size={48} className="opacity-20" />
                       <p>Lớp học trống. Thầy cô hãy nhấn "Thêm Học Sinh" nhé!</p>
                    </div>
                  )}
                </div>
             </section>
           ) : (
             <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-indigo-50 min-h-[400px] space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedStudentHistory(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <X className="text-gray-400" />
                    </button>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-sm" style={{ backgroundColor: selectedStudentHistory.avatarColor }}>
                       {selectedStudentHistory.name.charAt(0)}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-gray-800">{selectedStudentHistory.name}</h3>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lịch sử rèn luyện chi tiết</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {studentHistory.length > 0 ? studentHistory.map((record) => (
                    <div key={record.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${record.activityType === 'reading' ? 'bg-orange-100 text-orange-600' : record.activityType === 'writing' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                           {record.activityType === 'reading' ? <Mic size={24} /> : record.activityType === 'writing' ? <PenTool size={24} /> : <Trophy size={24} />}
                        </div>
                        <div>
                          <p className="font-black text-gray-800">{record.lessonTitle}</p>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                               <Calendar size={10} /> {new Date(record.timestamp).toLocaleDateString('vi-VN')} {new Date(record.timestamp).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                             </span>
                             <span className="px-2 py-0.5 bg-white rounded-full text-[9px] font-black text-indigo-500 border border-indigo-50 uppercase tracking-tighter">
                               {record.activityType === 'reading' ? 'Luyện đọc' : record.activityType === 'writing' ? 'Luyện viết' : 'Vận dụng'}
                             </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col gap-2">
                          {(record.audioBase64 || record.audioUrl) && (
                             <button 
                              onClick={() => handlePlayAudio(record)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all ${playingAudioId === record.id ? 'bg-indigo-600 text-white animate-pulse' : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50'}`}
                             >
                               {playingAudioId === record.id ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                               {playingAudioId === record.id ? 'Đang phát' : 'Nghe bé đọc'}
                             </button>
                          )}
                          <button
                            onClick={() => {
                              setGradingRecord(record);
                              setNewScore(record.teacherScore || record.score);
                              setNewComment(record.comment || '');
                              setTeacherAudioBase64(record.teacherAudioBase64 || null);
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
                          >
                            <PenTool size={14} />
                            Chấm bài
                          </button>
                          {record.teacherAudioBase64 && (
                            <button
                              onClick={() => {
                                if (audioRef.current) audioRef.current.pause();
                                const audio = new Audio(`data:audio/webm;base64,${record.teacherAudioBase64}`);
                                audio.play();
                                audioRef.current = audio;
                              }}
                              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100"
                            >
                              <Headphones size={14} />
                              Nghe nhận xét
                            </button>
                          )}
                          {record.parentAudioBase64 && (
                            <button
                              onClick={() => {
                                if (audioRef.current) audioRef.current.pause();
                                const audio = new Audio(`data:audio/webm;base64,${record.parentAudioBase64}`);
                                audio.play();
                                audioRef.current = audio;
                              }}
                              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100"
                            >
                              <Headphones size={14} />
                              Phụ huynh nhận xét
                            </button>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-yellow-500 justify-end mb-1">
                            {Array.from({length: 5}).map((_, i) => (
                              <Star key={i} size={10} fill={i < Math.ceil((record.teacherScore || record.score)/2) ? "currentColor" : "none"} />
                            ))}
                          </div>
                          <p className="text-2xl font-black text-indigo-600 leading-none">{record.teacherScore || record.score}<span className="text-xs text-indigo-300 opacity-50">/10</span></p>
                        </div>
                      </div>

                      {/* Hiển thị nhận xét của Gemini AI khi hover hoặc ở màn hình lớn */}
                      <div className="md:hidden mt-2 pt-2 border-t border-gray-100">
                         <p className="text-xs text-gray-500 italic font-medium leading-relaxed">"{record.comment}"</p>
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center text-gray-300 italic border-4 border-dashed border-gray-50 rounded-[3rem] flex flex-col items-center gap-4">
                       <BookCheck size={48} className="opacity-20" />
                       <p>Bé chưa hoàn thành bài luyện tập nào trong học phần này.</p>
                    </div>
                  )}
                </div>
             </section>
           )}
        </div>
      </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-indigo-900 flex items-center gap-3">
              <ClipboardList size={28} className="text-indigo-600" />
              Danh sách bài tập đã giao
            </h3>
            <button 
              onClick={() => setShowAddAssignment(true)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:bg-indigo-700 transition-all"
            >
              <Plus size={18} /> Giao bài mới
            </button>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-indigo-50 text-center flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center">
                <ClipboardList size={48} />
              </div>
              <h4 className="text-xl font-black text-gray-800">Chưa có bài tập nào được giao</h4>
              <p className="text-gray-500 font-medium max-w-md">Thầy Cô hãy nhấn nút "Giao bài mới" để tạo bài tập về nhà cho các bé nhé!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map(assignment => {
                const lesson = lessons.find(l => l.id === assignment.lessonId);
                const isOverdue = new Date(assignment.dueDate) < new Date();
                
                return (
                  <div key={assignment.id} className="bg-white p-6 rounded-[2.5rem] shadow-xl border-b-[8px] border-indigo-100 hover:-translate-y-2 transition-all relative group">
                    <button 
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100"
                      title="Xóa bài tập"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                          <BookCheck size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-lg text-gray-800 line-clamp-2">{lesson?.title || 'Bài học không xác định'}</h4>
                          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full mt-1">
                            Tập {lesson?.volume || 1}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className={isOverdue ? 'text-red-500' : 'text-indigo-500'} />
                          <span className="font-bold text-gray-600">Hạn nộp:</span>
                          <span className={`font-black ${isOverdue ? 'text-red-600' : 'text-indigo-600'}`}>
                            {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        {assignment.notes && (
                          <div className="text-sm">
                            <span className="font-bold text-gray-600 block mb-1">Lời dặn:</span>
                            <p className="text-gray-500 italic line-clamp-3">{assignment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals: Thêm Lớp, Thêm HS, Xác nhận Xóa (Giữ nguyên logic CSS Indigo-900 như yêu cầu) */}
      {showAddClass && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-sm" onClick={() => setShowAddClass(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative z-10 animate-pop">
            <h3 className="text-2xl font-black text-gray-800 mb-6">Thêm Lớp Học Mới</h3>
            <input 
              type="text" autoFocus value={newClassName} 
              onChange={(e) => setNewClassName(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
              placeholder="Nhập tên lớp (VD: 1A, 1B...)" 
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-indigo-400 outline-none font-bold mb-6 text-indigo-900 placeholder:text-gray-400" 
            />
            <div className="flex gap-4">
              <button onClick={() => setShowAddClass(false)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black">Hủy</button>
              <button onClick={handleAddClass} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black">Tạo Lớp</button>
            </div>
          </div>
        </div>
      )}

      {showAddStudent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-sm" onClick={() => setShowAddStudent(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative z-10 animate-pop">
            <h3 className="text-2xl font-black text-gray-800 mb-6">Thêm Học Sinh</h3>
            <div className="space-y-4">
              <input 
                type="text" autoFocus value={newStudentName} 
                onChange={(e) => setNewStudentName(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
                placeholder="Họ và tên học sinh" 
                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-indigo-400 outline-none font-bold text-indigo-900 placeholder:text-gray-400" 
              />
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Ghi danh vào lớp</label>
                <select 
                  value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 font-bold outline-none focus:border-indigo-400 text-indigo-900"
                >
                  {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAddStudent(false)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black">Hủy</button>
                <button onClick={handleAddStudent} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black">Lưu Thông Tin</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddAssignment && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-sm" onClick={() => setShowAddAssignment(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative z-10 animate-pop">
            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <ClipboardList size={24} className="text-indigo-600" /> Giao Bài Tập Mới
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Chọn bài học</label>
                <select 
                  value={newAssignmentLessonId} onChange={(e) => setNewAssignmentLessonId(e.target.value)} 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 font-bold outline-none focus:border-indigo-400 text-indigo-900"
                >
                  {lessons.map(l => <option key={l.id} value={l.id}>{l.title} (Tập {l.volume})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Hạn nộp bài</label>
                <input 
                  type="date" 
                  value={newAssignmentDueDate} 
                  onChange={(e) => setNewAssignmentDueDate(e.target.value)} 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-indigo-400 outline-none font-bold text-indigo-900" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Lời dặn dò (Tùy chọn)</label>
                <textarea 
                  value={newAssignmentNotes} 
                  onChange={(e) => setNewAssignmentNotes(e.target.value)} 
                  placeholder="Ví dụ: Các con nhớ đọc to, rõ ràng nhé!" 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-indigo-400 outline-none font-medium text-indigo-900 placeholder:text-gray-400 min-h-[100px]" 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAddAssignment(false)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black">Hủy</button>
                <button onClick={handleAddAssignment} disabled={!newAssignmentLessonId || !newAssignmentDueDate} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black disabled:opacity-50">Giao Bài</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Xác nhận xóa lớp */}
      {showDeleteClassConfirm && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-red-900/60 backdrop-blur-sm" onClick={() => setShowDeleteClassConfirm(null)}></div>
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative z-10 animate-pop text-center space-y-6">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto"><AlertTriangle size={40} /></div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-800">Xác nhận xóa lớp?</h3>
              <p className="text-gray-500 font-medium">Lớp <strong>{classrooms.find(c => c.id === showDeleteClassConfirm)?.name}</strong> và toàn bộ dữ liệu của <strong>{students.filter(s => s.classId === showDeleteClassConfirm).length} học sinh</strong> sẽ bị xóa vĩnh viễn.</p>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowDeleteClassConfirm(null)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black">Hủy bỏ</button>
              <button onClick={() => handleDeleteClass(showDeleteClassConfirm)} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg">Đồng ý Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* Xác nhận xóa học sinh */}
      {showDeleteStudentConfirm && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-red-900/60 backdrop-blur-sm" onClick={() => setShowDeleteStudentConfirm(null)}></div>
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative z-10 animate-pop text-center space-y-6">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto"><UserMinus size={40} /></div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-800">Xóa học sinh?</h3>
              <p className="text-gray-500 font-medium">Bé <strong>{students.find(s => s.id === showDeleteStudentConfirm)?.name}</strong> sẽ bị xóa khỏi lớp cùng toàn bộ lịch sử luyện tập.</p>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowDeleteStudentConfirm(null)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black">Hủy</button>
              <button onClick={() => handleDeleteStudent(showDeleteStudentConfirm)} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black">Xác nhận Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* Chấm bài Modal */}
      {gradingRecord && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-sm" onClick={() => setGradingRecord(null)}></div>
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative z-10 animate-pop">
            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <PenTool size={24} className="text-indigo-600" /> Chấm Bài
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Điểm số (0-10)</label>
                <input 
                  type="number" 
                  min="0"
                  max="10"
                  value={newScore} 
                  onChange={(e) => setNewScore(Number(e.target.value))} 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-indigo-400 outline-none font-bold text-indigo-900" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Nhận xét</label>
                <textarea 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)} 
                  placeholder="Nhận xét của giáo viên..." 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-indigo-400 outline-none font-medium text-indigo-900 placeholder:text-gray-400 min-h-[100px]" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Ghi âm nhận xét</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={isRecordingTeacher ? handleStopRecordingTeacher : handleStartRecordingTeacher}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${isRecordingTeacher ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100'}`}
                  >
                    {isRecordingTeacher ? <Square size={18} fill="currentColor" /> : <Mic size={18} />}
                    {isRecordingTeacher ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
                  </button>
                  {teacherAudioBase64 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (audioRef.current) audioRef.current.pause();
                          const audio = new Audio(`data:audio/webm;base64,${teacherAudioBase64}`);
                          audio.play();
                          audioRef.current = audio;
                        }}
                        className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                        title="Nghe lại"
                      >
                        <Play size={18} fill="currentColor" />
                      </button>
                      <button
                        onClick={() => setTeacherAudioBase64(null)}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                        title="Xóa ghi âm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setGradingRecord(null)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black">Hủy</button>
                <button 
                  onClick={() => {
                    if (onUpdateProgress) {
                      onUpdateProgress({
                        ...gradingRecord,
                        teacherScore: newScore,
                        comment: newComment,
                        teacherAudioBase64: teacherAudioBase64 || gradingRecord.teacherAudioBase64
                      });
                    }
                    setGradingRecord(null);
                  }} 
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
