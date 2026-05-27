'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { motion } from 'framer-motion';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex bg-neutral-100/50 backdrop-blur-md p-1 rounded-full border border-white/20 relative">
      <motion.div
        layoutId="active-lang"
        className="absolute inset-1 bg-white rounded-full shadow-sm"
        initial={false}
        animate={{
          x: language === 'th' ? 0 : '100%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ width: 'calc(50% - 4px)' }}
      />
      
      <button
        onClick={() => setLanguage('th')}
        className={`relative z-10 px-4 py-1.5 text-[10px] font-black uppercase transition-colors duration-500 ${
          language === 'th' ? 'text-primary' : 'text-neutral-400'
        }`}
      >
        TH
      </button>
      
      <button
        onClick={() => setLanguage('en')}
        className={`relative z-10 px-4 py-1.5 text-[10px] font-black uppercase transition-colors duration-500 ${
          language === 'en' ? 'text-primary' : 'text-neutral-400'
        }`}
      >
        EN
      </button>
    </div>
  );
};
