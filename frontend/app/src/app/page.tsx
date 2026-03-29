'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dock from '@/components/ui/Dock';
import HomeView from '@/components/ui/views/HomeView';
import ExploreView from '@/components/ui/views/ExploreView';
import JourneyView from '@/components/ui/views/JourneyView';
import ProfileView from '@/components/ui/views/ProfileView';
import EntryEditorModal from '@/components/journal/EntryEditorModal';
import { useJournalStore } from '@/lib/store';

export default function AppMasterLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const selectedDate = useJournalStore(state => state.date);
  const setMessages = useJournalStore(state => state.setMessages);
  
  // Load initial entries for the active date (if API is connected)
  useEffect(() => {
    async function loadDay() {
      try {
        const isoDate = selectedDate.toISOString().split('T')[0];
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/journal/${isoDate}`);
        if(res.ok) {
            const data = await res.json();
            setMessages(data.messages || []);
        }
      } catch (err) {
        console.warn("API not ready yet, proceeding optimisticly");
      }
    }
    loadDay();
  }, [selectedDate, setMessages]);

  return (
    <div className="relative min-h-screen w-full bg-sand/30 font-sans text-foreground overflow-hidden flex flex-col items-center">

      {/* Primary Full-Width Desktop App View */}
      <div className="relative w-full flex-grow max-w-[100vw] lg:max-w-7xl mx-auto px-4 md:px-8 py-8 mb-32">
          {/* Subtle Crossfade Desktop Switching instead of mobile horizontal swiping */}
          <AnimatePresence mode="wait">
            
            {activeTab === 'home' && (
              <motion.div 
                 key="home" 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                 className="absolute inset-0 px-8"
              >
                  <HomeView />
              </motion.div>
            )}
            
            {activeTab === 'explore' && (
              <motion.div 
                 key="explore" 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                 className="absolute inset-0 px-8"
              >
                  <ExploreView />
              </motion.div>
            )}
            
            {activeTab === 'journey' && (
              <motion.div 
                 key="journey" 
                 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} 
                 className="absolute inset-0 px-8"
              >
                  <JourneyView />
              </motion.div>
            )}
            
            {activeTab === 'profile' && (
              <motion.div 
                 key="profile" 
                 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} 
                 className="absolute inset-0 px-8"
              >
                  <ProfileView />
              </motion.div>
            )}

          </AnimatePresence>
      </div>

      <Dock 
        activeTab={activeTab} 
        onNavigate={setActiveTab} 
        onFloatAction={() => setIsEditorOpen(true)} 
      />

      {/* Pop-out Editor Overlay stays functionally identical */}
      <AnimatePresence>
         {isEditorOpen && <EntryEditorModal onClose={() => setIsEditorOpen(false)} />}
      </AnimatePresence>
      
    </div>
  );
}
