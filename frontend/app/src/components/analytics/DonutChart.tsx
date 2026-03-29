import React from 'react';

export default function DonutChart() {
  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl w-full flex flex-col items-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Extremely simple radial SVG simulation. For production: use chart.js or Recharts */}
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="#f3e3d0" strokeWidth="15" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#81a6c6" strokeWidth="15" fill="none" strokeDasharray="100 150" strokeLinecap="round" />
                <circle cx="50" cy="50" r="40" stroke="#aacddc" strokeWidth="15" fill="none" strokeDasharray="60 190" strokeDashoffset="-105" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-ink text-center">
                <span className="text-4xl font-serif font-bold tracking-tight">628</span>
                <span className="text-sm text-foreground uppercase tracking-widest">journals</span>
            </div>
        </div>

        <div className="w-full mt-8 space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold text-foreground uppercase tracking-widest border-b border-white/20 pb-2">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-ocean"></div> Slow Living</div>
                <span>21%</span>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold text-foreground uppercase tracking-widest border-b border-white/20 pb-2">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-sky"></div> Reflection</div>
                <span>18%</span>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold text-foreground uppercase tracking-widest pb-2">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-driftwood"></div> Creativity</div>
                <span>15%</span>
            </div>
        </div>
    </div>
  );
}
