'use client';

import { useWishlistStore } from '@/store/useWishlistStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, Star, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ArchiveSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchiveSidebar({ isOpen, onClose }: ArchiveSidebarProps) {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-white shadow-luxury z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-10 border-b border-neutral-100 flex items-center justify-between">
              <div className="space-y-1">
                 <div className="flex items-center gap-3">
                    <Star className="text-accent-gold" size={14} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">The Archive</span>
                 </div>
                 <h2 className="text-2xl font-black uppercase tracking-tighter">Your Curation</h2>
              </div>
              <button onClick={onClose} className="w-12 h-12 rounded-full hover:bg-neutral-50 flex items-center justify-center transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto p-10 no-scrollbar space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                   <div className="w-20 h-20 rounded-full border border-primary flex items-center justify-center">
                      <Star size={32} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest leading-loose">Your private collection <br /> is currently empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    key={item.id}
                    className="flex gap-6 group relative"
                  >
                    <div className="w-24 h-24 bg-cream-light rounded-2xl overflow-hidden shrink-0 relative border border-neutral-100">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center space-y-1">
                      <h3 className="text-[11px] font-black uppercase tracking-wider">{item.name}</h3>
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{item.category}</p>
                      <div className="text-[12px] font-black text-primary pt-2">฿{item.price.toLocaleString()}</div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-10 bg-neutral-50 space-y-8">
                <div className="flex items-end justify-between">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Total Valuation</span>
                   <span className="text-3xl font-black tracking-tighter">฿{totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="space-y-4">
                  <button className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 group hover:bg-accent-gold transition-all shadow-luxury">
                    <span className="relative z-10">Inquire Collection</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={clearWishlist}
                    className="w-full text-center py-2 text-[9px] font-black uppercase tracking-widest text-neutral-300 hover:text-red-400 transition-colors"
                  >
                    Clear All Artifacts
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
