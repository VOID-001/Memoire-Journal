'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function WaveBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-background pointer-events-none">
      {/* Sun/Light glare top right */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/20 rounded-full blur-[100px]" />
      
      {/* Gentle sea glow bottom center */}
      <div className="absolute bottom-[-20%] left-[20%] right-[20%] h-1/2 bg-ocean/10 blur-[120px]" />

      {/* Animated waves using SVGs */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-2/5 opacity-30">
        <motion.div
          animate={{ x: ['0vw', '-200vw'] }}
          transition={{
            repeat: Infinity,
            duration: 40,
            ease: 'linear',
          }}
          className="absolute bottom-0 left-0 w-[400vw] h-full flex"
        >
          {Array(4).fill(0).map((_, i) => (
             <svg key={`sky-${i}`} className="w-[100vw] h-full block" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
               <path fill="var(--color-sky)" fillOpacity="0.8" d="M0,160L48,154.7C96,149,192,139,288,149.3C384,160,480,192,576,192C672,192,768,160,864,154.7C960,149,1056,171,1152,181.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
             </svg>
          ))}
        </motion.div>

        <motion.div
          animate={{ x: ['-200vw', '0vw'] }}
          transition={{
            repeat: Infinity,
            duration: 50,
            ease: 'linear',
          }}
          className="absolute bottom-[-10%] left-0 w-[400vw] h-[110%] flex"
        >
          {Array(4).fill(0).map((_, i) => (
             <svg key={`ocean-${i}`} className="w-[100vw] h-full block" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
               <path fill="var(--color-ocean)" fillOpacity="1" d="M0,256L60,240C120,224,240,192,360,197.3C480,203,600,245,720,245.3C840,245,960,203,1080,186.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
             </svg>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
