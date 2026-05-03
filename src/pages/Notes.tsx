import React, { useEffect, useState } from 'react';
import api from '../api/index';
import { 
  Plus, 
  Search, 
  FileText, 
  Tag, 
  Calendar, 
  ChevronRight,
  Filter,
  Trash2,
  BookMarked,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['Web Dev', 'DSA', 'AI', 'Interview', 'Database', 'Other'];

export default function Notes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', category: 'Web Dev', content: '' });
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await api.get('/study/notes');
      setNotes(res.data);
    } catch (error) {
      console.error('Failed to fetch notes', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/study/notes', newNote);
      setNotes([res.data, ...notes]);
      setShowAddModal(false);
      setNewNote({ title: '', category: 'Web Dev', content: '' });
    } catch (error) {
      alert('Failed to add note');
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesCategory = filterCategory === 'All' || note.category === filterCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Student Notes</h1>
          <p className="text-slate-400 mt-1">Capture your learnings, class notes, and interview insights.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create Note
        </button>
      </header>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setFilterCategory('All')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              filterCategory === 'All' ? 'bg-[#0E7C66] text-white border-transparent shadow-lg shadow-[#0E7C66]/20' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            ALL
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                filterCategory === cat ? 'bg-[#0E7C66] text-white border-transparent' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
           <input 
            type="text" 
            placeholder="Search notes..." 
            className="input w-full pl-10 h-10 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
           />
           {searchQuery && (
             <button 
               onClick={() => setSearchQuery('')}
               className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
             >
               <X size={14} />
             </button>
           )}
        </div>
      </div>

      {/* Notes Masonry Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-slate-500">Retrieving archives...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="col-span-full card p-20 text-center">
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-700">
               <BookMarked size={32} />
            </div>
            <p className="text-slate-400 max-w-xs mx-auto italic">"The shortest pencil is longer than the longest memory."</p>
            <p className="text-slate-500 mt-2">Start your first knowledge entry.</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <motion.div 
              key={note.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card flex flex-col hover:border-[#0E7C66]/30 transition-all group"
            >
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-[#0E7C66] uppercase tracking-[0.2em] px-2 py-1 bg-[#0E7C66]/10 rounded border border-[#0E7C66]/20">
                    {note.category}
                  </span>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(note.createdAt).toLocaleDateString()}</p>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#0E7C66] transition-colors">{note.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-4 leading-relaxed italic">
                  {note.content}
                </p>
              </div>
              <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/10">
                <button className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1 group/btn transition-colors">
                   Read Full
                   <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={async () => {
                    if (confirm('Delete this note?')) {
                      try {
                        await api.delete(`/study/notes/${note.id}`);
                        setNotes(notes.filter(n => n.id !== note.id));
                      } catch (err) {
                        alert('Failed to delete note');
                      }
                    }
                  }}
                  className="text-slate-700 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Note Modal */}
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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl card p-8 z-[110]"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">Create New Note</h2>
              <form onSubmit={handleAddNote} className="space-y-5">
                <div className="grid md:grid-cols-3 gap-5">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Entry Title</label>
                    <input 
                      type="text" 
                      className="input w-full"
                      placeholder="e.g. Dijkstra's Algorithm Recap"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                    <select 
                      className="input w-full appearance-none"
                      value={newNote.category}
                      onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Content</label>
                  <textarea 
                    rows={8}
                    className="input w-full resize-none py-3"
                    placeholder="Capture the core concepts here..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 font-bold">DISCARD</button>
                  <button type="submit" className="btn-primary flex-1 font-bold">SAVE TO ARCHIVE</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
