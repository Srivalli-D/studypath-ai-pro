import React from 'react';
import { useAuth } from '../components/AuthContext';
import { 
  User as UserIcon, 
  Settings, 
  Shield, 
  Bell, 
  Key, 
  Mail,
  Award,
  BookOpen
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Student Profile</h1>
        <p className="text-slate-400 mt-1">Manage your account settings and personal preferences.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <div className="card p-8 text-center flex flex-col items-center">
             <div className="w-24 h-24 bg-[#0E7C66]/20 border-2 border-[#0E7C66]/30 rounded-full flex items-center justify-center text-[#0E7C66] mb-6">
                <UserIcon size={48} />
             </div>
             <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
             <p className="text-slate-500 text-sm">{user?.email}</p>
             <div className="mt-6 pt-6 border-t border-slate-800 w-full grid grid-cols-2 gap-4">
                <div className="text-center">
                   <p className="text-lg font-bold text-white">Silver</p>
                   <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Student Rank</p>
                </div>
                <div className="text-center">
                   <p className="text-lg font-bold text-white">1240</p>
                   <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">XP Points</p>
                </div>
             </div>
          </div>

          <nav className="card p-4 space-y-1">
             {[
               { icon: Settings, label: 'General', active: true },
               { icon: Shield, label: 'Security' },
               { icon: Bell, label: 'Notifications' },
               { icon: Key, label: 'Privacy' }
             ].map((item, i) => (
               <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${item.active ? 'bg-[#0E7C66] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
                 <item.icon size={18} />
                 {item.label}
               </button>
             ))}
          </nav>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="card p-8">
            <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-4 flex items-center gap-2">
               <Settings size={20} className="text-slate-500" />
               Account Information
            </h3>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Display Name</label>
                    <input type="text" className="input w-full bg-slate-900/50" value={user?.name} readOnly />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                    <input type="email" className="input w-full bg-slate-900/50" value={user?.email} readOnly />
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Academic Institution</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input type="text" className="input w-full pl-10" placeholder="e.g. Stanford University" />
                </div>
              </div>

              <div className="pt-6">
                 <button className="btn-primary px-8">Update Profile</button>
              </div>
            </div>
          </div>

          <div className="card p-8 border-red-500/20">
            <h3 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">Once you delete your account, there is no going back. All your data including roadmaps and study notes will be permanently removed.</p>
            <button className="px-6 py-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-bold uppercase tracking-widest">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
