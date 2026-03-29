'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="whitespace-pre-wrap"
    >
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-1 h-5 ml-1 bg-accent animate-pulse align-middle" />
      )}
    </motion.p>
  );
};

export default TypewriterText;
