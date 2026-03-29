'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EntryEditor from './EntryEditor';
import BreathingOrb from '../ui/BreathingOrb';
import { XMarkIcon } from '../ui/Icons';
import { useJournalStore } from '@/lib/store';

export default function EntryEditorModal({ onClose }: { onClose: () => void }) {
  const [editorContent, setEditorContent] = useState('');
  const addMessage = useJournalStore((state) => state.addMessage);

  // Keyboard shortcut to close editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSaveEditor = () => {
    if (editorContent.trim() !== '') {
        addMessage(editorContent.trim());
    }
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
    >
      {/* Extremely blurred backdrop mapping back to full pop-out experience */}
      <div 
        className="absolute inset-0 bg-paper/40 backdrop-blur-3xl transition-all"
        onClick={handleSaveEditor} // Clicking outside saves via debounce anyway to prevent data loss
      ></div>

      <motion.div 
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 10, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-4xl flex flex-col items-center gap-8"
      >
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <BreathingOrb mood={0.5} />
        </motion.div>

        <div className="w-full">
          <EntryEditor value={editorContent} onChange={setEditorContent} />
        </div>

        {/* Floating Modal Controls */}
        <div className="flex items-center gap-6 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-4 rounded-full glass-card text-foreground hover:bg-white hover:text-ink transition-all shadow-md shadow-ink/5"
            aria-label="Close Note"
          >
            <XMarkIcon className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(129, 166, 198, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveEditor}
            disabled={editorContent.trim() === ''}
            className="px-8 py-4 bg-amber-400 text-ink font-serif rounded-full tracking-widest uppercase transition-all disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-none shadow-xl shadow-amber-400/20 font-bold"
          >
            Release to Sea →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
