import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  MessageSquare,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    id: 1,
    question: "How do you handle asynchronous operations in JavaScript?",
    hint: "Think about Callbacks, Promises, and Async/Await.",
    category: "JavaScript"
  },
  {
    id: 2,
    question: "Explain the difference between SQL and NoSQL databases.",
    hint: "ACID vs BASE properties, Schema structure.",
    category: "Databases"
  },
  {
    id: 3,
    question: "What is a Binary Search Tree and its time complexity for search?",
    hint: "Left < Root < Right. O(log n) average.",
    category: "DSA"
  },
  {
    id: 4,
    question: "Describe the process of a browser rendering a web page.",
    hint: "DOM -> CSSOM -> Render Tree -> Layout -> Paint.",
    category: "Web Performance"
  },
  {
    id: 5,
    question: "What is the Virtual DOM in React?",
    hint: "Efficient reconciliation and diffing algorithm.",
    category: "React"
  }
];

export default function InterviewPrep() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [practiced, setPracticed] = useState<number[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const togglePracticed = (id: number) => {
    setPracticed(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Interview Readiness</h1>
          <p className="text-slate-400 mt-1">Master common internship questions through deliberate practice.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-[#0E7C66]/10 rounded-xl border border-[#0E7C66]/20">
          <Award className="text-[#0E7C66]" size={20} />
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Mastery Score</p>
            <p className="text-xl font-bold text-white text-center">{Math.round((practiced.length / questions.length) * 100)}%</p>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="card overflow-hidden group hover:border-[#0E7C66]/30 transition-all">
            <div 
              className="p-5 flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
            >
              <div className="flex items-center gap-4 flex-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); togglePracticed(q.id); }}
                  className={`transition-colors ${practiced.includes(q.id) ? 'text-emerald-500' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  {practiced.includes(q.id) ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">
                    {q.category}
                  </span>
                  <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">{q.question}</h3>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                {expandedId === q.id ? <ChevronUp size={20} className="text-slate-600" /> : <ChevronDown size={20} className="text-slate-600" />}
              </div>
            </div>

            <AnimatePresence>
              {expandedId === q.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-6 border-t border-slate-800 bg-slate-900/10"
                >
                  <div className="pt-6 space-y-4">
                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg text-xs text-blue-400 flex items-start gap-3">
                       <Zap size={14} className="mt-0.5" />
                       <p><strong>Clue:</strong> {q.hint}</p>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                         <MessageSquare size={12} />
                         Your Drafted Answer
                       </label>
                       <textarea 
                         className="input w-full min-h-[120px] text-sm resize-none py-3"
                         placeholder="Explain in your own words..."
                         value={answers[q.id] || ''}
                         onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                       />
                    </div>
                    
                    <div className="flex justify-end">
                       <button 
                         onClick={() => togglePracticed(q.id)}
                         className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                           practiced.includes(q.id) 
                           ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                           : 'btn-secondary'
                         }`}
                       >
                         {practiced.includes(q.id) ? 'MARK AS UNFINISHED' : 'COMPLETE PRACTICE'}
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="card p-10 bg-gradient-to-br from-[#0E7C66]/5 to-transparent border-dashed border-[#0E7C66]/20 text-center">
         <HelpCircle size={40} className="text-slate-700 mx-auto mb-4" />
         <h3 className="text-lg font-bold text-slate-400">Want AI generated answers?</h3>
         <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto">Coming soon: We're training a model to provide perfect engineering answers to these questions.</p>
      </div>
    </div>
  );
}
