'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/journal');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
      >
        <h2 className="text-3xl font-serif text-accent mb-8 text-center uppercase tracking-widest">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-accent/60 text-xs uppercase tracking-widest mb-2 ml-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-accent/40 outline-none transition-all font-serif"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-accent/60 text-xs uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-accent/40 outline-none transition-all font-serif"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent text-background font-serif rounded-xl tracking-widest uppercase hover:bg-accent/90 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Entering...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-foreground/40 text-sm">
          New to the path? <Link href="/register" className="text-accent/60 hover:text-accent tracking-widest">Begin Journey</Link>
        </p>
      </motion.div>
    </div>
  );
}
