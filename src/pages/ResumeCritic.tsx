import React, { useState } from 'react';
import { generateResumeCritiqueAI } from '../api/gemini';
import api from '../api/index';
import { 
  Search, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Plus, 
  ArrowRight,
  Loader2,
  FileText,
  ThumbsUp,
  ThumbsDown,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';

export default function ResumeCritic() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineering Intern');
  const [isLoading, setIsLoading] = useState(false);
  const [critique, setCritique] = useState<any>(null);

  const handleCritique = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCritique(null);

    try {
      const result = await generateResumeCritiqueAI(resumeText, targetRole);
      setCritique(result);
    } catch (err: any) {
      console.error('Critique failed', err);
      alert('AI Critique failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6 shadow-xl shadow-indigo-500/5">
          <FileText size={32} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">AI Resume Critic</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          "Land that interview. Get industrial-grade feedback on your student resume from our AI recruiter."
        </p>
      </header>

      {!critique && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          <form onSubmit={handleCritique} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Target Job Role</label>
              <input
                type="text"
                className="input w-full"
                placeholder="e.g. Backend Intern, Frontend Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Resume Content (Paste Text)</label>
              <textarea
                className="input w-full min-h-[300px] py-4 resize-none"
                placeholder="Paste your education, projects, skills, and experience here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Analyzing with AI Recruiter...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  Get Professional Critique
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}

      {critique && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between sticky top-4 z-40 bg-[#0f172a]/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/50">
             <div className="flex items-center gap-4">
                <button onClick={() => setCritique(null)} className="text-slate-400 hover:text-white transition-colors">
                  <ArrowRight className="rotate-180" />
                </button>
                <div className="flex items-center gap-3">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-[#0E7C66]/20 text-[#0E7C66] border border-[#0E7C66]/30`}>
                      {critique.score}
                   </div>
                   <div>
                      <h2 className="text-xl font-bold text-white">Analysis Result</h2>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">Optimized for {targetRole}</p>
                   </div>
                </div>
             </div>
             <button onClick={() => setCritique(null)} className="btn-secondary px-4 py-2">Edit Text</button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
             <div className="card p-6 border-emerald-500/20 bg-emerald-500/5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">
                   <ThumbsUp size={18} />
                   Key Strengths
                </h3>
                <ul className="space-y-3">
                   {critique.strengths.map((s: string, i: number) => (
                     <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        {s}
                     </li>
                   ))}
                </ul>
             </div>

             <div className="card p-6 border-red-500/20 bg-red-500/5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
                   <ThumbsDown size={18} />
                   Critical Gaps
                </h3>
                <ul className="space-y-3">
                   {critique.weaknesses.map((w: string, i: number) => (
                     <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                        {w}
                     </li>
                   ))}
                </ul>
             </div>
          </div>

          <div className="card p-8">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-400" />
                Actionable Advice
             </h3>
             <div className="grid md:grid-cols-2 gap-4 mb-8">
                {critique.advice.map((a: string, i: number) => (
                   <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">{i+1}</div>
                      <p className="text-sm text-slate-300">{a}</p>
                   </div>
                ))}
             </div>

             <div className="markdown-body p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                <div className="text-slate-400 leading-relaxed prose prose-invert max-w-none">
                   <Markdown>{critique.formatted_feedback}</Markdown>
                </div>
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
