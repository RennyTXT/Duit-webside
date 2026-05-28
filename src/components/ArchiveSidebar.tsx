'use client';

import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore, translations } from '@/store/useLanguageStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, Star, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ArchiveSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchiveSidebar({ isOpen, onClose }: ArchiveSidebarProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const totalPrice = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const getLocalizedCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      'eat-drink': t.shop.eatDrink,
      'furniture': t.shop.furniture,
      'play-rest': t.shop.playRest,
      'hygiene': t.shop.hygiene,
      'daily': t.shop.daily
    };
    return categoryMap[category] || category;
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
          />

          {/* Sidebar */}
          <motion.div 
            key="sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-white shadow-[-20px_0_80px_rgba(0,0,0,0.1)] z-[101] flex flex-col border-l border-neutral-100"
          >
            {/* Header */}
            <div className="p-8 md:p-10 border-b border-neutral-100 flex items-center justify-between bg-white relative z-10">
              <div className="space-y-1">
                 <div className="flex items-center gap-3">
                    <Star className="text-accent-gold" size={14} fill="currentColor" />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-accent-gold">The Archive</span>
                 </div>
                 <h2 className="text-2xl uppercase tracking-tighter text-primary">
                   {language === 'th' ? 'คอลเลกชันส่วนตัว' : 'Your Curation'}
                 </h2>
              </div>
              <button 
                onClick={onClose} 
                className="w-12 h-12 rounded-full hover:bg-neutral-50 flex items-center justify-center transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto p-6 md:p-10 no-scrollbar space-y-8 bg-[#FBFBFB]">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                   <div className="w-24 h-24 rounded-full border-2 border-dashed border-neutral-200 flex items-center justify-center">
                      <Star size={32} className="text-neutral-300" />
                   </div>
                   <p className="text-[11px] uppercase tracking-widest leading-loose text-neutral-400">
                     {language === 'th' ? 'ยังไม่มีรายการที่เลือกไว้' : 'Your private collection \n is empty'}
                   </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-5 group relative p-4 rounded-[32px] bg-white border border-neutral-100 hover:border-accent-gold/30 hover:shadow-luxury-sm transition-all"
                    >
                      <Link href={`/products/${item.id}`} onClick={onClose} className="w-20 h-20 bg-neutral-50 rounded-2xl overflow-hidden shrink-0 relative p-2 border border-neutral-50">
                        <Image 
                          src={item.image || (item as any).image_url || "/placeholder-product.png"} 
                          alt={item.name} 
                          fill 
                          className="object-contain" 
                        />
                      </Link>

                      <div className="flex-grow flex flex-col justify-center space-y-1 min-w-0">
                        <Link href={`/products/${item.id}`} onClick={onClose} className="group/title">
                          <h3 className="text-[11px] uppercase tracking-wider truncate group-hover/title:text-accent-gold transition-colors">{item.name}</h3>
                        </Link>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-widest">
                          {getLocalizedCategory(item.category)}
                        </p>
                        <div className="text-[13px] text-primary pt-1">
                          ฿{(Number(item.price) || 0).toLocaleString()}
                        </div>
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2.5 rounded-full text-neutral-200 hover:text-red-500 hover:bg-red-50 transition-all self-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 md:p-10 bg-white border-t border-neutral-100 space-y-8 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <div className="flex items-end justify-between">
                   <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                     {language === 'th' ? 'มูลค่ารวมโดยประมาณ' : 'Total Valuation'}
                   </span>
                   <span className="text-3xl tracking-tighter text-primary">฿{totalPrice.toLocaleString()}</span>
                </div>

                <div className="space-y-4">
                  <button className="w-full h-18 bg-primary text-white rounded-[24px] uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 group hover:bg-accent-gold transition-all shadow-luxury active:scale-[0.98]">
                    <span>{language === 'th' ? 'สอบถามข้อมูลทั้งหมด' : 'Inquire Collection'}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={clearWishlist}
                    className="w-full text-center py-2 text-[9px] uppercase tracking-widest text-neutral-300 hover:text-red-500 transition-colors"
                  >
                    {language === 'th' ? 'ล้างคอลเลกชันทั้งหมด' : 'Dissolve All Artifacts'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
