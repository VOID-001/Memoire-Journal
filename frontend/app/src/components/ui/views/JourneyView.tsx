'use client';

import React from 'react';
import EmotionBars from '@/components/analytics/EmotionBars';
import DonutChart from '@/components/analytics/DonutChart';
import KnowledgeGraph from '@/components/analytics/KnowledgeGraph';

export default function JourneyView() {
  return (
    <div className="w-full h-[calc(100vh-140px)] max-w-7xl mx-auto pt-12 pb-4 flex flex-col items-center overflow-y-auto HideScrollbar">
      
      <div className="w-full flex justify-between items-end mb-8">
          <div>
              <h2 className="text-4xl font-serif font-bold text-ink mb-2">Analytics & Insights</h2>
              <p className="text-foreground/60 font-semibold uppercase tracking-widest text-sm">Understanding your patterns</p>
          </div>

          <div className="flex bg-white/20 p-1 rounded-full w-[250px] border border-white/40 shadow-inner">
             <button className="flex-1 bg-amber-400 text-ink rounded-full py-2 text-xs font-bold shadow-md shadow-amber-400/20">Overview</button>
             <button className="flex-1 text-foreground/60 hover:text-ink py-2 text-xs font-bold transition-colors">Semantic Graph</button>
          </div>
      </div>

      {/* Desktop Grid Layout */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          
          <div className="h-full">
             <DonutChart />
          </div>

          <div className="h-full">
             <EmotionBars />
          </div>

          <div className="h-full xl:col-span-1 md:col-span-2">
             <KnowledgeGraph />
          </div>

      </div>

    </div>
  );
}
