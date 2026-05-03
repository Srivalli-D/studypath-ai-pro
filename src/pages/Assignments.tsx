import React, { useEffect, useState } from 'react';
import api from '../api/index';
import { 
  ClipboardList, 
  Plus, 
  Calendar, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Hash,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Assignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', deadline: '', subject: '' });

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function fetchAssignments() {
    try {
      const res = await api.get('/study/assignments');
      setAssignments(res.data);
    } catch (error) {
      console.error('Failed to fetch assignments', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/study/assignments', newAssignment);
      setAssignments([res.data, ...assignments]);
      setShowAddModal(false);
      setNewAssignment({ title: '', deadline: '', subject: '' });
    } catch (error) {
      alert('Failed to add assignment');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/study/assignments/${id}`, { status: newStatus });
      setAssignments(assignments.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const statusColors: any = {
    'pending': 'bg-slate-800 text-slate-400',
    'in progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'submitted': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'graded': 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Assignment Tracker</h1>
          <p className="text-slate-400 mt-1">Keep track of deadlines and submission requirements.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          New Assignment
        </button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-slate-500">Retrieving deadlines...</div>
        ) : assignments.length === 0 ? (
          <div className="col-span-full card p-20 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-700">
               <ClipboardList size={32} />
             </div>
             <p className="text-slate-400 italic">"Done is better than perfect."</p>
             <p className="text-slate-500 mt-2">No pending assignments. Pure freedom!</p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const isOverdue = new Date(assignment.deadline) < new Date() && assignment.status !== 'submitted' && assignment.status !== 'graded';
            return (
              <motion.div 
                key={assignment.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`card p-6 flex flex-col border-l-4 transition-all hover:scale-[1.02] ${isOverdue ? 'border-l-red-500 bg-red-500/5' : 'border-l-[#0E7C66]'}`}
              >
                <div className="flex justify-between items-start mb-4">
                   <div className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-[#0E7C66] uppercase tracking-widest truncate max-w-[120px]">
                      {assignment.subject || 'GENERAL'}
                   </div>
                   <div className="flex flex-col items-end gap-1">
                    <select 
                      value={assignment.status} 
                      onChange={(e) => handleUpdateStatus(assignment.id, e.target.value)}
                      className={`text-[10px] font-bold uppercase tracking-widest border rounded px-2 py-1 cursor-pointer bg-slate-900 ${statusColors[assignment.status] || 'border-slate-800'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="submitted">Submitted</option>
                      <option value="graded">Graded</option>
                    </select>
                    {isOverdue && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-tight animate-pulse mt-1">
                        <AlertCircle size={10} />
                        Overdue
                      </span>
                    )}
                   </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{assignment.title}</h3>
                <div className="flex items-center justify-between gap-4 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-800">
                  <div className={`flex items-center gap-1.5 font-bold ${isOverdue ? 'text-red-400' : ''}`}>
                    <Calendar size={14} />
                    {assignment.deadline || 'No Deadline'}
                  </div>
                  <button 
                    onClick={async () => {
                      if (confirm('Delete assignment?')) {
                        try {
                          await api.delete(`/study/assignments/${assignment.id}`);
                          setAssignments(assignments.filter(a => a.id !== assignment.id));
                        } catch (err) {
                          alert('Failed to delete assignment');
                        }
                      }
                    }}
                    className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
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
              <h2 className="text-2xl font-bold mb-6 text-white">Track Assignment</h2>
              <form onSubmit={handleAddAssignment} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</label>
                  <input type="text" className="input w-full" placeholder="e.g. Operating Systems Project" value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subject</label>
                  <input type="text" className="input w-full" placeholder="e.g. CS401" value={newAssignment.subject} onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Deadline</label>
                  <input type="date" className="input w-full" value={newAssignment.deadline} onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })} required />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 font-bold">CANCEL</button>
                  <button type="submit" className="btn-primary flex-1 font-bold">START TRACKING</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
