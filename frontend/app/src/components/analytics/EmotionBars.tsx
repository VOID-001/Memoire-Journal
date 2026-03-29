import React from 'react';

const mockEmotions = [
  { label: "Happy", value: 48, color: "bg-ocean" },
  { label: "Sad", value: 33, color: "bg-driftwood" },
  { label: "Calm", value: 27, color: "bg-sky" },
  { label: "Anxious", value: 40, color: "bg-ink/50" },
];

export default function EmotionBars() {
  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl w-full max-w-sm">
        <h3 className="text-xl font-bold text-ink font-serif mb-2">Emotions</h3>
        <p className="text-foreground/60 text-sm mb-12">Here are four core emotions for your journal</p>

        <div className="flex justify-between items-end h-64 gap-2">
        {mockEmotions.map((e) => (
            <div key={e.label} className="flex flex-col items-center w-full relative group">
                {/* Background pillar */}
                <div className="w-full absolute bottom-8 top-0 bg-white/40 rounded-[2rem] -z-10 group-hover:bg-white/60 transition-colors"></div>
                
                {/* Value bar */}
                <div
                    style={{ height: `${Math.max(e.value * 2, 20)}px` }}
                    className={`w-full rounded-[2rem] ${e.color} shadow-lg shadow-${e.color.replace('bg-', '')}/20 transition-all duration-700 ease-out`}
                />
                
                {/* Number overlay on bar */}
                <span className="absolute bottom-12 text-white font-bold text-sm tracking-widest">{e.value}%</span>
                
                <span className="mt-4 text-xs font-semibold text-foreground tracking-widest uppercase">{e.label}</span>
            </div>
        ))}
        </div>
    </div>
  );
}
