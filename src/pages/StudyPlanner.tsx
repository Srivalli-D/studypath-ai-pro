import React, { useEffect, useState } from 'react';
import api from '../api/index';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Clock,
  MoreVertical,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StudyPlanner() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', date: '', priority: 'medium' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'status'>('deadline');

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await api.get('/study/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/study/tasks', newTask);
      setTasks([res.data, ...tasks]);
      setShowAddModal(false);
      setNewTask({ title: '', date: '', priority: 'medium' });
    } catch (error) {
      alert('Failed to add task');
    }
  };

  const toggleTaskStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await api.patch(`/study/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 };

  const getSortedAndFilteredTasks = () => {
    return tasks
      .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.date || '9999').getTime() - new Date(b.date || '9999').getTime();
        }
        if (sortBy === 'priority') {
          return priorityMap[b.priority] - priorityMap[a.priority];
        }
        if (sortBy === 'status') {
          return (a.status === 'completed' ? 1 : 0) - (b.status === 'completed' ? 1 : 0);
        }
        return 0;
      });
  };

  const sortedTasks = getSortedAndFilteredTasks();
  
  const upcomingTasks = tasks.filter(t => {
    if (!t.date || t.status === 'completed') return false;
    const diff = new Date(t.date).getTime() - new Date().getTime();
    return diff > 0 && diff < 86400000 * 2; // Due in 2 days
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Study Planner</h1>
          <p className="text-slate-400 mt-1">Manage your daily priorities and academic goals.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add New Task
        </button>
      </header>

      {/* Notifications */}
      <AnimatePresence>
        {upcomingTasks.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
          >
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center gap-4">
               <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 flex-shrink-0">
                  <AlertTriangle size={20} />
               </div>
               <div className="flex-1">
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Upcoming Deadlines</p>
                  <p className="text-sm text-slate-300">You have {upcomingTasks.length} tasks due within the next 48 hours. Stay focused!</p>
               </div>
               <div className="flex -space-x-2">
                 {upcomingTasks.slice(0, 3).map((t, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                      {t.title[0]}
                    </div>
                 ))}
                 {upcomingTasks.length > 3 && (
                   <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                     +{upcomingTasks.length - 3}
                   </div>
                 )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-4 flex-1">
             <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter tasks..." 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-1.5 text-sm outline-none focus:border-[#0E7C66]" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             
             <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-500" />
                <select 
                  className="bg-transparent text-xs font-bold text-slate-400 uppercase tracking-widest outline-none cursor-pointer hover:text-white transition-colors"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="deadline">Sort: Deadline</option>
                  <option value="priority">Sort: Priority</option>
                  <option value="status">Sort: Status</option>
                </select>
             </div>
           </div>
           
           <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{tasks.filter(t => t.status === 'completed').length}/{tasks.length} Completed</span>
           </div>
        </div>

        <div className="divide-y divide-slate-800">
          {isLoading ? (
            <div className="p-20 text-center text-slate-500">Loading tasks...</div>
          ) : sortedTasks.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-600">
                <Calendar size={24} />
              </div>
              <p className="text-slate-400">No tasks found. Ready to crush some goals?</p>
            </div>
          ) : (
            sortedTasks.map((task) => (
              <div key={task.id} className="p-4 md:px-6 hover:bg-slate-800/30 transition-colors flex items-center gap-4 group">
                <button 
                  onClick={() => toggleTaskStatus(task.id, task.status)}
                  className={`flex-shrink-0 transition-colors ${task.status === 'completed' ? 'text-emerald-500' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  {task.status === 'completed' ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium transition-all truncate ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <Clock size={10} />
                      {task.date || 'No Date'}
                    </span>
                    <span className={`text-[9px] font-bold uppercase py-0.5 px-1.5 rounded tracking-tighter ${
                      task.priority === 'high' ? 'bg-red-500/10 text-red-400' : 
                      task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={async () => {
                      if (confirm('Delete this task?')) {
                        try {
                          await api.delete(`/study/tasks/${task.id}`);
                          setTasks(tasks.filter(t => t.id !== task.id));
                        } catch (err) {
                          alert('Failed to delete task');
                        }
                      }
                    }}
                    className="p-2 text-slate-600 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Task Modal */}
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
              <h2 className="text-2xl font-bold mb-6 text-white">Create Study Task</h2>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Task Topic</label>
                  <input 
                    type="text" 
                    className="input w-full"
                    placeholder="e.g. Master Binary Search Trees"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</label>
                    <input 
                      type="date" 
                      className="input w-full"
                      value={newTask.date}
                      onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</label>
                    <select 
                      className="input w-full appearance-none"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Save Task</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
