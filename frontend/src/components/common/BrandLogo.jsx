import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function BrandLogo({ size = 'md', interactive = true, link = true }) {
  const { t, i18n } = useTranslation(['common']);
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const [isHovered, setIsHovered] = useState(false);

  // English letters for cascading wave in strict LTR
  const englishLetters = [
    { char: 'A', delay: 0.1 },
    { char: 't', delay: 0.18 },
    { char: 'a', delay: 0.26 },
    { char: 'a', delay: 0.34 },
  ];

  const content = (
    <div
      className="relative inline-flex items-center gap-3 select-none group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow aura backdrop on hover */}
      <motion.div
        className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-primary-500/20 via-warm-500/20 to-teal-400/20 blur-lg opacity-0 transition-opacity duration-300 pointer-events-none"
        animate={{ opacity: isHovered ? 0.9 : 0 }}
      />

      {/* Animated Futuristic Icon Badge */}
      <motion.div
        className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-primary-700/30 overflow-hidden border border-primary-400/30 shrink-0"
        whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
        transition={{ duration: 0.3 }}
      >
        {/* Shimmer light sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
          animate={isHovered ? { translateX: ['100%', '-100%'] } : {}}
          transition={{ duration: 0.8, ease: 'easeInOut', repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
        />

        <Heart className={`w-6 h-6 fill-white transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />

        {/* Futuristic neon dot */}
        <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-warm-400 shadow-sm shadow-warm-400 animate-pulse" />
      </motion.div>

      {/* Brand Typography Lockup with Cascading Wave Ripple */}
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2">
          
          {/* Arabic Connected Word - Wavy bounce & Neon pulse (Always RTL) */}
          <motion.span
            dir="rtl"
            lang="ar"
            className="font-display text-2xl font-black text-stone-900 dark:text-stone-100 inline-block tracking-normal"
            animate={
              isHovered
                ? {
                    y: [0, -4, 0],
                    color: ['#0F766E', '#14B8A6', '#F59E0B', '#0F766E'],
                    textShadow: [
                      '0 0 0px rgba(20,184,166,0)',
                      '0 0 14px rgba(20,184,166,0.85), 0 0 24px rgba(245,158,11,0.5)',
                      '0 0 0px rgba(20,184,166,0)'
                    ]
                  }
                : { y: 0, textShadow: 'none' }
            }
            transition={{
              duration: 0.6,
              delay: 0,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 0.6
            }}
          >
            عطاء
          </motion.span>

          {/* Divider */}
          <span className="text-stone-300 dark:text-stone-700 font-light select-none text-base">|</span>

          {/* English Letters with Cascading Wave Animation (Strict LTR) */}
          <div dir="ltr" className="flex items-center font-sans text-lg font-bold text-primary-700 dark:text-primary-400">
            {englishLetters.map((l, index) => (
              <motion.span
                key={index}
                className="inline-block"
                animate={
                  isHovered
                    ? {
                        y: [0, -4, 0],
                        color: ['#0F766E', '#F59E0B', '#14B8A6', '#0F766E'],
                        textShadow: [
                          '0 0 0px rgba(245,158,11,0)',
                          '0 0 10px rgba(245,158,11,0.85), 0 0 18px rgba(20,184,166,0.5)',
                          '0 0 0px rgba(245,158,11,0)'
                        ]
                      }
                    : { y: 0, textShadow: 'none' }
                }
                transition={{
                  duration: 0.6,
                  delay: l.delay,
                  repeat: isHovered ? Infinity : 0,
                  repeatDelay: 0.6
                }}
              >
                {l.char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium tracking-wide -mt-0.5 flex items-center gap-1">
          <span>{isArabic ? 'المنصة المباشرة لتمكين الأسر' : 'Direct Family Empowerment'}</span>
          {isHovered && <Sparkles className="w-2.5 h-2.5 text-warm-500 animate-spin" />}
        </p>
      </div>
    </div>
  );

  if (!link) return content;

  return (
    <Link to="/" className="inline-flex items-center focus:outline-none shrink-0" aria-label="Ataa Home">
      {content}
    </Link>
  );
}
