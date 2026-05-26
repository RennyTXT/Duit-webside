'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-12 h-8 rounded-full bg-neutral-50 animate-pulse" />;

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="relative flex items-center bg-neutral-50 border border-neutral-100 p-1 rounded-full w-14 h-8 transition-all hover:border-accent-gold/30 active:scale-95 group overflow-hidden"
      aria-label="Toggle Language"
    >
      <div className="flex justify-between w-full px-1 z-0">
        <span className="text-[8px] font-black text-neutral-300">TH</span>
        <span className="text-[8px] font-black text-neutral-300">EN</span>
      </div>
      
      <motion.div
        animate={{ 
          x: language === 'th' ? 0 : 24,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute left-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md z-10"
      >
        <span className="text-[9px] font-black text-white uppercase">
          {language}
        </span>
      </motion.div>

      {/* Decorative hover effect */}
      <div className="absolute inset-0 bg-accent-gold opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none" />
    </button>
  );
}
