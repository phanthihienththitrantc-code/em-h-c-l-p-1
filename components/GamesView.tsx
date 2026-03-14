import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Trophy, RefreshCw, Volume2 } from 'lucide-react';
import { AudioService } from '../services/audioService';

import { ProgressRecord } from '../types';

interface GamesViewProps {
  onBack: () => void;
  onSaveProgress: (record: Omit<ProgressRecord, 'id' | 'timestamp'>) => void;
}

type GameLevel = 'easy' | 'medium' | 'hard';

interface GameQuestion {
  id: string;
  type: 'letter' | 'vowel_consonant' | 'rhyme';
  question: string;
  options: string[];
  correctAnswer: string;
  audioText?: string;
}

const ALL_GAMES_DATA: Record<GameLevel, GameQuestion[]> = {
  easy: [
    { id: 'e1', type: 'letter', question: 'Chữ nào là chữ a?', options: ['a', 'b', 'c', 'd'], correctAnswer: 'a', audioText: 'Tìm chữ a' },
    { id: 'e2', type: 'letter', question: 'Chữ nào là chữ b?', options: ['a', 'b', 'c', 'd'], correctAnswer: 'b', audioText: 'Tìm chữ b' },
    { id: 'e3', type: 'letter', question: 'Chữ nào là chữ c?', options: ['a', 'b', 'c', 'd'], correctAnswer: 'c', audioText: 'Tìm chữ c' },
    { id: 'e4', type: 'letter', question: 'Chữ nào là chữ o?', options: ['o', 'ô', 'ơ', 'a'], correctAnswer: 'o', audioText: 'Tìm chữ o' },
    { id: 'e5', type: 'letter', question: 'Chữ nào là chữ e?', options: ['e', 'ê', 'i', 'u'], correctAnswer: 'e', audioText: 'Tìm chữ e' },
    { id: 'e6', type: 'letter', question: 'Chữ nào là chữ đ?', options: ['d', 'đ', 'b', 'p'], correctAnswer: 'đ', audioText: 'Tìm chữ đ' },
    { id: 'e7', type: 'letter', question: 'Chữ nào là chữ m?', options: ['n', 'm', 'h', 'k'], correctAnswer: 'm', audioText: 'Tìm chữ m' },
    { id: 'e8', type: 'letter', question: 'Chữ nào là chữ t?', options: ['t', 'l', 'h', 'i'], correctAnswer: 't', audioText: 'Tìm chữ t' },
    { id: 'e9', type: 'letter', question: 'Chữ nào là chữ u?', options: ['u', 'ư', 'o', 'ơ'], correctAnswer: 'u', audioText: 'Tìm chữ u' },
    { id: 'e10', type: 'letter', question: 'Chữ nào là chữ v?', options: ['v', 'y', 'x', 's'], correctAnswer: 'v', audioText: 'Tìm chữ v' },
  ],
  medium: [
    { id: 'm1', type: 'vowel_consonant', question: 'Chữ nào là nguyên âm?', options: ['a', 'b', 'c', 'd'], correctAnswer: 'a', audioText: 'Chữ nào là nguyên âm?' },
    { id: 'm2', type: 'vowel_consonant', question: 'Chữ nào là phụ âm?', options: ['o', 'e', 'm', 'i'], correctAnswer: 'm', audioText: 'Chữ nào là phụ âm?' },
    { id: 'm3', type: 'vowel_consonant', question: 'Chữ nào là nguyên âm?', options: ['h', 'k', 'l', 'u'], correctAnswer: 'u', audioText: 'Chữ nào là nguyên âm?' },
    { id: 'm4', type: 'vowel_consonant', question: 'Chữ nào là phụ âm?', options: ['a', 'ê', 'n', 'ơ'], correctAnswer: 'n', audioText: 'Chữ nào là phụ âm?' },
    { id: 'm5', type: 'vowel_consonant', question: 'Chữ nào là nguyên âm?', options: ['p', 'q', 'r', 'i'], correctAnswer: 'i', audioText: 'Chữ nào là nguyên âm?' },
    { id: 'm6', type: 'vowel_consonant', question: 'Chữ nào là phụ âm?', options: ['y', 't', 'u', 'ư'], correctAnswer: 't', audioText: 'Chữ nào là phụ âm?' },
    { id: 'm7', type: 'vowel_consonant', question: 'Chữ nào là nguyên âm?', options: ['s', 'x', 'e', 'v'], correctAnswer: 'e', audioText: 'Chữ nào là nguyên âm?' },
    { id: 'm8', type: 'vowel_consonant', question: 'Chữ nào là phụ âm?', options: ['o', 'ô', 'ơ', 'h'], correctAnswer: 'h', audioText: 'Chữ nào là phụ âm?' },
  ],
  hard: [
    { id: 'h1', type: 'rhyme', question: 'Vần nào có âm cuối là "n"?', options: ['an', 'am', 'ap', 'at'], correctAnswer: 'an', audioText: 'Vần nào có âm cuối là n?' },
    { id: 'h2', type: 'rhyme', question: 'Vần nào có âm đầu là "o"?', options: ['oa', 'eo', 'ao', 'au'], correctAnswer: 'oa', audioText: 'Vần nào có âm đầu là o?' },
    { id: 'h3', type: 'rhyme', question: 'Ghép chữ "b" và vần "an" ta được tiếng gì?', options: ['ban', 'bàn', 'bán', 'bạn'], correctAnswer: 'ban', audioText: 'Ghép chữ b và vần an ta được tiếng gì?' },
    { id: 'h4', type: 'rhyme', question: 'Vần nào có âm cuối là "m"?', options: ['an', 'am', 'ap', 'at'], correctAnswer: 'am', audioText: 'Vần nào có âm cuối là m?' },
    { id: 'h5', type: 'rhyme', question: 'Ghép chữ "c" và vần "ao" ta được tiếng gì?', options: ['cao', 'cào', 'cáo', 'cạo'], correctAnswer: 'cao', audioText: 'Ghép chữ c và vần ao ta được tiếng gì?' },
    { id: 'h6', type: 'rhyme', question: 'Vần nào có âm cuối là "t"?', options: ['an', 'am', 'ap', 'at'], correctAnswer: 'at', audioText: 'Vần nào có âm cuối là t?' },
    { id: 'h7', type: 'rhyme', question: 'Ghép chữ "m" và vần "ua" ta được tiếng gì?', options: ['mua', 'múa', 'mùa', 'mưa'], correctAnswer: 'mua', audioText: 'Ghép chữ m và vần ua ta được tiếng gì?' },
    { id: 'h8', type: 'rhyme', question: 'Vần nào có âm đầu là "u"?', options: ['ua', 'au', 'eu', 'iu'], correctAnswer: 'ua', audioText: 'Vần nào có âm đầu là u?' },
  ]
};

