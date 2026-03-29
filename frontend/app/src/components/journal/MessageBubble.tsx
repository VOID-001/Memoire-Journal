import React from 'react';
import { motion } from 'framer-motion';

export default function MessageBubble({ content, role }: { content: string, role: string }) {
  const isAI = role === 'AI';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-6 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      <div 
        className={`max-w-[85%] md:max-w-[75%] p-5 rounded-3xl ${
          isAI 
            ? 'glass-card rounded-tl-sm text-foreground' 
            : 'bg-ocean/90 text-white rounded-tr-sm shadow-md shadow-ocean/20'
        }`}
      >
        <p className="whitespace-pre-wrap font-sans leading-relaxed text-[1.1rem]">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
