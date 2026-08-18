import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Heart,
  Cloud,
  Sparkles,
  Lightbulb,
  Coins,
  Flame,
  CheckCircle2,
  Activity
} from 'lucide-react';

export function FuturisticLock({ size = 'md', className = '', locked = true }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-stone-900 via-primary-950 to-stone-900 text-teal-400 border border-teal-500/30 shadow-lg cursor-pointer overflow-hidden ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.08, borderColor: 'rgba(20,184,166,0.8)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Background neon radial glow */}
      <motion.div
        className="absolute inset-0 bg-teal-500/20 blur-md rounded-full pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0.2, scale: hovered ? 1.2 : 0.8 }}
      />

      {/* Futuristic scanning laser line */}
      <motion.div
        className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent pointer-events-none"
        animate={hovered ? { top: ['0%', '100%', '0%'] } : { top: '50%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />

      {hovered && !locked ? (
        <Unlock className="w-5 h-5 text-teal-300 drop-shadow-[0_0_8px_rgba(20,184,166,0.8)] z-10" />
      ) : (
        <Lock className="w-5 h-5 text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.8)] z-10" />
      )}
    </motion.div>
  );
}

export function FuturisticShield({ size = 'md', className = '' }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 text-emerald-400 border border-emerald-500/30 shadow-lg cursor-pointer overflow-hidden ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.08 }}
    >
      <motion.div
        className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0.2 }}
      />
      <motion.div
        className="absolute inset-0 border-2 border-emerald-400/40 rounded-2xl"
        animate={hovered ? { scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] } : {}}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <ShieldCheck className="w-5 h-5 text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] z-10" />
    </motion.div>
  );
}

export function FuturisticHeart({ size = 'md', className = '' }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-primary-950 via-stone-900 to-rose-950 text-rose-400 border border-rose-500/30 shadow-lg cursor-pointer overflow-hidden ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        className="absolute inset-0 bg-rose-500/25 blur-md rounded-full pointer-events-none"
        animate={{ scale: hovered ? [1, 1.3, 1] : 1, opacity: hovered ? [0.4, 0.9, 0.4] : 0.2 }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      <Heart className={`w-5 h-5 fill-rose-500 text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)] z-10 ${hovered ? 'scale-110' : ''} transition-transform`} />
    </motion.div>
  );
}

export function FuturisticCloud({ size = 'md', className = '' }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-warm-950 via-stone-900 to-amber-950 text-warm-400 border border-warm-500/30 shadow-lg cursor-pointer overflow-hidden ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.08 }}
    >
      <motion.div
        className="absolute inset-0 bg-warm-500/20 blur-md rounded-full pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0.2 }}
      />
      <Cloud className="w-5 h-5 text-warm-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] z-10" />
    </motion.div>
  );
}

export function FuturisticLamp({ size = 'md', className = '' }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-amber-950 via-stone-900 to-yellow-950 text-amber-300 border border-amber-400/40 shadow-lg cursor-pointer overflow-hidden ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        className="absolute inset-0 bg-amber-400/30 blur-lg rounded-full pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0.3, scale: hovered ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.9, repeat: Infinity }}
      />
      <Lightbulb className="w-5 h-5 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] z-10" />
    </motion.div>
  );
}
