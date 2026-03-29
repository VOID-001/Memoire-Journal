'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Calendar from '@/components/ui/Calendar';
import ChatWindow from '@/components/journal/ChatWindow';
import { useJournalStore } from '@/lib/store';

export default function HomeView() {
  const selectedDate = useJournalStore(state => state.date);
  const setDate = useJournalStore(state => state.setDate);

  return (
    <div className="w-full h-[calc(100vh-140px)] flex flex-col xl:flex-row gap-12 max-w-7xl mx-auto pb-4 pt-12">
      
      {/* LEFT SIDEBAR: Calendar & Widgets */}
      <div className="w-full xl:w-[400px] shrink-0 space-y-8 flex flex-col h-full HideScrollbar overflow-y-auto pr-4">
          
          <h1 className="text-4xl font-bold font-serif text-ink tracking-tight mb-2">
             Hi, Jose Maria
          </h1>
          <p className="text-foreground/60 text-sm mb-6 uppercase tracking-widest font-semibold">It's a beautiful day to reflect.</p>
          
          {/* Calendar Grid (Explicitly Desktop Sized) */}
          <div className="w-full">
            <Calendar 
                notes={[]} // In the future, API call can populate a "heat map" array here
                selectedDate={selectedDate} 
                setSelectedDate={setDate} 
                isExpanded={true} 
            />
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar pt-4">
              <div className="glass-card bg-red-50/50 shrink-0 w-44 rounded-[2rem] p-5 cursor-pointer hover:shadow-md transition-shadow">
                  <h4 className="font-serif font-bold text-ink mb-1 flex items-center gap-1">Pause & reflect 🌱</h4>
                  <p className="text-xs text-foreground/70 mb-4 line-clamp-2">What are you grateful for today?</p>
                  <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest mt-auto">
                      <span className="text-foreground/40">Today</span>
                      <span className="text-red-400">Personal</span>
                  </div>
              </div>

              <div className="glass-card bg-indigo-50/50 shrink-0 w-44 rounded-[2rem] p-5 cursor-pointer hover:shadow-md transition-shadow">
                  <h4 className="font-serif font-bold text-ink mb-1 flex items-center gap-1">Set Intentions ☀️</h4>
                  <p className="text-xs text-foreground/70 mb-4 line-clamp-2">How do you want to feel?</p>
                  <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest mt-auto">
                      <span className="text-foreground/40">Today</span>
                      <span className="text-indigo-400">Family</span>
                  </div>
              </div>
          </div>
      </div>

      {/* RIGHT MAIN AREA: Conversation Thread */}
      <div className="flex-1 h-full flex flex-col relative glass-card p-2 rounded-[2.5rem] bg-white/10 shadow-2xl border-white/40 border-[3px]">
          
          <div className="w-full py-4 text-center border-b border-driftwood/20 absolute top-0 left-0 bg-paper/30 backdrop-blur-xl rounded-t-[2.3rem] z-20 shadow-sm">
             <h2 className="font-serif font-bold text-ink/80 text-xl tracking-wide">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
             </h2>
          </div>

          <div className="flex-1 pt-16 rounded-b-[2rem] overflow-hidden">
             <ChatWindow />
          </div>
      </div>

    </div>
  );
}
