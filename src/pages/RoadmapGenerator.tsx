import React, { useState } from 'react';
import { generateRoadmapAI } from '../api/gemini';
import api from '../api/index';
import { 
  Sparkles, 
  Map as MapIcon, 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  Trophy,
  Target,
  Clock,
  BookOpen,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoadmapGenerator() {
  const [goal, setGoal] = useState('');
  const [skills, setSkills] = useState('');
  const [level, setLevel] = useState('beginner');
  const [timeline, setTimeline] = useState('3 months');
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRoadmap(null);
    setSaveSuccess(false);

    try {
      const result = await generateRoadmapAI(goal, skills, level, timeline);
      setRoadmap(result);
    } catch (error) {
      console.error('Generation failed', error);
      alert('Failed to generate roadmap. Please check your API key or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!roadmap) return;
    setIsSaving(true);
    try {
      await api.post('/roadmaps', {
        goal,
        skills,
        roadmap
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save roadmap.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0E7C66]/10 text-[#0E7C66] mb-6 shadow-xl shadow-[#0E7C66]/5">
          <Sparkles size={32} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Precision Career Mapping</h1>
        <p className="text-slate-400 max-w-xl mx-auto italic">
          "Plan your learning and career journey step by step with our AI-powered architect."
        </p>
      </header>

      {!roadmap && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 md:p-10"
        >
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Career Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer, Data Scientist"
                  className="input w-full"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Current Skills</label>
                <input
                  type="text"
                  placeholder="e.g. HTML, CSS, Basic Python"
                  className="input w-full"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Experience Level</label>
                <select 
                  className="input w-full appearance-none"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="beginner">Beginner (No experience)</option>
                  <option value="intermediate">Intermediate (Some projects)</option>
                  <option value="advanced">Advanced (Work exp/Internships)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Desired Timeline</label>
                <input
                  type="text"
                  placeholder="e.g. 3 months, 6 months"
                  className="input w-full"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Analyzing Market & Crafting Path...
                </>
              ) : (
                <>
                  <Target size={24} />
                  Generate My Roadmap
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}

      {roadmap && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between sticky top-4 z-40 bg-[#0f172a]/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/50">
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => setRoadmap(null)} 
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowRight className="rotate-180" />
                </button>
                <div>
                   <h2 className="text-xl font-bold text-white">{goal} Roadmap</h2>
                   <p className="text-xs text-slate-500 uppercase tracking-widest">{timeline} journey</p>
                </div>
             </div>
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                 saveSuccess 
                 ? 'bg-emerald-500 text-white' 
                 : 'bg-[#0E7C66] text-white hover:bg-[#0c6a57]'
               }`}
             >
               {isSaving ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
               {saveSuccess ? 'Saved to Dashboard' : 'Save Roadmap'}
             </button>
          </div>

          <div className="space-y-6 relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-800 -z-10"></div>
            
            {roadmap.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 group"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-slate-400 group-hover:border-[#0E7C66] group-hover:text-[#0E7C66] transition-all z-10 relative bg-slate-900">
                    <span className="font-bold">{i + 1}</span>
                  </div>
                </div>
                <div className="card flex-1 p-6 hover:border-slate-600 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#0E7C66] transition-colors">{step.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-slate-400">
                        <Clock size={12} />
                        {step.duration}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-6">{step.description}</p>
                  
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/30">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                       <BookOpen size={12} />
                       Suggested Resources
                    </h4>
                    <p className="text-sm text-slate-300">{step.resources}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: roadmap.length * 0.1 + 0.5 }}
               className="flex justify-center pt-8"
            >
               <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Trophy size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white italic">Goal Achieved: {goal}</h3>
                    <p className="text-slate-500 text-sm mt-1">Consistency is your superpower.</p>
                  </div>
                  <button 
                    onClick={() => setRoadmap(null)}
                    className="btn-secondary mt-4"
                  >
                    Generate Another Path
                  </button>
               </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
