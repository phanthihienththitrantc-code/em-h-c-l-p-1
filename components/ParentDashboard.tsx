
import React, { useState } from 'react';
import { ProgressRecord, AppTheme, Student } from '../types';
import { APP_THEMES } from '../constants';
import { Heart, Trophy, MessageCircle, Play, Star, Calendar, Download, Square, Palette, Image as ImageIcon, CheckCircle2, PenTool, Mic, Trash2, Headphones } from 'lucide-react';

interface ParentDashboardProps {
  progress: ProgressRecord[];
  currentTheme: AppTheme;
  onUpdateTheme: (theme: AppTheme) => void;
  activeStudent: Student | null;
  students: Student[];
  onUpdateProgress?: (updatedRecord: ProgressRecord) => void;
}

const BACKGROUND_IMAGES = [
  { id: 'none', label: 'Mặc định', url: '' },
  { id: 'clouds', label: 'Mây xanh', url: 'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?auto=format&fit=crop&q=80&w=1200' },
  { id: 'stars', label: 'Ngôi sao', url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=1200' },
  { id: 'paper', label: 'Giấy vẽ', url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1200' },
];

const ParentDashboard: React.FC<ParentDashboardProps> = ({ progress, currentTheme, onUpdateTheme, activeStudent, students, onUpdateProgress }) => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const [gradingRecord, setGradingRecord] = useState<ProgressRecord | null>(null);
  const [newScore, setNewScore] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');
  const [isRecordingParent, setIsRecordingParent] = useState(false);
  const [parentAudioBase64, setParentAudioBase64] = useState<string | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const handleStartRecordingParent = async () => {
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
          setParentAudioBase64(base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecordingParent(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Vui lòng cấp quyền truy cập micro để ghi âm.");
    }
  };

  const handleStopRecordingParent = () => {
    if (mediaRecorderRef.current && isRecordingParent) {
      mediaRecorderRef.current.stop();
      setIsRecordingParent(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (audioInstance) {
        audioInstance.pause();
      }
    };
  }, [audioInstance]);

  // Chỉ lấy tiến trình của học sinh đang đăng nhập
  const studentProgress = activeStudent 
    ? progress.filter(p => p.studentId === activeStudent.id)
    : progress;

  const totalStars = studentProgress.reduce((acc, curr) => acc + Math.ceil(curr.score / 2), 0);

  const classStudents = activeStudent 
    ? students.filter(s => s.classId === activeStudent.classId)
    : [];

  const leaderboard = classStudents.map(student => {
    const studentProg = progress.filter(p => p.studentId === student.id);
    const stars = studentProg.reduce((acc, curr) => acc + Math.ceil(curr.score / 2), 0);
    return { ...student, stars };
  }).sort((a, b) => b.stars - a.stars);

  const handlePlayAudio = (record: ProgressRecord) => {
    if (playingAudioId === record.id) {
      audioInstance?.pause();
      setPlayingAudioId(null);
      return;
    }
    if (audioInstance) audioInstance.pause();
    const audioUrl = record.audioBase64 ? `data:audio/webm;base64,${record.audioBase64}` : record.audioUrl;
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play();
    setAudioInstance(audio);
    setPlayingAudioId(record.id);
    audio.onended = () => setPlayingAudioId(null);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-rose-600 flex items-center gap-3">
            <Heart className="fill-rose-500" /> Hồ Sơ Của {activeStudent ? activeStudent.name : 'Bé'}
          </h2>
          <p className="text-gray-500 font-bold">Xem thành tích và trang trí không gian học tập của riêng con.</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-[3.5rem] p-10 text-white shadow-xl flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="w-32 h-32 bg-white/20 rounded-[2rem] flex items-center justify-center relative shadow-2xl transform hover:rotate-6 transition-transform">
          <Trophy size={64} className="text-yellow-300 drop-shadow-lg" />
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h3 className="text-3xl font-black">Hạng Tích Lũy: Siêu Sao Tiếng Việt</h3>
          <p className="text-xl opacity-90 font-medium italic">"Con đã nhận được tổng cộng {totalStars} ngôi sao lấp lánh!"</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
            {['Học chăm', 'Viết đẹp', 'Đọc tốt', 'Sáng tạo'].map(badge => (
              <span key={badge} className="px-5 py-1.5 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">{badge}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-10">
          <section className="bg-white rounded-[3rem] shadow-xl p-10 border border-gray-100 space-y-8">
            <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
              <Palette className="text-rose-500" /> Trang trí ứng dụng
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {BACKGROUND_IMAGES.map((img) => (
                <button
                  key={img.id}
                  onClick={() => onUpdateTheme({ ...currentTheme, backgroundImage: img.url })}
                  className={`relative aspect-[16/9] rounded-[2rem] border-4 overflow-hidden transition-all group ${
                    currentTheme.backgroundImage === img.url ? 'border-rose-500 ring-8 ring-rose-50' : 'border-gray-50'
                  }`}
                >
                  {img.url ? <img src={img.url} alt={img.label} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={32}/></div>}
                  <div className="absolute bottom-4 left-4 right-4 text-xs font-black text-white drop-shadow-md">{img.label}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <section className="space-y-6">
              <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3"><Calendar className="text-rose-500" /> Nhật ký gần đây</h3>
              <div className="space-y-4">
                {studentProgress.slice(0, 5).map(record => (
                  <div key={record.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500"><Star size={24} fill={record.score >= 8 ? "currentColor" : "none"} /></div>
                    <div className="flex-1">
                      <p className="font-black text-gray-800 leading-tight">{record.lessonTitle}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(record.timestamp).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {(record.audioBase64 || record.audioUrl) && (
                        <button 
                          onClick={() => handlePlayAudio(record)}
                          className={`p-3 rounded-xl transition-all ${playingAudioId === record.id ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-50 text-rose-500 hover:bg-rose-100'}`}
                          title="Nghe bé đọc"
                        >
                          {playingAudioId === record.id ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setGradingRecord(record);
                          setNewScore(record.parentScore || record.teacherScore || record.score);
                          setNewComment(record.comment || '');
                          setParentAudioBase64(record.parentAudioBase64 || null);
                        }}
                        className="p-3 rounded-xl transition-all bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                        title="Chấm bài"
                      >
                        <PenTool size={18} />
                      </button>
                      {record.teacherAudioBase64 && (
                        <button
                          onClick={() => {
                            if (audioInstance) audioInstance.pause();
                            const audio = new Audio(`data:audio/webm;base64,${record.teacherAudioBase64}`);
                            audio.play();
                            setAudioInstance(audio);
                          }}
                          className="p-3 rounded-xl transition-all bg-indigo-50 text-indigo-500 hover:bg-indigo-100"
                          title="Cô giáo nhận xét"
                        >
                          <Headphones size={18} />
                        </button>
                      )}
                      {record.parentAudioBase64 && (
                        <button
                          onClick={() => {
                            if (audioInstance) audioInstance.pause();
                            const audio = new Audio(`data:audio/webm;base64,${record.parentAudioBase64}`);
                            audio.play();
                            setAudioInstance(audio);
                          }}
                          className="p-3 rounded-xl transition-all bg-amber-50 text-amber-500 hover:bg-amber-100"
                          title="Nghe nhận xét"
                        >
                          <Headphones size={18} />
                        </button>
                      )}
                    </div>
                    <div className="text-xl font-black text-rose-600">{record.parentScore || record.teacherScore || record.score}đ</div>
                  </div>
                ))}
              </div>
           </section>

           {activeStudent && leaderboard.length > 0 && (
             <section className="space-y-6 pt-6">
                <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3"><Trophy className="text-yellow-500" /> Bảng xếp hạng lớp</h3>
                <div className="bg-white rounded-[3rem] shadow-xl p-6 border border-gray-100 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {leaderboard.map((student, index) => (
                    <div key={student.id} className={`flex items-center gap-4 p-4 rounded-2xl ${student.id === activeStudent.id ? 'bg-rose-50 border border-rose-100' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${index === 0 ? 'bg-yellow-400 text-white shadow-md' : index === 1 ? 'bg-gray-300 text-white shadow-md' : index === 2 ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm" style={{ backgroundColor: student.avatarColor }}>
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-black truncate ${student.id === activeStudent.id ? 'text-rose-600' : 'text-gray-800'}`}>{student.name}</p>
                      </div>
                      <div className="flex items-center gap-1 font-black text-yellow-500 shrink-0 bg-yellow-50 px-3 py-1.5 rounded-full">
                        {student.stars} <Star size={16} fill="currentColor" />
                      </div>
                    </div>
                  ))}
                </div>
             </section>
           )}
        </div>
      </div>

      {/* Chấm bài Modal */}
      {gradingRecord && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-rose-900/60 backdrop-blur-sm" onClick={() => setGradingRecord(null)}></div>
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative z-10 animate-pop">
            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <PenTool size={24} className="text-rose-600" /> Chấm Bài
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
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-rose-400 outline-none font-bold text-rose-900" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Nhận xét</label>
                <textarea 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)} 
                  placeholder="Nhận xét của phụ huynh..." 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-rose-400 outline-none font-medium text-rose-900 placeholder:text-gray-400 min-h-[100px]" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Ghi âm nhận xét</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={isRecordingParent ? handleStopRecordingParent : handleStartRecordingParent}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${isRecordingParent ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100'}`}
                  >
                    {isRecordingParent ? <Square size={18} fill="currentColor" /> : <Mic size={18} />}
                    {isRecordingParent ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
                  </button>
                  {parentAudioBase64 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (audioInstance) audioInstance.pause();
                          const audio = new Audio(`data:audio/webm;base64,${parentAudioBase64}`);
                          audio.play();
                          setAudioInstance(audio);
                        }}
                        className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                        title="Nghe lại"
                      >
                        <Play size={18} fill="currentColor" />
                      </button>
                      <button
                        onClick={() => setParentAudioBase64(null)}
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
                        parentScore: newScore,
                        comment: newComment,
                        parentAudioBase64: parentAudioBase64 || gradingRecord.parentAudioBase64
                      });
                    }
                    setGradingRecord(null);
                  }} 
                  className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black"
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

export default ParentDashboard;
