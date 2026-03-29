'use client';

import React from 'react';
import { Home, Compass, Plus, FileText, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dock({ activeTab, onNavigate, onFloatAction }: { activeTab: string, onNavigate: (tab: string) => void, onFloatAction: () => void }) {
  
  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => {
    const isActive = activeTab === id;
    return (
      <button 
        onClick={() => onNavigate(id)} 
        className="flex flex-col items-center gap-1 p-2 group"
      >
        <Icon 
          strokeWidth={isActive ? 2.5 : 1.5} 
          className={`w-6 h-6 transition-all ${isActive ? 'text-ink scale-110' : 'text-ink/50 group-hover:text-ink/80'}`} 
        />
        <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-ink' : 'text-ink/50 group-hover:text-ink/80'}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in pb-4">
      {/* 
        This is a full-width bottom navigation bar on mobile (rounded top), 
        and a floating dock on desktop 
      */}
      <div className="mx-auto w-full max-w-lg bg-paper/90 backdrop-blur-2xl sm:rounded-[2rem] rounded-t-[2rem] border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-6 py-3 flex justify-between items-center relative">
        
        <NavItem id="home" icon={Home} label="Home" />
        <NavItem id="explore" icon={Compass} label="Explore" />
        
        {/* The prominent Yellow + button from Figma */}
        <div className="relative -top-8 px-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFloatAction}
            className="w-14 h-14 bg-amber-400 text-ink rounded-full flex items-center justify-center shadow-lg shadow-amber-400/30 ring-4 ring-paper"
          >
            <Plus className="w-8 h-8" />
          </motion.button>
        </div>

        <NavItem id="journey" icon={FileText} label="Journey" />
        <NavItem id="profile" icon={User} label="Profile" />
        
      </div>
    </div>
  );
}
