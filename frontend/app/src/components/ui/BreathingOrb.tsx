'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BreathingOrbProps {
  mood?: number; // -1.0 to 1.0
}

const BreathingOrb: React.FC<BreathingOrbProps> = ({ mood = 0 }) => {
  // Color mapping based on mood
  // Neutral: blue-grey
  // Joy: amber gold
  // Sad: deep violet
  const getOrbColor = () => {
    if (mood > 0.3) return 'rgba(245, 158, 11, 0.7)'; // Warm Amber
    if (mood < -0.3) return 'rgba(139, 92, 246, 0.5)'; // Soft Violet
    return 'rgba(245, 158, 11, 0.3)'; // Muted Amber
  };

  const getShadowColor = () => {
    if (mood > 0.3) return '0 0 100px 30px rgba(245, 158, 11, 0.4)';
    if (mood < -0.3) return '0 0 100px 30px rgba(139, 92, 246, 0.3)';
    return '0 0 100px 30px rgba(245, 158, 11, 0.2)';
  };

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          backgroundColor: getOrbColor(),
          boxShadow: getShadowColor(),
        }}
        className="w-32 h-32 rounded-full blur-2xl transition-colors duration-2000"
      />
    </div>
  );
};

export default BreathingOrb;
