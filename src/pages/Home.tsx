import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Map, 
  BookOpen, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  Github,
  Zap,
  Globe,
  Star,
  FileText,
  Briefcase
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 overflow-x-hidden">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#0E7C66] rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-[#0E7C66]/30">S</div>
          <span className="font-bold text-2xl tracking-tight">StudyPath AI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-slate-400 hover:text-white transition-colors font-medium">Login</Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-32 relative">
        <div className="absolute top-0 right-0 -z-10 opacity-20 blur-3xl w-[500px] h-[500px] bg-[#0E7C66] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 -z-10 opacity-10 blur-3xl w-[400px] h-[400px] bg-blue-500 rounded-full -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0E7C66]/10 border border-[#0E7C66]/20 rounded-full text-[#0E7C66] text-sm font-semibold mb-6">
              <Sparkles size={16} />
              <span>Built by a student for students</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-[1.1]">
              Engineer Your <span className="text-[#0E7C66]">Future</span> with AI Precision.
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl">
              This project helps students plan their learning and career journey step by step. 
              The all-in-one companion for CS students to track studies, build roadmaps, and land internships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="btn-primary text-xl px-8 py-4 flex items-center justify-center gap-2 group">
                Start Your Journey
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="btn-secondary text-xl px-8 py-4 flex items-center justify-center gap-2">
                Explore Features
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="border-y border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Happy Students', value: '500+' },
            { label: 'Roadmaps Generated', value: '1.2k' },
            { label: 'Skills Tracked', value: '4.5k' },
            { label: 'Tasks Completed', value: '10k+' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            We've built all the tools required for a modern engineering student to excel in their academics and career.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'AI Roadmaps',
              desc: 'Generate customized career paths based on your current skills and future goals.',
              icon: Map,
              color: 'text-emerald-400'
            },
            {
              title: 'Study Planner',
              desc: 'Manage your daily tasks and priorities with a sleek, minimalist interface.',
              icon: BookOpen,
              color: 'text-blue-400'
            },
            {
              title: 'Skill Matrix',
              desc: 'Track your progress in various technologies and maintain a visual dashboard.',
              icon: Target,
              color: 'text-purple-400'
            },
            {
              title: 'Interview Prep',
              desc: 'Practice common internship questions and track your readiness.',
              icon: Zap,
              color: 'text-yellow-400'
            },
            {
              title: 'Notes & Resources',
              desc: 'Keep all your learning materials and documentation in one accessible place.',
              icon: FileText,
              color: 'text-pink-400'
            },
            {
              title: 'Internship Tracker',
              desc: 'Never lose track of an application. Manage companies and interview stages.',
              icon: Briefcase,
              color: 'text-orange-400'
            }
          ].map((feature, i) => (
            <div key={i} className="card p-8 hover:border-[#0E7C66]/50 transition-all group">
              <div className={`w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="card p-12 bg-gradient-to-br from-slate-800 to-slate-900 border-[#0E7C66]/30 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#0E7C66]/10 blur-3xl -mr-32 -mt-32"></div>
           <div className="relative z-10">
             <h2 className="text-4xl font-bold mb-6">Ready to Plan Your Journey?</h2>
             <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
               Join hundreds of other students who are using StudyPath AI to stay ahead of the curve and land their dream internships.
             </p>
             <Link to="/signup" className="btn-primary text-xl px-12 py-5 inline-block">
               Create Free Account
             </Link>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#0E7C66] rounded-lg flex items-center justify-center font-bold">S</div>
              <span className="font-bold text-xl tracking-tight">StudyPath AI</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-8">
              The professional career & study companion built by a student for students. Plan your learning and career journey step by step.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:text-[#0E7C66] transition-colors"><Globe size={20} /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:text-[#0E7C66] transition-colors"><Github size={20} /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:text-[#0E7C66] transition-colors"><Star size={20} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4 text-slate-500">
              <li><Link to="/roadmaps" className="hover:text-slate-200">Roadmaps</Link></li>
              <li><Link to="/study-planner" className="hover:text-slate-200">Study Planner</Link></li>
              <li><Link to="/resources" className="hover:text-slate-200">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-slate-500">
              <li><a href="#" className="hover:text-slate-200">About</a></li>
              <li><a href="#" className="hover:text-slate-200">Privacy</a></li>
              <li><a href="#" className="hover:text-slate-200">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-800/50 flex flex-col md:row justify-between items-center gap-4 text-slate-600 text-sm">
          <p>© 2026 StudyPath AI Pro. Built with ❤️ for the student community.</p>
        </div>
      </footer>
    </div>
  );
}
