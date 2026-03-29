'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useJournalStore } from '@/lib/store';

export default function InputBox() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addMessage = useJournalStore(state => state.addMessage);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        addMessage(input.trim());
        setInput('');
      }
    }
  };

  return (
    <div className="w-full relative z-10 glass-card p-2 rounded-3xl mt-4 shrink-0 transition-all duration-300 focus-within:shadow-xl focus-within:shadow-ocean/10 focus-within:border-ocean/40">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a reflection... (Press Enter to log)"
        className="w-full bg-transparent border-none outline-none font-sans text-lg text-ink placeholder:text-foreground/40 resize-none px-6 py-4 max-h-[200px] overflow-y-auto overflow-x-hidden"
      />
    </div>
  );
}
