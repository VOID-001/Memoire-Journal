'use client';

import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';
import { useJournalStore } from '@/lib/store';

export default function ChatWindow() {
  const messages = useJournalStore(state => state.messages);
  const clearMessages = useJournalStore(state => state.clearMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative max-w-3xl mx-auto w-full">
      <div className="flex justify-end px-4 py-2">
        <button
          onClick={clearMessages}
          className="text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-red-400 transition-colors bg-white/20 px-3 py-1 rounded-full border border-white/30"
        >
          Clear Journal
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32 hide-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center opacity-50 space-y-4">
            <span className="text-4xl">🌊</span>
            <p className="font-serif italic text-xl">The day is a blank tide.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble key={idx} role={msg.role} content={msg.content} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="absolute bottom-8 left-0 right-0 px-4">
        <InputBox />
      </div>
    </div>
  );
}
