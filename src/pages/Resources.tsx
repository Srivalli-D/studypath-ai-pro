import React from 'react';
import { 
  BookMarked, 
  ExternalLink, 
  Code, 
  Terminal, 
  Cpu, 
  Globe,
  Youtube,
  Cloud
} from 'lucide-react';

const libraries = [
  {
    category: 'Foundations & DSA',
    icon: Terminal,
    color: 'text-blue-400',
    links: [
      { title: 'NeetCode 150', desc: 'Curated list of DSA questions', url: 'https://neetcode.io/practice' },
      { title: 'GeeksforGeeks', desc: 'Comprehensive CS concepts', url: 'https://geeksforgeeks.org' },
      { title: 'Core CS Curriculum', desc: 'Open source university courses', url: 'https://ossu.firebaseapp.com/' }
    ]
  },
  {
    category: 'System Design',
    icon: Cloud,
    color: 'text-emerald-400',
    links: [
      { title: 'System Design Primer', desc: 'The gold standard for learning SD', url: 'https://github.com/donnemartin/system-design-primer' },
      { title: 'ByteByteGo', desc: 'Visual system design explanations', url: 'https://bytebytego.com' }
    ]
  },
  {
    category: 'Interview Prep',
    icon: Code,
    color: 'text-[#0E7C66]',
    links: [
      { title: 'Blind 75', desc: 'Essential leetcode patterns', url: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions' },
      { title: 'Pramp', desc: 'Free peer-to-peer mock interviews', url: 'https://pramp.com' }
    ]
  },
  {
    category: 'Industry News',
    icon: Globe,
    color: 'text-orange-400',
    links: [
      { title: 'Hacker News', desc: 'Top tech discussions', url: 'https://news.ycombinator.com' },
      { title: 'InfoQ', desc: 'Deep dives into engineering culture', url: 'https://infoq.com' }
    ]
  }
];

export default function Resources() {
  return (
    <div className="space-y-12">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Resource Library</h1>
        <p className="text-slate-400 italic">"Access the knowledge that powers the industry's best engineers."</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {libraries.map((lib, i) => (
          <div key={i} className="card p-8">
            <div className="flex items-center gap-4 mb-8">
               <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center ${lib.color}`}>
                  <lib.icon size={26} />
               </div>
               <h2 className="text-2xl font-bold text-white">{lib.category}</h2>
            </div>
            
            <div className="space-y-4">
              {lib.links.map((link, j) => (
                <a 
                  key={j} 
                  href={link.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-[#0E7C66]/50 hover:bg-slate-800/80 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-200 group-hover:text-[#0E7C66] transition-colors">{link.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{link.desc}</p>
                    </div>
                    <ExternalLink size={16} className="text-slate-700 group-hover:text-[#0E7C66] transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-8 bg-slate-900/50 border-dashed border-slate-700 flex flex-col items-center text-center">
         <BookMarked size={48} className="text-slate-700 mb-6" />
         <h3 className="text-xl font-bold text-slate-400">More resources coming soon</h3>
         <p className="text-sm text-slate-600 mt-2">We're constantly updating our library with student suggestions.</p>
      </div>
    </div>
  );
}
