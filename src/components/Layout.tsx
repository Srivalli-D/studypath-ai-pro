import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { 
  LayoutDashboard, 
  Map, 
  BookOpen, 
  Target, 
  FileText, 
  Briefcase, 
  BookMarked,
  HelpCircle,
  ClipboardList,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Career Roadmap', path: '/roadmaps', icon: Map },
  { name: 'Saved Roadmaps', path: '/saved-roadmaps', icon: Map },
  { name: 'Study Planner', path: '/study-planner', icon: BookOpen },
  { name: 'Skill Tracker', path: '/skill-tracker', icon: Target },
  { name: 'Notes', path: '/notes', icon: FileText },
  { name: 'Resources', path: '/resources', icon: BookMarked },
  { name: 'Interview Prep', path: '/interview-prep', icon: HelpCircle },
  { name: 'AI Resume Critic', path: '/resume-critic', icon: FileText },
  { name: 'Job Board', path: '/jobs', icon: Briefcase },
  { name: 'Focus Mode', path: '/focus', icon: Zap },
  { name: 'Assignments', path: '/assignments', icon: ClipboardList },
  { name: 'Internship Tracker', path: '/internships', icon: Briefcase },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0E7C66] rounded-lg flex items-center justify-center font-bold">S</div>
          <span className="font-bold text-lg">StudyPath AI</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 z-40 hidden lg:flex flex-col
        ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0E7C66] rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-[#0E7C66]/30">S</div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">StudyPath AI</span>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                ${isActive 
                  ? 'bg-[#0E7C66] text-white shadow-lg shadow-[#0E7C66]/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
              `}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E7C66] to-[#0c6a57] flex items-center justify-center font-bold text-white shadow-lg flex-shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-bold text-white truncate leading-none mb-1">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-tighter italic">B.Tech Techie</p>
              </div>
            )}
            {isSidebarOpen && (
              <button 
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
          {!isSidebarOpen && (
            <button 
              onClick={logout}
              className="mt-4 w-full flex justify-center p-2 text-slate-500 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-full max-w-xs bg-slate-900 z-[70] lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0E7C66] rounded-xl flex items-center justify-center font-bold text-xl">S</div>
                  <span className="font-bold text-xl tracking-tight">StudyPath AI</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${isActive 
                        ? 'bg-[#0E7C66] text-white shadow-lg shadow-[#0E7C66]/20' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
                    `}
                  >
                    <item.icon size={22} />
                    <span className="font-medium text-lg">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t border-slate-800 bg-slate-900">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                  <LogOut size={22} />
                  <span className="font-medium text-lg">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`transition-all duration-300 min-h-screen ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};
