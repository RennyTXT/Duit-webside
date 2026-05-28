'use client';

import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-white z-[70] shadow-luxury flex flex-col"
          >
            {/* Header */}
            <div className="p-8 md:p-10 flex justify-between items-center border-b border-neutral-50 bg-cream-light/30">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent-gold">Your Selection</span>
                <h2 className="text-2xl uppercase tracking-tight">Shopping Bag</h2>
              </div>
              <button 
                onClick={() => toggleCart(false)}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-neutral-50 transition-colors shadow-sm border border-neutral-100"
              >
                <X size={20} strokeWidth={1} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-8 md:p-10 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-40">
                  <div className="w-24 h-24 bg-cream-light rounded-[40px] flex items-center justify-center">
                    <ShoppingBag size={48} strokeWidth={0.5} />
                  </div>
                  <p className="text-xs uppercase tracking-ultra">Your bag is currently empty</p>
                  <Link 
                     href="/shop" 
                     onClick={() => toggleCart(false)}
                     className="text-[10px] border-b border-primary pb-1 uppercase tracking-widest hover:text-accent-gold hover:border-accent-gold transition-colors"
                   >
                     Continue Exploring
                   </Link>
                </div>
              ) : (
                <div className="space-y-10">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-8 group">
                      <div className="w-24 aspect-[4/5] bg-cream-light rounded-3xl overflow-hidden relative border border-neutral-100 flex-shrink-0 group-hover:shadow-lg transition-all duration-500">
                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-grow py-2 flex flex-col justify-between">
                        <div className="space-y-1">
                           <div className="flex justify-between items-start">
                              <h3 className="text-sm uppercase tracking-tight text-primary group-hover:text-accent-gold transition-colors">{item.name}</h3>
                              <button onClick={() => removeItem(item.id)} className="text-neutral-200 hover:text-red-500 transition-colors">
                                 <X size={16} />
                              </button>
                           </div>
                           <p className="text-[10px] text-neutral-400 uppercase tracking-wider">{item.category}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-6 p-1 bg-neutral-50 rounded-full border border-neutral-100">
                             <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center transition-all active:scale-90 shadow-sm"><Minus size={12} /></button>
                             <span className="text-xs">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center transition-all active:scale-90 shadow-sm"><Plus size={12} /></button>
                          </div>
                          <p className="text-sm tracking-tight text-primary">฿{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 md:p-10 bg-cream-light border-t border-neutral-100 space-y-8">
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs uppercase tracking-widest text-neutral-400">
                      <span>Subtotal</span>
                      <span>฿{totalPrice().toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs uppercase tracking-widest text-neutral-400">
                      <span>Logistics</span>
                      <span className="text-accent-gold">Complimentary</span>
                   </div>
                   <div className="pt-4 border-t border-neutral-200 flex justify-between items-center">
                      <span className="text-xs uppercase tracking-[0.2em]">Total Estimate</span>
                      <span className="text-2xl text-primary tracking-tighter">฿{totalPrice().toLocaleString()}</span>
                   </div>
                </div>
                
                <div className="space-y-4">
                  <button className="group relative w-full bg-primary text-white h-20 rounded-full overflow-hidden transition-all active:scale-95 duration-500 shadow-luxury">
                    <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <span className="relative z-10 text-xs uppercase tracking-[0.3em]">Complete Acquisition</span>
                  </button>
                  <button 
                    onClick={() => toggleCart(false)}
                    className="w-full text-[10px] uppercase tracking-[0.3em] text-neutral-300 hover:text-primary transition-colors text-center"
                  >
                    Continue Curation
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