const getRandomQuestions = (level: GameLevel, count: number = 5) => {
  const shuffled = [...ALL_GAMES_DATA[level]].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const GamesView: React.FC<GamesViewProps> = ({ onBack, onSaveProgress }) => {
  const [level, setLevel] = useState<GameLevel>('easy');
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    setQuestions(getRandomQuestions(level));
  }, [level]);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion?.audioText) {
      playAudio(currentQuestion.audioText);
    }
  }, [currentQuestionIndex, questions]);

  const playAudio = async (text: string) => {
    setIsPlayingAudio(true);
    try {
      await AudioService.getInstance().speakFallback(text);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer || !currentQuestion) return; // Prevent multiple clicks

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 2);
      playAudio('Đúng rồi! Bé giỏi quá!');
    } else {
      playAudio('Chưa đúng rồi, bé thử lại nhé!');
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
        const finalScore = score + (correct ? 2 : 0);
        onSaveProgress({
          lessonId: `game-${level}`,
          lessonTitle: `Trò chơi: ${level === 'easy' ? 'Dễ' : level === 'medium' ? 'Vừa' : 'Khó'}`,
          activityType: 'exercise',
          score: finalScore,
          comment: `Bé đã hoàn thành trò chơi với số điểm ${finalScore}/10.`
        });
      }
    }, 2000);
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuestions(getRandomQuestions(level));
  };

  if (showResult) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-32 h-32 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <Trophy size={64} className="text-yellow-500" />
        </div>
        <h2 className="text-4xl font-black text-blue-900">Hoàn thành xuất sắc!</h2>
        <p className="text-2xl text-gray-600">Bé đạt được <span className="text-orange-500 font-bold">{score}</span> điểm</p>
        
        <div className="flex justify-center gap-4 pt-8">
          <button 
            onClick={resetGame}
            className="px-8 py-4 bg-orange-500 text-white rounded-full font-black text-lg hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <RefreshCw size={24} /> Chơi lại
          </button>
          <button 
            onClick={onBack}
            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-full font-black text-lg hover:bg-gray-200 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-orange-100">
        <button 
          onClick={onBack}
          className="p-3 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-100 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          {(['easy', 'medium', 'hard'] as GameLevel[]).map(l => (
            <button
              key={l}
              onClick={() => { setLevel(l); resetGame(); }}
              className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${level === l ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {l === 'easy' ? 'Dễ' : l === 'medium' ? 'Vừa' : 'Khó'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl">
          <Star className="text-yellow-500 fill-yellow-500" size={20} />
          <span className="font-black text-yellow-700 text-lg">{score}</span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-12 border-4 border-orange-50 text-center space-y-12">
        {!currentQuestion ? (
          <div className="py-12 text-gray-400 font-bold animate-pulse">Đang tải câu hỏi...</div>
        ) : (
          <>
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-black uppercase tracking-widest">
                  Câu {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-800 leading-tight flex items-center justify-center gap-4">
                {currentQuestion.question}
                <button 
                  onClick={() => currentQuestion.audioText && playAudio(currentQuestion.audioText)}
                  className={`p-3 rounded-full ${isPlayingAudio ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500'} transition-colors`}
                >
                  <Volume2 size={28} />
                </button>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              {currentQuestion.options.map((option, index) => {
                let btnClass = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600";
                
                if (selectedAnswer === option) {
                  btnClass = isCorrect 
                    ? "bg-green-500 border-green-600 text-white shadow-lg scale-105" 
                    : "bg-red-500 border-red-600 text-white shadow-lg scale-95";
                } else if (selectedAnswer && option === currentQuestion.correctAnswer) {
                  btnClass = "bg-green-100 border-green-300 text-green-700"; // Show correct answer if wrong
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`p-8 rounded-[2rem] border-4 text-4xl md:text-5xl font-black transition-all duration-300 ${btnClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GamesView;
