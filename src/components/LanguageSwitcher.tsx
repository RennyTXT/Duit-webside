'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 transition-all group active:scale-95 shadow-sm overflow-hidden min-w-[80px] justify-center"
      title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
    >
      <Globe size={14} className="text-accent-gold group-hover:rotate-12 transition-transform duration-500" />
      
      <div className="relative h-4 w-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={language}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] font-black uppercase tracking-widest text-inherit absolute"
          >
            {language === 'th' ? 'TH' : 'EN'}
          </motion.span>
        </AnimatePresence>
      </div>
    </button>
  );
};
