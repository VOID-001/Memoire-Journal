'use client';

import React, { useState } from 'react';
import { Settings, Bell, Lock, HelpCircle, Edit3, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userName, setUserName] = useState("Jose Maria");

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6 md:p-12 h-full overflow-y-auto pb-32 max-w-lg mx-auto w-full space-y-8"
    >
      {/* Profile Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-ocean/20 border-2 border-white flex items-center justify-center text-xl shadow-lg">
                🌊
            </div>
            <div>
               {isEditing ? (
                  <input 
                      type="text" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)} 
                      className="text-xl font-bold font-serif text-ink bg-white/50 border border-white rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-amber-400"
                  />
               ) : (
                  <h2 className="text-xl font-bold font-serif text-ink">{userName}</h2>
               )}
               <p className="text-sm text-foreground/60">jose.maria@example.com</p>
            </div>
        </div>
        <button 
           onClick={() => setIsEditing(!isEditing)}
           className="flex items-center gap-1 bg-white/40 px-3 py-1.5 rounded-full text-xs font-semibold text-ink shadow-sm hover:bg-white/60 transition-colors"
        >
            {isEditing ? <><Save className="w-3 h-3"/> Save</> : <><Edit3 className="w-3 h-3"/> Edit</>}
        </button>
      </div>

      {/* Account Settings */}
      <div>
          <h3 className="text-sm uppercase tracking-widest text-foreground font-semibold mb-3 ml-2">Account settings</h3>
          <div className="glass-card rounded-[2rem] divide-y divide-driftwood/20 overflow-hidden">
             
             <button className="w-full text-left p-4 flex items-center gap-4 hover:bg-white/40 transition-colors">
                <FileTextIcon /> <span className="text-ink font-medium">Account information</span>
             </button>
             
             <button className="w-full text-left p-4 flex items-center gap-4 hover:bg-white/40 transition-colors">
                <UserIcon /> <span className="text-ink font-medium">Personal Information</span>
             </button>

             <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-white/40 transition-colors"
             >
                <div className="flex items-center gap-4">
                    <Bell className="w-5 h-5 text-ink/70" /> 
                    <span className="text-ink font-medium">Notifications</span>
                </div>
                {/* Custom Toggle Switch */}
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${notificationsEnabled ? 'bg-amber-400' : 'bg-black/10'}`}>
                    <motion.div animate={{ x: notificationsEnabled ? 24 : 0 }} className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
             </button>

          </div>
      </div>

      {/* Security Settings */}
      <div>
          <h3 className="text-sm uppercase tracking-widest text-foreground font-semibold mb-3 ml-2">Security settings</h3>
          <div className="glass-card rounded-[2rem] divide-y divide-driftwood/20 overflow-hidden">
             
             <button className="w-full text-left p-4 flex items-center gap-4 hover:bg-white/40 transition-colors">
                <Lock className="w-5 h-5 text-ink/70" /> <span className="text-ink font-medium">Password & Security</span>
             </button>

             <button 
                onClick={() => setBiometricEnabled(!biometricEnabled)}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-white/40 transition-colors"
             >
                <div className="flex items-center gap-4">
                    <span className="text-xl">🛡️</span>
                    <span className="text-ink font-medium">Biometric Authentication</span>
                </div>
                {/* Custom Toggle Switch */}
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${biometricEnabled ? 'bg-amber-400' : 'bg-black/10'}`}>
                    <motion.div animate={{ x: biometricEnabled ? 24 : 0 }} className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
             </button>

          </div>
      </div>

      {/* Others */}
      <div>
          <h3 className="text-sm uppercase tracking-widest text-foreground font-semibold mb-3 ml-2">Others</h3>
          <div className="glass-card rounded-[2rem] overflow-hidden">
             <button className="w-full text-left p-4 flex items-center gap-4 hover:bg-white/40 transition-colors">
                <HelpCircle className="w-5 h-5 text-ink/70" /> <span className="text-ink font-medium">FAQs</span>
             </button>
          </div>
      </div>

    </motion.div>
  );
}

// Simple internal icon helpers
const FileTextIcon = () => <svg className="w-5 h-5 text-ink/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const UserIcon = () => <svg className="w-5 h-5 text-ink/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
