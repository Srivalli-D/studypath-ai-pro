import React, { useEffect, useState } from 'react';
import api from '../api/index';
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statuses = ['applied', 'screening', 'interviewing', 'offer', 'rejected'];

export default function InternshipTracker() {
  const [internships, setInternships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ company: '', role: '', status: 'applied' });

  useEffect(() => {
    fetchInternships();
  }, []);

  async function fetchInternships() {
    try {
      const res = await api.get('/study/internships');
      setInternships(res.data);
    } catch (error) {
      console.error('Failed to fetch internships', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/study/internships', newItem);
      setInternships([res.data, ...internships]);
      setShowAddModal(false);
      setNewItem({ company: '', role: '', status: 'applied' });
    } catch (error) {
      alert('Failed to add internship');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Internship Pipeline</h1>
          <p className="text-slate-400 mt-1">Manage your applications and track your career launch progress.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Track New Application
        </button>
      </header>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/50 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Company & Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-500">Connecting to pipeline...</td></tr>
              ) : internships.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <p className="text-slate-400 italic">"The best time to apply was yesterday. The second best time is now."</p>
                    <p className="text-slate-500 mt-2">Zero applications tracked. Get started!</p>
                  </td>
                </tr>
              ) : (
                internships.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 group-hover:text-[#0E7C66] group-hover:border-[#0E7C66] transition-all">
                             <Building2 size={20} />
                          </div>
                          <div>
                             <p className="font-bold text-slate-100">{item.company}</p>
                             <p className="text-xs text-slate-500 uppercase tracking-tighter">{item.role}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                         item.status === 'offer' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                         item.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                         item.status === 'interviewing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                         'bg-slate-800 text-slate-400 border border-slate-700'
                       }`}>
                         {item.status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                          <Calendar size={14} />
                          {new Date(item.createdAt).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => alert('Editing application features coming soon!')}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                          >
                             <MoreVertical size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md card p-8 z-[110]"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">Track Application</h2>
              <form onSubmit={handleAddItem} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company Name</label>
                  <input type="text" className="input w-full" placeholder="e.g. Google, Meta, Startup XYZ" value={newItem.company} onChange={(e) => setNewItem({ ...newItem, company: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role Name</label>
                  <input type="text" className="input w-full" placeholder="e.g. Software Engineering Intern" value={newItem.role} onChange={(e) => setNewItem({ ...newItem, role: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</label>
                  <select className="input w-full appearance-none capitalize" value={newItem.status} onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 font-bold">CANCEL</button>
                  <button type="submit" className="btn-primary flex-1 font-bold">SAVE TO PIPELINE</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
