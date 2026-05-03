import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2, 
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Globe,
  Zap,
  Map as MapIcon,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const mockJobs = [
  {
    id: 1,
    title: "STEP Intern, 2025",
    company: "Google",
    location: "Bengaluru / Hyderabad",
    isRemote: false,
    type: "Internship",
    salaryValue: 80000,
    salaryLabel: "₹80,000 - 1,00,000 / mo",
    tags: ["C++", "Java", "Python", "Data Structures"],
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: true,
    applyUrl: "https://www.google.com/about/careers/applications/jobs/results/?q=intern"
  },
  {
    id: 2,
    title: "Software Engineering Intern",
    company: "Microsoft",
    location: "Hyderabad / Noida",
    isRemote: false,
    type: "Internship",
    salaryValue: 85000,
    salaryLabel: "₹85,000 - 1,15,000 / mo",
    tags: ["C#", "Azure", "Cloud Computing"],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: true,
    applyUrl: "https://careers.microsoft.com/v2/global/en/home.html"
  },
  {
    id: 3,
    title: "SDE Intern",
    company: "Amazon",
    location: "Bengaluru / Chennai",
    isRemote: false,
    type: "Internship",
    salaryValue: 80000,
    salaryLabel: "₹75,000 - 90,000 / mo",
    tags: ["Java", "Distributed Systems", "AWS"],
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: true,
    applyUrl: "https://www.amazon.jobs/en/teams/university-recruiting"
  },
  {
    id: 4,
    title: "Software Engineer Intern",
    company: "PhonePe",
    location: "Bengaluru",
    isRemote: false,
    type: "Internship",
    salaryValue: 60000,
    salaryLabel: "₹60,000 / mo",
    tags: ["Java", "Spring Boot", "Microservices"],
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false,
    applyUrl: "https://www.phonepe.com/careers/freshers/"
  },
  {
    id: 5,
    title: "Graduate Software Engineer",
    company: "Atlassian",
    location: "Remote (India)",
    isRemote: true,
    type: "Full-time",
    salaryValue: 150000,
    salaryLabel: "₹18 - 25 LPA",
    tags: ["React", "TypeScript", "Node.js"],
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false,
    applyUrl: "https://www.atlassian.com/company/careers/graduates"
  },
  {
    id: 6,
    title: "Product Engineering Intern",
    company: "Zomato",
    location: "Gurugram",
    isRemote: false,
    type: "Internship",
    salaryValue: 40000,
    salaryLabel: "₹40,000 - 60,000 / mo",
    tags: ["PHP", "Next.js", "React Native"],
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: true,
    applyUrl: "https://www.zomato.com/careers"
  },
  {
    id: 7,
    title: "Summer Analyst (Engineering)",
    company: "Goldman Sachs",
    location: "Bengaluru",
    isRemote: false,
    type: "Internship",
    salaryValue: 100000,
    salaryLabel: "₹1,00,000 / mo",
    tags: ["Algorithms", "Java", "Financial Tech"],
    postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false,
    applyUrl: "https://www.goldmansachs.com/careers/students/programs/"
  },
  {
    id: 8,
    title: "Associate Software Engineer",
    company: "Salesforce",
    location: "Hyderabad / Bengaluru",
    isRemote: false,
    type: "Full-time",
    salaryValue: 120000,
    salaryLabel: "₹12 - 18 LPA",
    tags: ["Apex", "Cloud Engineering", "JavaScript"],
    postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false,
    applyUrl: "https://www.salesforce.com/company/careers/"
  }
];

