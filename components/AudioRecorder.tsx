
import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2, Check, Loader2 } from 'lucide-react';
import { AudioService } from '../services/audioService';

interface AudioRecorderProps {
  onSave: (base64: string) => void;
  onDelete?: () => void;
  existingAudio?: string;
  label: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSave, onDelete, existingAudio, label }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | undefined>(existingAudio);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioService = AudioService.getInstance();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setAudioBase64(base64);
          onSave(base64);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Không thể truy cập micro. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = async () => {
    if (audioBase64) {
      setIsPlaying(true);
      try {
        await audioService.playFromBase64(audioBase64);
      } catch (err) {
        console.error("Error playing audio:", err);
      } finally {
        setIsPlaying(false);
      }
    }
  };

  const handleDelete = () => {
    setAudioBase64(undefined);
    if (onDelete) onDelete();
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 transition-all">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm font-bold text-gray-700 truncate">{label}</p>
      </div>
      
      <div className="flex items-center gap-2">
        {audioBase64 ? (
          <>
            <button 
              onClick={playAudio}
              disabled={isPlaying}
              className={`p-2 rounded-xl transition-all ${isPlaying ? 'bg-purple-100 text-purple-400' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}
              title="Nghe thử"
            >
              {isPlaying ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
              title="Xóa ghi âm"
            >
              <Trash2 size={18} />
            </button>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-[10px] font-black uppercase">
              <Check size={12} /> Đã ghi
            </div>
          </>
        ) : (
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' 
                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-100'
            }`}
          >
            {isRecording ? (
              <>
                <Square size={16} fill="currentColor" /> Dừng
              </>
            ) : (
              <>
                <Mic size={16} /> Ghi âm
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
