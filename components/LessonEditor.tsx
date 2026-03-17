
import React, { useState } from 'react';
import { Lesson, Exercise } from '../types';
import { LESSONS as SGK_LESSONS } from '../constants';
import { X, Save, Plus, Trash2, RotateCcw, Copy, BookOpen, Edit3, ArrowRight, Sparkles, Mic, FileText, AlignLeft, AlignCenter, AlignRight, Link, Video } from 'lucide-react';
import AudioRecorder from './AudioRecorder';

interface LessonEditorProps {
  lesson: Lesson;
  onSave: (updatedLesson: Lesson) => void;
  onCancel: () => void;
  onReset: () => void;
}

const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, onSave, onCancel, onReset }) => {
  const [editedLesson, setEditedLesson] = useState<Lesson>({ ...lesson });
  const [activeTab, setActiveTab] = useState<'content' | 'audio'>('content');
  const [textAlignments, setTextAlignments] = useState<{[key: string]: 'left' | 'center' | 'right'}>({
    sentences: editedLesson.textAlignment?.sentences || 'left',
    paragraphs: editedLesson.textAlignment?.paragraphs || 'left'
  });
  const [videoLink, setVideoLink] = useState(editedLesson.videoLink || '');
  
  // Lấy dữ liệu gốc từ hằng số để làm tham chiếu
  const originalSgkLesson = SGK_LESSONS.find(l => l.id === lesson.id);
  const isCustomLesson = !originalSgkLesson;

  const handleUpdateContent = (field: string, value: string[]) => {
    setEditedLesson({
      ...editedLesson,
      content: {
        ...editedLesson.content,
        [field]: value
      }
    });
  };

  const handleUpdateExercise = (id: string, field: string, value: any) => {
    const updatedExercises = editedLesson.content.exercises?.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    );
    setEditedLesson({
      ...editedLesson,
      content: { ...editedLesson.content, exercises: updatedExercises }
    });
  };

  const handleAddMatchingPair = (exId: string) => {
    const exercise = editedLesson.content.exercises?.find(ex => ex.id === exId);
    if (!exercise) return;

    const newPair = { id: Date.now().toString(), word: '', targetValue: '', type: 'sound' as const };
    handleUpdateExercise(exId, 'matchingPairs', [...(exercise.matchingPairs || []), newPair]);
  };

  const handleUpdateMatchingPair = (exId: string, pairId: string, field: string, value: string) => {
    const exercise = editedLesson.content.exercises?.find(ex => ex.id === exId);
    if (!exercise || !exercise.matchingPairs) return;

    const updatedPairs = exercise.matchingPairs.map(p => 
      p.id === pairId ? { ...p, [field]: value } : p
    );
    handleUpdateExercise(exId, 'matchingPairs', updatedPairs);
  };

  const handleDeleteMatchingPair = (exId: string, pairId: string) => {
    const exercise = editedLesson.content.exercises?.find(ex => ex.id === exId);
    if (!exercise || !exercise.matchingPairs) return;

    const updatedPairs = exercise.matchingPairs.filter(p => p.id !== pairId);
    handleUpdateExercise(exId, 'matchingPairs', updatedPairs);
  };

  const addExercise = () => {
    const newEx: Exercise = {
      id: Date.now().toString(),
      type: 'word_finding',
      question: 'Câu hỏi mới?',
      expectedConcept: ''
    };
    setEditedLesson({
      ...editedLesson,
      content: {
        ...editedLesson.content,
        exercises: [...(editedLesson.content.exercises || []), newEx]
      }
    });
  };

  const deleteExercise = (id: string) => {
    setEditedLesson({
      ...editedLesson,
      content: {
        ...editedLesson.content,
        exercises: editedLesson.content.exercises?.filter(ex => ex.id !== id)
      }
    });
  };

  // Fix: Corrected type signature for field to ensure it is treated as a string when calling handleUpdateContent
  const handleUpdateAlignment = (field: string, alignment: 'left' | 'center' | 'right') => {
    setTextAlignments(prev => ({ ...prev, [field]: alignment }));
    setEditedLesson(prev => ({
      ...prev,
      textAlignment: {
        ...prev.textAlignment,
        [field]: alignment
      }
    }));
  };

  const handleUpdateVideoLink = (link: string) => {
    setVideoLink(link);
    setEditedLesson({
      ...editedLesson,
      videoLink: link
    });
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Có thể thêm toast notification ở đây
      console.log('Đã sao chép vào clipboard');
    });
  };

  const copyFromSgk = (field: 'sounds' | 'words' | 'sentences' | 'paragraphs') => {
    if (!originalSgkLesson) return;
    const value = (originalSgkLesson.content as any)[field] as string[] | undefined;
    if (!value) return;
    handleUpdateContent(field, value);
  };

  const handlePasteText = async (field: string) => {
    try {
      const text = await navigator.clipboard.readText();
      if (field === 'sentences') {
        handleUpdateContent('sentences', text.split('\n').filter(s => s.trim()));
      } else if (field === 'paragraphs') {
        handleUpdateContent('paragraphs', text.split('\n').filter(s => s.trim()));
      }
    } catch (err) {
      console.error('Không thể dán từ clipboard:', err);
    }
  };

  const handleSaveAudio = (text: string, base64: string) => {
    setEditedLesson({
      ...editedLesson,
      customAudio: {
        ...(editedLesson.customAudio || {}),
        [text]: base64
      }
    });
  };

  const handleDeleteAudio = (text: string) => {
    const newCustomAudio = { ...(editedLesson.customAudio || {}) };
    delete newCustomAudio[text];
    setEditedLesson({
      ...editedLesson,
      customAudio: newCustomAudio
    });
  };

  const allTextsToRecord = [
    ...(editedLesson.content.sounds || []),
    ...(editedLesson.content.words || []),
    ...(editedLesson.content.sentences || []),
    ...(editedLesson.content.paragraphs || [])
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 md:p-8">
      <div className="bg-white w-full max-w-7xl h-full max-h-[95vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border-t-[12px] border-purple-600 animate-pop">
        
        {/* Header */}
        <div className="px-8 py-4 border-b flex justify-between items-center bg-purple-50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Edit3 size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-purple-900">Bàn Làm Việc Giáo Viên</h2>
                <p className="text-purple-600 text-[10px] font-bold">Đang sửa: {lesson.title}</p>
              </div>
            </div>

            <div className="h-10 w-px bg-purple-200 hidden md:block"></div>

            <div className="flex bg-white p-1 rounded-2xl shadow-inner border border-purple-100">
              <button 
                onClick={() => setActiveTab('content')}
                className={`px-6 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${activeTab === 'content' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-400 hover:bg-purple-50'}`}
              >
                <FileText size={16} /> Nội dung
              </button>
              <button 
                onClick={() => setActiveTab('audio')}
                className={`px-6 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${activeTab === 'audio' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-400 hover:bg-purple-50'}`}
              >
                <Mic size={16} /> Ghi âm mẫu
              </button>
            </div>
          </div>
          <button onClick={onCancel} className="p-3 hover:bg-white rounded-full transition-colors text-purple-900 shadow-sm"><X /></button>
        </div>

        {/* Main Workspace (Split View) */}
        <div className="flex-1 flex overflow-hidden">
          
          {activeTab === 'content' ? (
            <>
              {/* Left Panel: SGK Reference (Read Only) */}
              <div className="w-1/3 bg-gray-50 border-r overflow-y-auto p-6 hidden lg:block">
            <div className="flex items-center gap-2 mb-6 text-gray-500">
              <BookOpen size={20} />
              <h3 className="font-black uppercase tracking-widest text-xs">
                {isCustomLesson ? 'Bài học tự soạn' : 'Nội dung SGK gốc (Tham khảo)'}
              </h3>
            </div>

            <div className="space-y-8 opacity-70">
              {isCustomLesson ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Edit3 size={32} />
                  </div>
                  <p className="text-sm font-bold text-gray-400 italic">Đây là bài học do Thầy Cô tự soạn, không có nội dung đối chiếu từ SGK.</p>
                </div>
              ) : (
                <>
                  <SgkRefSection title="Âm/Vần" content={originalSgkLesson?.content.sounds} />
                  <SgkRefSection title="Từ ngữ" content={originalSgkLesson?.content.words} />
                  <SgkRefSection title="Câu" content={originalSgkLesson?.content.sentences} />
                  <SgkRefSection title="Đoạn văn" content={originalSgkLesson?.content.paragraphs} />
                  
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Bài tập mặc định</p>
                    {originalSgkLesson?.content.exercises?.map((ex, i) => (
                      <div key={i} className="text-xs p-3 bg-white rounded-xl border border-gray-100 italic">
                        {ex.question}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Panel: Editor (Active) */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-white">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EditorField label="Tiêu đề bài học">
                <input 
                  type="text" 
                  value={editedLesson.title} 
                  onChange={(e) => setEditedLesson({...editedLesson, title: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-purple-50/30 border-2 border-purple-100 focus:border-purple-400 outline-none font-bold text-purple-900"
                />
              </EditorField>
              <EditorField label="Số trang (SGK)">
                <input 
                  type="number" 
                  value={editedLesson.pageNumber} 
                  onChange={(e) => setEditedLesson({...editedLesson, pageNumber: parseInt(e.target.value)})}
                  className="w-full p-4 rounded-2xl bg-purple-50/30 border-2 border-purple-100 focus:border-purple-400 outline-none font-bold"
                />
              </EditorField>
            </div>

            <hr className="border-gray-100" />

            {/* Arrays Editing with Copy buttons */}
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-purple-900 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Âm / Vần (Cách nhau bằng dấu phẩy)
                  </label>
                  {!isCustomLesson && (
                    <button onClick={() => copyFromSgk('sounds')} className="text-[10px] flex items-center gap-1 text-purple-600 font-bold hover:underline bg-purple-50 px-3 py-1 rounded-full"><Copy size={12}/> Chép từ SGK</button>
                  )}
                </div>
                <textarea 
                  value={editedLesson.content.sounds?.join(', ') || ''} 
                  onChange={(e) => handleUpdateContent('sounds', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full p-6 rounded-[2rem] bg-white border-2 border-purple-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none min-h-[80px] font-black text-3xl text-orange-600 shadow-sm transition-all"
                  placeholder="Ví dụ: a, b, c, ch, tr..."
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-purple-900 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Từ ngữ (Cách nhau bằng dấu phẩy)
                  </label>
                  {!isCustomLesson && (
                    <button onClick={() => copyFromSgk('words')} className="text-[10px] flex items-center gap-1 text-purple-600 font-bold hover:underline bg-purple-50 px-3 py-1 rounded-full"><Copy size={12}/> Chép từ SGK</button>
                  )}
                </div>
                <textarea 
                  value={editedLesson.content.words?.join(', ') || ''} 
                  onChange={(e) => handleUpdateContent('words', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full p-6 rounded-[2rem] bg-white border-2 border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none min-h-[100px] font-black text-2xl text-blue-600 shadow-sm transition-all"
                  placeholder="Ví dụ: ba ba, cá cờ, gà ri..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-purple-900 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Câu luyện đọc (Mỗi câu 1 dòng)
                    </label>
                    <div className="flex gap-2">
                      {!isCustomLesson && (
                        <button onClick={() => copyFromSgk('sentences')} className="text-[10px] flex items-center gap-1 text-purple-600 font-bold hover:underline bg-purple-50 px-3 py-1 rounded-full"><Copy size={12}/> Chép từ SGK</button>
                      )}
                      <button onClick={() => handleCopyText(editedLesson.content.sentences?.join('\n') || '')} className="text-[10px] flex items-center gap-1 text-blue-600 font-bold hover:underline bg-blue-50 px-3 py-1 rounded-full"><Copy size={12}/> Sao chép</button>
                      <button onClick={() => handlePasteText('sentences')} className="text-[10px] flex items-center gap-1 text-green-600 font-bold hover:underline bg-green-50 px-3 py-1 rounded-full"><FileText size={12}/> Dán</button>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={() => handleUpdateAlignment('sentences', 'left')}
                      className={`p-2 rounded-lg border ${textAlignments.sentences === 'left' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button 
                      onClick={() => handleUpdateAlignment('sentences', 'center')}
                      className={`p-2 rounded-lg border ${textAlignments.sentences === 'center' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      <AlignCenter size={16} />
                    </button>
                    <button 
                      onClick={() => handleUpdateAlignment('sentences', 'right')}
                      className={`p-2 rounded-lg border ${textAlignments.sentences === 'right' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      <AlignRight size={16} />
                    </button>
                  </div>
                  <textarea 
                    value={editedLesson.content.sentences?.join('\n') || ''} 
                    onChange={(e) => handleUpdateContent('sentences', e.target.value.split('\n').filter(s => s.trim()))}
                    className="w-full p-6 rounded-[2rem] bg-white border-2 border-green-100 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none min-h-[180px] font-bold text-xl text-green-700 leading-relaxed shadow-sm transition-all"
                    style={{ textAlign: textAlignments.sentences }}
                    placeholder="Nhập các câu luyện đọc cho bé..."
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-purple-900 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Đoạn văn (Mỗi đoạn 1 dòng)
                    </label>
                    <div className="flex gap-2">
                      {!isCustomLesson && (
                        <button onClick={() => copyFromSgk('paragraphs')} className="text-[10px] flex items-center gap-1 text-purple-600 font-bold hover:underline bg-purple-50 px-3 py-1 rounded-full"><Copy size={12}/> Chép từ SGK</button>
                      )}
                      <button onClick={() => handleCopyText(editedLesson.content.paragraphs?.join('\n') || '')} className="text-[10px] flex items-center gap-1 text-blue-600 font-bold hover:underline bg-blue-50 px-3 py-1 rounded-full"><Copy size={12}/> Sao chép</button>
                      <button onClick={() => handlePasteText('paragraphs')} className="text-[10px] flex items-center gap-1 text-green-600 font-bold hover:underline bg-green-50 px-3 py-1 rounded-full"><FileText size={12}/> Dán</button>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={() => handleUpdateAlignment('paragraphs', 'left')}
                      className={`p-2 rounded-lg border ${textAlignments.paragraphs === 'left' ? 'bg-purple-100 border-purple-400 text-purple-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button 
                      onClick={() => handleUpdateAlignment('paragraphs', 'center')}
                      className={`p-2 rounded-lg border ${textAlignments.paragraphs === 'center' ? 'bg-purple-100 border-purple-400 text-purple-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      <AlignCenter size={16} />
                    </button>
                    <button 
                      onClick={() => handleUpdateAlignment('paragraphs', 'right')}
                      className={`p-2 rounded-lg border ${textAlignments.paragraphs === 'right' ? 'bg-purple-100 border-purple-400 text-purple-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      <AlignRight size={16} />
                    </button>
                  </div>
                  <textarea 
                    value={editedLesson.content.paragraphs?.join('\n') || ''} 
                    onChange={(e) => handleUpdateContent('paragraphs', e.target.value.split('\n').filter(s => s.trim()))}
                    className="w-full p-6 rounded-[2rem] bg-white border-2 border-purple-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none min-h-[180px] font-bold text-xl text-purple-800 leading-relaxed shadow-sm transition-all"
                    style={{ textAlign: textAlignments.paragraphs }}
                    placeholder="Nhập các đoạn văn luyện đọc..."
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Video Link Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-black text-gray-800 flex items-center gap-2">
                  <Video size={20} className="text-red-500" />
                  Video minh họa (YouTube, Vimeo, etc.)
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="url" 
                      value={videoLink} 
                      onChange={(e) => handleUpdateVideoLink(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-gray-100 focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none font-medium text-gray-800 shadow-sm transition-all"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  <button 
                    onClick={() => handleCopyText(videoLink)}
                    className="px-4 py-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all font-bold"
                    title="Sao chép link"
                  >
                    <Copy size={16} />
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        handleUpdateVideoLink(text);
                      } catch (err) {
                        console.error('Không thể dán từ clipboard:', err);
                      }
                    }}
                    className="px-4 py-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-all font-bold"
                    title="Dán link"
                  >
                    <FileText size={16} />
                  </button>
                </div>
                {videoLink && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 font-medium mb-2">Preview:</p>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe 
                        src={videoLink.replace('watch?v=', 'embed/')} 
                        className="w-full h-full" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        title="Video Preview"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-black text-gray-800">Thử thách vận dụng của riêng lớp</h4>
                <button onClick={addExercise} className="flex items-center gap-2 text-sm font-black text-white bg-purple-600 px-5 py-2.5 rounded-2xl hover:bg-purple-700 shadow-md transition-all active:scale-95">
                  <Plus size={18} /> Thêm bài tập
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {editedLesson.content.exercises?.map((ex, idx) => (
                  <div key={ex.id} className="p-6 bg-purple-50/50 rounded-[2rem] border-2 border-purple-100 space-y-4 relative animate-pop" style={{animationDelay: `${idx * 0.1}s`}}>
                    <button 
                      onClick={() => deleteExercise(ex.id)}
                      className="absolute top-6 right-6 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-xs">{idx + 1}</span>
                      <div className="flex-1 flex gap-2">
                        <select 
                          value={ex.type}
                          onChange={(e) => handleUpdateExercise(ex.id, 'type', e.target.value)}
                          className="p-3 bg-white rounded-xl border-2 border-purple-50 outline-none focus:border-purple-400 font-bold text-purple-600 text-sm"
                        >
                          <option value="selection">Trắc nghiệm</option>
                          <option value="matching">Nối cặp</option>
                          <option value="fill_blank">Điền khuyết</option>
                          <option value="word_finding">Tìm chữ</option>
                          <option value="riddle">Đố vui</option>
                        </select>
                        <input 
                          type="text" 
                          value={ex.question}
                          onChange={(e) => handleUpdateExercise(ex.id, 'question', e.target.value)}
                          className="flex-1 p-3 bg-white rounded-xl border-2 border-purple-50 outline-none focus:border-purple-400 font-bold text-gray-800"
                          placeholder="Nhập câu hỏi thử thách..."
                        />
                      </div>
                    </div>

                    <div className="ml-11 space-y-4">
                      {/* Specific fields based on type */}
                      {(ex.type === 'selection' || ex.type === 'fill_blank') && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Các lựa chọn (Cách nhau bằng dấu phẩy)</label>
                          <input 
                            type="text" 
                            value={ex.options?.join(', ') || ''}
                            onChange={(e) => handleUpdateExercise(ex.id, 'options', e.target.value.split(',').map(s => s.trim()))}
                            className="w-full p-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-purple-400 text-sm font-bold text-blue-600"
                            placeholder="Ví dụ: cá, gà, bò..."
                          />
                          <div className="mt-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase">Đáp án đúng</label>
                            <input 
                              type="text" 
                              value={ex.correctAnswer || ''}
                              onChange={(e) => handleUpdateExercise(ex.id, 'correctAnswer', e.target.value)}
                              className="w-full p-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-purple-400 text-sm font-bold text-green-600"
                              placeholder="Nhập đáp án đúng..."
                            />
                          </div>
                        </div>
                      )}

                      {ex.type === 'matching' && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-gray-400 uppercase">Các cặp nối (Chữ - Âm thanh)</label>
                            <button 
                              onClick={() => handleAddMatchingPair(ex.id)}
                              className="text-[10px] font-black text-purple-600 hover:underline flex items-center gap-1"
                            >
                              <Plus size={12} /> Thêm cặp
                            </button>
                          </div>
                          <div className="space-y-2">
                            {ex.matchingPairs?.map(pair => (
                              <div key={pair.id} className="flex gap-2 items-center">
                                <input 
                                  type="text" 
                                  value={pair.word}
                                  onChange={(e) => handleUpdateMatchingPair(ex.id, pair.id, 'word', e.target.value)}
                                  className="flex-1 p-2 rounded-lg border border-gray-200 text-sm font-bold"
                                  placeholder="Chữ..."
                                />
                                <ArrowRight size={14} className="text-gray-300" />
                                <input 
                                  type="text" 
                                  value={pair.targetValue}
                                  onChange={(e) => handleUpdateMatchingPair(ex.id, pair.id, 'targetValue', e.target.value)}
                                  className="flex-1 p-2 rounded-lg border border-gray-200 text-sm font-bold"
                                  placeholder="Âm thanh đọc..."
                                />
                                <button 
                                  onClick={() => handleDeleteMatchingPair(ex.id, pair.id)}
                                  className="p-2 text-red-400 hover:text-red-600"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Gợi ý cho bé</label>
                          <input 
                            type="text" 
                            value={ex.hint || ''}
                            onChange={(e) => handleUpdateExercise(ex.id, 'hint', e.target.value)}
                            className="w-full p-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-purple-400 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Từ khóa chấm điểm (AI)</label>
                          <input 
                            type="text" 
                            value={ex.expectedConcept}
                            onChange={(e) => handleUpdateExercise(ex.id, 'expectedConcept', e.target.value)}
                            className="w-full p-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-purple-400 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(!editedLesson.content.exercises || editedLesson.content.exercises.length === 0) && (
                  <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 italic">
                    Chưa có bài tập vận dụng nào. Hãy thêm để bé luyện tập thêm nhé!
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-purple-100 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-[1.5rem] flex items-center justify-center">
                      <Mic size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-purple-900">Ghi âm mẫu của Giáo viên</h3>
                      <p className="text-gray-500 font-medium">Thầy Cô có thể tự ghi âm để thay thế giọng đọc AI nếu thấy AI phát âm chưa chuẩn.</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                    <Sparkles className="text-amber-500 shrink-0 mt-1" size={20} />
                    <p className="text-sm text-amber-800 font-medium italic">
                      Lưu ý: Hệ thống sẽ ưu tiên phát bản ghi âm của Thầy Cô trước. Nếu không có bản ghi âm, hệ thống mới sử dụng giọng đọc AI.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {allTextsToRecord.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allTextsToRecord.map((text, idx) => (
                          <AudioRecorder 
                            key={`${text}-${idx}`}
                            label={text}
                            existingAudio={editedLesson.customAudio?.[text]}
                            onSave={(base64) => handleSaveAudio(text, base64)}
                            onDelete={() => handleDeleteAudio(text)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center space-y-4 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <FileText size={48} className="mx-auto text-gray-300" />
                        <p className="text-gray-400 font-bold">Chưa có nội dung nào để ghi âm. Vui lòng thêm Âm, Từ hoặc Câu ở tab "Nội dung".</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t bg-white flex flex-col md:flex-row justify-between items-center gap-4">
          {!isCustomLesson ? (
            <button 
              onClick={onReset}
              className="flex items-center gap-2 text-red-500 font-bold px-4 py-2 rounded-xl hover:bg-red-50 transition-colors text-xs"
            >
              <RotateCcw size={14} /> Khôi phục gốc
            </button>
          ) : (
            <div className="flex items-center gap-2 text-purple-600 font-bold px-4 py-2 text-xs">
              <Sparkles size={14} /> Bài học sáng tạo
            </div>
          )}
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={onCancel}
              className="flex-1 md:flex-none px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95 text-sm"
            >
              Hủy
            </button>
            <button 
              onClick={() => onSave(editedLesson)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-12 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-xl shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all active:scale-95 text-sm"
            >
              <Save size={18} /> Lưu & Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditorField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

const SgkRefSection: React.FC<{ title: string; content?: string[] }> = ({ title, content }) => {
  if (!content || content.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase">
        {title} <ArrowRight size={10} />
      </div>
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-600 font-medium leading-relaxed">
        {content.join(title === 'Âm/Vần' || title === 'Từ ngữ' ? ', ' : '\n')}
      </div>
    </div>
  );
};

export default LessonEditor;