export default function JobBoard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [minSalary, setMinSalary] = useState(0);
  const [workLocation, setWorkLocation] = useState<'All' | 'Remote' | 'On-site'>('All');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [isApplying, setIsApplying] = useState<number | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('savedJobIds');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedJobIds, setAppliedJobIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('appliedJobIds');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedJobIds', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem('appliedJobIds', JSON.stringify(appliedJobIds));
  }, [appliedJobIds]);

  const handleApply = (id: number) => {
    if (!appliedJobIds.includes(id)) {
      setAppliedJobIds(prev => [...prev, id]);
    }
  };

  const allTechs = Array.from(new Set(mockJobs.flatMap(j => j.tags)));
  
  const sortedAndFilteredJobs = useMemo(() => {
    let result = mockJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || job.type === filterType;
      const matchesSalary = job.salaryValue >= minSalary;
      const matchesRemote = 
        workLocation === 'All' || 
        (workLocation === 'Remote' && job.isRemote) || 
        (workLocation === 'On-site' && !job.isRemote);
      const matchesTech = selectedTech.length === 0 || selectedTech.some(t => job.tags.includes(t));
      
      return matchesSearch && matchesType && matchesSalary && matchesRemote && matchesTech;
    });

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    } else if (sortBy === 'salary-high') {
      result.sort((a, b) => b.salaryValue - a.salaryValue);
    } else if (sortBy === 'salary-low') {
      result.sort((a, b) => a.salaryValue - b.salaryValue);
    } else if (sortBy === 'relevance') {
      // Relevance: based on matching tech skills
      result.sort((a, b) => {
        const aMatches = selectedTech.filter(t => a.tags.includes(t)).length;
        const bMatches = selectedTech.filter(t => b.tags.includes(t)).length;
        return bMatches - aMatches;
      });
    }
    return result;
  }, [searchQuery, filterType, minSalary, workLocation, selectedTech, sortBy]);

  const toggleTech = (tech: string) => {
    setSelectedTech(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleSave = (jobId: number) => {
    setSavedJobIds(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             Curated Job Board
             <span className="px-2 py-0.5 bg-[#0E7C66]/10 text-[#0E7C66] text-[10px] font-bold rounded border border-[#0E7C66]/20 tracking-widest uppercase">Verified</span>
          </h1>
          <p className="text-slate-400 mt-1">Direct opportunities for students and fresh graduates.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-3">
              <Sparkles className="text-indigo-400" size={20} />
              <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Matchmaking</p>
                 <p className="text-xs text-white">3 new jobs match your <b>React</b> skills!</p>
              </div>
           </div>
        </div>
      </header>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-6">
           <div className="card p-6 space-y-8">
              <div>
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Filter size={12} />
                    Employment Type
                 </h3>
                 <div className="space-y-3">
                    {['All', 'Internship', 'Full-time', 'Freelance'].map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                         <input 
                           type="radio" 
                           name="type" 
                           className="w-4 h-4 accent-[#0E7C66] bg-slate-900 border-slate-700"
                           checked={filterType === type}
                           onChange={() => setFilterType(type)}
                         />
                         <span className={`text-sm tracking-tight transition-colors ${filterType === type ? 'text-[#0E7C66] font-bold' : 'text-slate-400 group-hover:text-slate-200'}`}>
                           {type}
                         </span>
                      </label>
                    ))}
                 </div>
              </div>

              <div>
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <DollarSign size={12} />
                    Min Monthly Salary
                 </h3>
                 <input 
                   type="range" 
                   min="0" 
                   max="50000" 
                   step="5000" 
                   value={minSalary}
                   onChange={(e) => setMinSalary(parseInt(e.target.value))}
                   className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0E7C66]"
                 />
                 <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase">
                    <span>₹0</span>
                    <span className="text-[#0E7C66]">₹{minSalary.toLocaleString()}</span>
                    <span>₹50k+</span>
                 </div>
              </div>

              <div>
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Globe size={12} />
                    Work Location
                 </h3>
                 <div className="grid grid-cols-1 gap-2">
                    {['All', 'Remote', 'On-site'].map(loc => (
                       <button
                         key={loc}
                         onClick={() => setWorkLocation(loc as any)}
                         className={`py-2 px-4 rounded-lg text-xs font-bold border transition-all ${
                           workLocation === loc 
                           ? 'bg-[#0E7C66]/10 border-[#0E7C66] text-[#0E7C66]' 
                           : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                         }`}
                       >
                          {loc}
                       </button>
                    ))}
                 </div>
              </div>

              <div>
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={12} />
                    Technologies
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {allTechs.map(tech => (
                       <button
                         key={tech}
                         onClick={() => toggleTech(tech)}
                         className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                           selectedTech.includes(tech) 
                           ? 'bg-[#0E7C66] text-white' 
                           : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                         }`}
                       >
                          {tech}
                       </button>
                    ))}
                 </div>
              </div>

              <button 
                onClick={() => {
                   setFilterType('All');
                   setMinSalary(0);
                   setWorkLocation('All');
                   setSelectedTech([]);
                }}
                className="w-full py-2 text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest border border-slate-800 rounded-lg transition-colors"
              >
                 Reset Filters
              </button>
           </div>
        </aside>

        {/* Main Job List */}
        <div className="md:col-span-3 space-y-6">
           <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                 <input 
                   type="text" 
                   placeholder="Titles, companies, skills..." 
                   className="input w-full pl-12 h-14 text-lg"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              <div className="flex gap-4">
                 <div className="relative">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="btn-secondary h-14 pl-6 pr-10 appearance-none font-bold uppercase tracking-widest text-sm outline-none cursor-pointer"
                    >
                       <option value="newest">Recent</option>
                       <option value="relevance">Relevance</option>
                       <option value="salary-high">High Pay</option>
                       <option value="salary-low">Entry level pay</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                       <Filter size={16} />
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                 {sortedAndFilteredJobs.map((job) => (
                   <motion.div 
                     key={job.id}
                     layout
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="card p-6 hover:border-[#0E7C66]/50 transition-all group relative overflow-hidden"
                   >
                      {job.isNew && (
                        <div className="absolute top-0 right-0 p-1 px-3 bg-[#0E7C66] text-white text-[9px] font-bold uppercase tracking-widest rounded-bl-lg">
                          New Position
                        </div>
                      )}
                      
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                         <div className="flex items-start gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 group-hover:scale-105 transition-transform group-hover:text-[#0E7C66]">
                               {job.company[0] === 'F' ? <CheckCircle2 /> : <Building2 size={24} />}
                            </div>
                            <div>
                               <div className="flex items-center gap-3">
                                  <h3 className="text-2xl font-bold text-white group-hover:text-[#0E7C66] transition-colors">{job.title}</h3>
                                  {job.isRemote && (
                                     <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded border border-blue-500/20 uppercase tracking-widest">
                                        Remote
                                     </span>
                                  )}
                               </div>
                               <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">
                                  <span className="flex items-center gap-1"><Building2 size={12} /> {job.company}</span>
                                  <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex flex-wrap lg:flex-col lg:items-end gap-1 text-right">
                            <span className="text-xl font-bold text-white">{job.salaryLabel}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1 lg:justify-end">
                               <Clock size={10} />
                               Posted {new Date(job.postedAt).toLocaleDateString()}
                            </span>
                         </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-slate-800 gap-6">
                         <div className="flex gap-2 flex-wrap">
                            {job.tags.map(tag => (
                              <span key={tag} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {tag}
                              </span>
                            ))}
                         </div>
                         <div className="flex gap-3 w-full sm:w-auto">
                            <button 
                              onClick={() => handleSave(job.id)}
                              className={`btn-secondary px-6 flex-1 sm:flex-none transition-all ${savedJobIds.includes(job.id) ? 'border-[#0E7C66] text-[#0E7C66] bg-[#0E7C66]/5' : ''}`}
                            >
                               {savedJobIds.includes(job.id) ? 'Saved' : 'Save'}
                            </button>
                            <a 
                              href={job.applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleApply(job.id)}
                              className="btn-primary px-8 flex-1 sm:flex-none flex items-center justify-center gap-2 group/btn min-w-[140px]"
                            >
                               {appliedJobIds.includes(job.id) ? 'Applied' : 'Apply Now'}
                               <ArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </a>
                         </div>
                      </div>
                   </motion.div>
                 ))}
              </AnimatePresence>
              
              {sortedAndFilteredJobs.length === 0 && (
                <div className="card p-20 text-center text-slate-500 italic flex flex-col items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <Search size={24} />
                   </div>
                   <p>No openings match your current filters. Try broadening your keywords or resetting filters.</p>
                   <button 
                     onClick={() => {
                        setSearchQuery('');
                        setFilterType('All');
                        setMinSalary(0);
                        setWorkLocation('All');
                        setSelectedTech([]);
                     }}
                     className="text-[#0E7C66] font-bold uppercase tracking-widest text-xs hover:underline"
                   >
                      Clear all search & filters
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
