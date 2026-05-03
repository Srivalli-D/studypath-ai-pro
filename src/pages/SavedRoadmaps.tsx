import React, { useEffect, useState } from 'react';
import api from '../api/index';
import { 
  Map as MapIcon, 
  ChevronRight, 
  Calendar, 
  Trash2, 
  ExternalLink,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SavedRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any | null>(null);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  async function fetchRoadmaps() {
    try {
      const res = await api.get('/roadmaps');
      setRoadmaps(res.data);
    } catch (error) {
      console.error('Failed to fetch roadmaps', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0E7C66]"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Your Success Blueprints</h1>
        <p className="text-slate-400 mt-1">Archived career paths and learning journeys.</p>
      </header>

      {roadmaps.length === 0 ? (
        <div className="card p-20 text-center">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-600">
            <MapIcon size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No roadmaps saved yet</h2>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">Generate your first AI-powered roadmap to see it listed here.</p>
          <Link to="/roadmaps" className="btn-primary">Generate Roadmap</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((rm) => (
            <motion.div 
              key={rm.id}
              layoutId={rm.id}
              onClick={() => setSelectedRoadmap(rm)}
              className="card p-6 cursor-pointer hover:border-[#0E7C66]/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#0E7C66]/10 rounded-xl text-[#0E7C66]">
                  <Target size={24} />
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-1.5">
                  <Calendar size={12} />
                  {new Date(rm.createdAt).toLocaleDateString()}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#0E7C66] transition-colors mb-2">{rm.goal}</h3>
              <p className="text-sm text-slate-400 line-clamp-2 mb-4 italic">
                Skills: {rm.skills}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{rm.roadmap.length} Milestones</span>
                <div className="text-[#0E7C66] flex items-center gap-1 text-sm font-bold uppercase tracking-widest group-hover:gap-2 transition-all">
                  View Path
                  <ChevronRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for detail view */}
      <AnimatePresence>
        {selectedRoadmap && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoadmap(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            />
            <motion.div 
              layoutId={selectedRoadmap.id}
              className="fixed inset-4 md:inset-10 lg:inset-20 bg-[#0f172a] rounded-3xl z-[110] border border-slate-700 shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#0f172a]/90 backdrop-blur-md p-6 border-b border-slate-800 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedRoadmap.goal}</h2>
                  <p className="text-slate-400 text-sm">Created on {new Date(selectedRoadmap.createdAt).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => setSelectedRoadmap(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"
                >
                  <ChevronRight className="rotate-90" />
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="md:col-span-1 border-r border-slate-800/50 pr-8 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Initial Skills</h4>
                      <p className="text-sm text-slate-300">{selectedRoadmap.skills}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Step Count</h4>
                      <p className="text-sm text-slate-300">{selectedRoadmap.roadmap.length} Stages</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-3 space-y-10 relative">
                     <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-800"></div>
                     {selectedRoadmap.roadmap.map((step: any, i: number) => (
                       <div key={i} className="flex gap-6 relative">
                         <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-[#0E7C66] flex items-center justify-center text-[10px] font-bold text-[#0E7C66] z-10 relative bg-slate-900">
                           {i + 1}
                         </div>
                         <div className="flex-1 pb-10">
                           <div className="flex justify-between items-center mb-2">
                             <h3 className="text-lg font-bold text-white">{step.title}</h3>
                             <span className="text-xs text-slate-500 font-bold">{step.duration}</span>
                           </div>
                           <p className="text-slate-400 text-sm leading-relaxed mb-4">{step.description}</p>
                           <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/50 text-xs">
                             <span className="text-[#0E7C66] font-bold mr-2 uppercase tracking-tighter">Resources:</span>
                             <span className="text-slate-500">{step.resources}</span>
                           </div>
                         </div>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
