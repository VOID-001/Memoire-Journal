'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock } from 'lucide-react';

const MOCK_HISTORY = [
    { id: 1, title: 'Morning Reflection', preview: 'Started the day with a hot cup of tea...', time: 'Today, 8:00 AM' },
    { id: 2, title: 'Career Anxiety', preview: 'Thinking about the upcoming presentation...', time: 'Yesterday, 9:20 PM' },
    { id: 3, title: 'Beach Walk thoughts', preview: 'The waves were extremely calm today.', time: 'Mar 24, 6:15 PM' },
    { id: 4, title: 'Deep Work Session', preview: 'Finally figured out the architecture.', time: 'Mar 22, 11:00 AM' },
];

export default function ExploreView() {
  const [selectedThread, setSelectedThread] = useState(MOCK_HISTORY[0]);

  return (
    <div className="w-full h-[calc(100vh-140px)] flex gap-8 max-w-7xl mx-auto pt-12 pb-4">
      
      {/* LEFT SIDEBAR: History List (ChatGPT Style) */}
      <div className="w-full xl:w-[350px] shrink-0 h-full flex flex-col bg-white/20 glass-card rounded-[2rem] overflow-hidden border border-white/40 shadow-xl">
         
         <div className="p-6 border-b border-driftwood/20 bg-paper/30 backdrop-blur-md">
            <h2 className="text-2xl font-serif font-bold text-ink mb-4">Past Tides</h2>
            <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input 
                    type="text" 
                    placeholder="Search memories..." 
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-white/40 border border-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-foreground/40 text-sm font-medium transition-all"
                />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto HideScrollbar p-4 space-y-2">
            {MOCK_HISTORY.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setSelectedThread(item)}
                  className={`w-full text-left p-4 rounded-2xl transition-all ${selectedThread.id === item.id ? 'bg-amber-100/60 shadow-sm border border-amber-200/50' : 'hover:bg-white/40 border border-transparent'}`}
                >
                    <h4 className="font-bold text-ink text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-foreground/60 line-clamp-1 mb-2">{item.preview}</p>
                    <div className="flex items-center gap-1 text-[10px] text-foreground/40 font-semibold uppercase tracking-widest">
                       <Clock className="w-3 h-3" /> {item.time}
                    </div>
                </button>
            ))}
         </div>
      </div>

      {/* RIGHT MAIN AREA: Content of selected historical thread */}
      <div className="flex-1 h-full glass-card p-12 rounded-[2.5rem] overflow-y-auto HideScrollbar flex flex-col items-center justify-center border-[3px] border-white/40 shadow-2xl relative bg-gradient-to-br from-white/10 to-transparent">
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiM4MWE2YzYiLz48L3N2Zz4=')" }}></div>
          
          <div className="text-center max-w-md relative z-10">
              <span className="text-4xl mb-4 block">🐚</span>
              <h3 className="font-serif text-3xl font-bold text-ink mb-4">{selectedThread.title}</h3>
              <p className="text-foreground/70 leading-relaxed italic border-l-2 border-amber-400 pl-4">
                  "{selectedThread.preview}"
              </p>
              
              <button className="mt-8 px-6 py-3 bg-white/40 hover:bg-white/70 transition-colors rounded-full text-xs font-bold uppercase tracking-widest text-ink shadow-sm border border-white/60">
                  Open full thread
              </button>
          </div>
      </div>

    </div>
  );
}
