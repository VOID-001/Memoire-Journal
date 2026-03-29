'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [personas, setPersonas] = useState<any[]>([]);
  const [activeId, setActiveId] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, uRes] = await Promise.all([
          fetch('/api/persona/list'),
          fetch('/api/auth/me')
        ]);
        
        const pData = await pRes.json();
        const uData = await uRes.json();
        
        if (pRes.ok) setPersonas(pData.personas);
        if (uRes.ok) setActiveId(uData.user.active_persona_id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSetPersona = async (id: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/persona/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaId: id }),
      });
      if (res.ok) {
        setActiveId(id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-48">
      <div className="flex justify-between items-center mb-12">
        <Link href="/journal" className="text-accent/60 hover:text-accent font-serif tracking-widest text-sm uppercase">
          ← Back to Daily
        </Link>
        <h1 className="text-3xl font-serif text-accent tracking-widest uppercase text-center flex-1">
          Who speaks to you?
        </h1>
        <div className="w-20" /> {/* Spacer */}
      </div>

      {loading ? (
        <div className="text-center font-serif text-foreground/40 italic py-24">
          Finding the souls...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {personas.map((persona) => (
            <motion.div
              key={persona.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleSetPersona(persona.id)}
              className={`p-8 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                activeId === persona.id 
                ? 'bg-accent/10 border-accent' 
                : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {activeId === persona.id && (
                <div className="absolute top-4 right-4 text-accent text-xs font-sans tracking-widest uppercase">
                  Active
                </div>
              )}
              
              <div className="text-4xl mb-6">{persona.emoji}</div>
              <h3 className="text-xl font-serif text-white mb-2 tracking-wide uppercase">
                {persona.name}
              </h3>
              <p className="text-accent/60 font-serif italic text-sm mb-4">
                "{persona.tagline}"
              </p>
              <p className="text-foreground/40 text-xs font-sans leading-relaxed line-clamp-3">
                {persona.system_prompt}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {updating && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 px-6 py-3 bg-accent text-background font-serif text-sm tracking-widest uppercase rounded-full animate-pulse shadow-xl shadow-accent/20">
          Soul shifting...
        </div>
      )}
    </div>
  );
}
