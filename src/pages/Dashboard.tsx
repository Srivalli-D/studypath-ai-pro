import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import api from '../api/index';
import { 
  BarChart3, 
  Map as MapIcon, 
  CheckCircle2, 
  Clock, 
  Bell, 
  ArrowUpRight,
  Plus,
  BookOpen,
  Target,
  FileText,
  Briefcase,
  Zap,
  HelpCircle,
  BookMarked,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    roadmaps: 0,
    tasksCompleted: 0,
    skillsCount: 0,
    notesCount: 0,
    internships: 0,
    upcomingDeadlines: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [roadmaps, tasks, skills, notes, internships, assignments] = await Promise.all([
          api.get('/roadmaps'),
          api.get('/study/tasks'),
          api.get('/study/skills'),
          api.get('/study/notes'),
          api.get('/study/internships'),
          api.get('/study/assignments')
        ]);

        const allTasks = tasks.data;
        const pendingUpcoming = allTasks.filter((t: any) => {
          if (!t.date || t.status === 'completed') return false;
          const diff = new Date(t.date).getTime() - new Date().getTime();
          return diff > 0 && diff < 86400000 * 2; // Due in 2 days
        });

        setStats({
          roadmaps: roadmaps.data.length,
          tasksCompleted: allTasks.filter((t: any) => t.status === 'completed').length,
          skillsCount: skills.data.length,
          notesCount: notes.data.length,
          internships: internships.data.length,
          upcomingDeadlines: pendingUpcoming.length
        });

        setRecentTasks(allTasks.slice(0, 5));
        setUpcomingTasks(pendingUpcoming);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
       <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0E7C66]"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}! 👋</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your studies today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/roadmaps" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            New Roadmap
          </Link>
          <Link to="/study-planner" className="btn-secondary flex items-center gap-2">
            <Clock size={18} />
            Planner
          </Link>
        </div>
      </header>

      {/* Notifications */}
      <AnimatePresence>
        {upcomingTasks.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
          >
            <Link to="/study-planner" className="block transform hover:scale-[1.01] transition-transform">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center gap-4">
                 <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 flex-shrink-0 animate-pulse">
                    <AlertTriangle size={20} />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Upcoming Deadlines</p>
                    <p className="text-sm text-slate-300">You have {upcomingTasks.length} study goals approaching. View your planner to stay on track.</p>
                 </div>
                 <ArrowUpRight className="text-orange-500/50" />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Roadmaps', value: stats.roadmaps, icon: MapIcon, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Completed', value: stats.tasksCompleted, icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Skills', value: stats.skillsCount, icon: Target, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Notes', value: stats.notesCount, icon: FileText, color: 'text-pink-400', bg: 'bg-pink-400/10' },
          { label: 'Applications', value: stats.internships, icon: Briefcase, color: 'text-orange-400', bg: 'bg-orange-400/10' },
          { label: 'Deadlines', value: stats.upcomingDeadlines, icon: Bell, color: 'text-red-400', bg: 'bg-red-400/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card p-5 flex flex-col items-center text-center group hover:border-[#0E7C66]/30"
          >
            <div className={`w-10 h-10 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              Quick Actions
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/roadmaps" className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#0E7C66] transition-all group">
                <MapIcon className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium">Generate Path</p>
                <p className="text-xs text-slate-500 mt-1">AI-powered roadmap</p>
              </Link>
              <Link to="/resume-critic" className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#0E7C66] transition-all group border-dashed border-[#0E7C66]/30">
                <FileText className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium">AI Resume</p>
                <p className="text-xs text-slate-500 mt-1">Instant critique</p>
              </Link>
              <Link to="/notes" className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#0E7C66] transition-all group">
                <BookOpen className="text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium">Quick Note</p>
                <p className="text-xs text-slate-500 mt-1">Capture learning</p>
              </Link>
              <Link to="/interview-prep" className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#0E7C66] transition-all group">
                <HelpCircle className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium">Mock Practice</p>
                <p className="text-xs text-slate-500 mt-1">Interview readiness</p>
              </Link>
            </div>
          </div>

          {/* Activity Section */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BarChart3 size={18} className="text-[#0E7C66]" />
                Recent Tasks
              </h3>
              <Link to="/study-planner" className="text-xs text-[#0E7C66] hover:underline font-medium uppercase tracking-widest">View All</Link>
            </div>
            <div className="space-y-1">
              {recentTasks.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>No tasks yet. Start planning!</p>
                </div>
              ) : (
                recentTasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                      <div>
                        <p className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-500">{task.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-400' : 
                        task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-8">
          <div className="card p-6 bg-gradient-to-br from-[#0E7C66]/20 to-transparent border-[#0E7C66]/20">
            <h3 className="text-lg font-bold mb-2">Student Spotlight ✨</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              "This project helps students plan their learning and career journey step by step." 
              Keep pushing, your dream internship is closer than you think!
            </p>
            <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs italic">
              "Consistency is better than intensity."
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <BookMarked size={18} className="text-purple-400" />
              Resources for You
            </h3>
            <div className="space-y-4">
              {[
                { title: 'DSA Masterlist', type: 'Guide', link: '#' },
                { title: 'Frontend Interview Qs', type: 'PDF', link: '#' },
                { title: 'System Design 101', type: 'Video', link: '#' }
              ].map((res, i) => (
                <a key={i} href={res.link} className="block p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all flex items-center justify-between group">
                  <div>
                    <p className="text-sm font-medium group-hover:text-[#0E7C66]">{res.title}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{res.type}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-600 group-hover:text-[#0E7C66] transition-colors" />
                </a>
              ))}
              <Link to="/notes" className="block text-center text-xs font-bold text-[#0E7C66] uppercase tracking-[0.2em] mt-4 hover:underline">
                Explore Knowledge Base
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
