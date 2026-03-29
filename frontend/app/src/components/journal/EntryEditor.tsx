'use client';

import React, { useState, useRef, useEffect } from 'react';

const EntryEditor: React.FC<{ value: string, onChange: (val: string) => void }> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="relative w-full max-w-3xl mx-auto group">
      {/* Soft animated glow behind the editor */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
      
      <div className="relative glass-card rounded-3xl p-6 md:p-10 transition-all duration-700 hover:shadow-2xl hover:shadow-accent/5">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What's on your mind?..."
          className="w-full bg-transparent border-none outline-none font-serif text-2xl md:text-3xl text-foreground placeholder:text-foreground/30 leading-relaxed resize-none overflow-hidden min-h-[150px]"
          autoFocus
        />
        
        {/* Subtle breathing dot when empty */}
        {!value && (
          <div className="absolute bottom-10 right-10 flex items-center gap-3 opacity-50">
            <span className="text-xs uppercase tracking-widest font-sans text-accent/60">Waiting</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryEditor;
