import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Target, 
  CheckCircle2, 
  Coffee,
  Brain,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FocusMode() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessions, setSessions] = useState(0);
  const [soundsEnabled, setSoundsEnabled] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (mode === 'work') {
      setSessions(prev => prev + 1);
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      setMode('work');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? (timeLeft / (25 * 60)) * 100 
    : (timeLeft / (5 * 60)) * 100;

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-12 py-10 min-h-[70vh]">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-white uppercase tracking-[0.2em] flex items-center gap-4">
           {mode === 'work' ? <Brain className="text-orange-400" /> : <Coffee className="text-blue-400" />}
           {mode === 'work' ? 'Deep Work' : 'Refuel Break'}
        </h1>
        <p className="text-slate-500 mt-2 font-medium tracking-widest text-xs">
          Built by a student to combat digital distractions.
        </p>
      </header>

      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Animated Circle Background */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
           <circle 
             cx="160" cy="160" r="150" 
             className="fill-none stroke-slate-800 stroke-[4px]" 
           />
           <motion.circle 
             cx="160" cy="160" r="150" 
             className={`fill-none stroke-[8px] rounded-full ${mode === 'work' ? 'stroke-[#0E7C66]' : 'stroke-blue-500'}`}
             strokeDasharray={942}
             animate={{ strokeDashoffset: 942 - (942 * (100 - progress)) / 100 }}
             transition={{ duration: 1, ease: "linear" }}
           />
        </svg>

        <div className="text-center z-10">
           <motion.div 
             key={timeLeft}
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-7xl font-black text-white font-mono tabular-nums"
           >
             {formatTime(timeLeft)}
           </motion.div>
           <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2">
             Time Left
           </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={resetTimer}
          className="p-4 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all transform hover:rotate-[-90deg]"
        >
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-xl ${
            isActive 
            ? 'bg-slate-700 text-white shadow-slate-900/50' 
            : 'bg-[#0E7C66] text-white shadow-[#0E7C66]/20'
          }`}
        >
          {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <button 
          onClick={() => setSoundsEnabled(!soundsEnabled)}
          className={`p-4 rounded-full bg-slate-800 border border-slate-700 transition-all ${
            soundsEnabled ? 'text-[#0E7C66]' : 'text-slate-400'
          }`}
        >
          {soundsEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
         <div className="card p-6 text-center border-[#0E7C66]/20 bg-[#0E7C66]/5">
            <span className="text-3xl font-bold text-white">{sessions}</span>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sessions Today</p>
         </div>
         <div className="card p-6 text-center">
            <span className="text-3xl font-bold text-white">{sessions * 25}</span>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Focus Minutes</p>
         </div>
         <div className="card p-6 text-center border-orange-500/20 bg-orange-500/5">
            <span className="text-3xl font-bold text-white">Level 4</span>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Focus Rank</p>
         </div>
         <div className="card p-6 text-center">
            <span className="text-3xl font-bold text-white">92%</span>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Consistency</p>
         </div>
      </div>

      <div className="card p-8 w-full border-dashed border-slate-700 bg-transparent flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#0E7C66]/10 rounded-xl flex items-center justify-center text-[#0E7C66]">
               <Target size={24} />
            </div>
            <div>
               <h3 className="font-bold text-white italic">"Small steps everyday lead to big destinations."</h3>
               <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Goal: Research internship roles today</p>
            </div>
         </div>
         <button className="text-xs font-bold text-[#0E7C66] hover:underline uppercase tracking-widest">Update Goal</button>
      </div>
    </div>
  );
}
