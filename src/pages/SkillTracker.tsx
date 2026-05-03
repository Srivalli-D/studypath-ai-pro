import React, { useEffect, useState } from 'react';
import api from '../api/index';
import { 
  Target, 
  Plus, 
  TrendingUp, 
  Award, 
  ChevronRight,
  MoreVertical,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SkillTracker() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', progress: 0 });

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    try {
      const res = await api.get('/study/skills');
      setSkills(res.data);
    } catch (error) {
      console.error('Failed to fetch skills', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/study/skills', newSkill);
      setSkills([...skills, res.data]);
      setShowAddModal(false);
      setNewSkill({ name: '', progress: 0 });
    } catch (error) {
      alert('Failed to add skill');
    }
  };

  const updateProgress = async (id: string, amount: number, current: number) => {
    const newProgress = Math.min(100, Math.max(0, current + amount));
    try {
      await api.patch(`/study/skills/${id}`, { progress: newProgress });
      setSkills(skills.map(s => s.id === id ? { ...s, progress: newProgress } : s));
    } catch (error) {
      alert('Failed to update skill');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Skill Matrix</h1>
          <p className="text-slate-400 mt-1">Visualize your technical progress and expertise depth.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          New Skill
        </button>
      </header>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-indigo-500/10 to-transparent">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
               <TrendingUp size={24} />
             </div>
             <div>
               <p className="text-3xl font-bold text-white">{skills.length}</p>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Skills</p>
             </div>
          </div>
        </div>
        <div className="card p-6 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
               <Award size={24} />
             </div>
             <div>
               <p className="text-3xl font-bold text-white">{skills.filter(s => s.progress >= 80).length}</p>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Mastered (80%+)</p>
             </div>
          </div>
        </div>
        <div className="card p-6 bg-gradient-to-br from-[#0E7C66]/10 to-transparent border-[#0E7C66]/20">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 rounded-xl bg-[#0E7C66]/20 text-[#0E7C66] flex items-center justify-center">
               <Zap size={24} />
             </div>
             <div>
               <p className="text-3xl font-bold text-white">
                 {skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + s.progress, 0) / skills.length) : 0}%
               </p>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Avg Proficiency</p>
             </div>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-slate-500">Loading matrix...</div>
        ) : skills.length === 0 ? (
          <div className="col-span-full card p-20 text-center">
             <p className="text-slate-500 italic">"Skill building is a marathon, not a sprint."</p>
             <p className="text-slate-600 mt-2">Start tracking your first technology!</p>
          </div>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="card p-6 group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 font-bold group-hover:border-[#0E7C66] group-hover:text-[#0E7C66] transition-all">
                     {skill.name[0]}
                   </div>
                   <h3 className="font-bold text-lg text-white">{skill.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={() => updateProgress(skill.id, -5, skill.progress)}
                     className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-500 hover:border-red-500/50 hover:text-red-400 transition-all flex items-center justify-center font-bold"
                   >
                     -
                   </button>
                   <span className="text-sm font-bold text-white w-12 text-center bg-slate-900/50 py-1 rounded-md border border-slate-800">{skill.progress}%</span>
                   <button 
                     onClick={() => updateProgress(skill.id, 5, skill.progress)}
                     className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-500 hover:border-emerald-500/50 hover:text-emerald-400 transition-all flex items-center justify-center font-bold"
                   >
                     +
                   </button>
                </div>
              </div>
              
              <div className="relative pt-2">
                 <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      className={`h-full rounded-full transition-all duration-500 relative ${
                        skill.progress > 75 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                        skill.progress > 40 ? 'bg-[#0E7C66] shadow-[0_0_10px_rgba(14,124,102,0.3)]' :
                        'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                    </motion.div>
                 </div>
                 {/* Progress Markers */}
                 <div className="absolute top-2 left-0 w-full h-3 pointer-events-none flex justify-between px-0.5">
                    <div className="w-px h-full bg-slate-700/50 ml-[25%]" />
                    <div className="w-px h-full bg-slate-700/50 mr-[50%]" />
                    <div className="w-px h-full bg-slate-700/50 mr-[25%]" />
                 </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-600">
                 <span>Level: {skill.progress < 30 ? 'Novice' : skill.progress < 70 ? 'Competent' : 'Master'}</span>
                 <button className="flex items-center gap-1 hover:text-[#0E7C66] transition-colors">
                   Projects
                   <ChevronRight size={10} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Skill Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md card p-8 z-[110]"
            >
              <h2 className="text-2xl font-bold mb-6 text-white text-center">Track New Skill</h2>
              <form onSubmit={handleAddSkill} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skill / Technology Name</label>
                  <input 
                    type="text" 
                    className="input w-full"
                    placeholder="e.g. React.js, DSA, Node.js"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Initial Proficiency</label>
                    <span className="text-sm font-bold text-[#0E7C66]">{newSkill.progress}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100"
                    step="5"
                    className="w-full accent-[#0E7C66]"
                    value={newSkill.progress}
                    onChange={(e) => setNewSkill({ ...newSkill, progress: parseInt(e.target.value) })}
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>BEGINNER</span>
                    <span>PRO</span>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 font-bold">CANCEL</button>
                  <button type="submit" className="btn-primary flex-1 font-bold">ADD TO MATRIX</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
