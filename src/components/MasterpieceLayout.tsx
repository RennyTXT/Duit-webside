'use client';

import { motion } from 'framer-motion';
import { Sparkles, Maximize2, ShieldCheck, Heart, Info, Box, Star, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/data/products';

interface MasterpieceLayoutProps {
  product: Product;
  language: 'th' | 'en';
}

const MasterpieceLayout = ({ product, language }: MasterpieceLayoutProps) => {
  if (!product) return null;

  // Split description into paragraphs or sections if possible
  const descriptions = product.description.split('\n').filter(p => p.trim().length > 0);
  const mainDesc = descriptions[0] || '';
  const secondaryDesc = descriptions.slice(1).join(' ') || '';

  return (
    <div className="space-y-32 md:space-y-48 py-20 bg-white rounded-[64px] border border-neutral-100 shadow-sm overflow-hidden">
      
      {/* SECTION 1: THE IDENTITY (Description Paragraph 1) */}
      <section className="px-8 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="space-y-10 order-2 lg:order-1">
          <div className="space-y-4">
             <span className="text-xs uppercase tracking-[0.4em] text-accent-gold font-bold">The Essence</span>
             <h2 className="text-4xl md:text-6xl tracking-tighter text-primary uppercase leading-tight">
                {language === 'th' ? 'หัวใจแห่ง' : 'The Soul of'} <br /> 
                <span className="text-secondary italic">{product.name}.</span>
             </h2>
          </div>
          <p className="text-lg md:text-xl text-secondary leading-relaxed font-medium opacity-80">
            {mainDesc}
          </p>
          <div className="flex flex-wrap gap-8 border-t border-neutral-100 pt-10">
             {product.specs?.slice(0, 2).map((spec, i) => (
               <div key={i} className="space-y-2">
                  <span className="block text-[10px] uppercase tracking-widest text-neutral-400">{spec.label}</span>
                  <span className="text-lg text-primary uppercase tracking-tighter font-bold">{spec.value}</span>
               </div>
             ))}
          </div>
        </div>
        <div className="relative aspect-square rounded-[48px] overflow-hidden shadow-luxury order-1 lg:order-2">
           <Image src={product.image} alt={product.name} fill className="object-contain p-12 bg-neutral-50/50" />
        </div>
      </section>

      {/* SECTION 2: THE FEATURES (Dynamic Grid) */}
      <section className="bg-[#f9f8f6] py-32 px-8 md:px-24">
         <div className="max-w-[1440px] mx-auto text-center space-y-20">
            <div className="space-y-6">
               <Sparkles className="mx-auto text-accent-gold" size={32} strokeWidth={1} />
               <h2 className="text-3xl md:text-5xl uppercase tracking-tighter">
                  {language === 'th' ? 'นวัตกรรมและความประณีต' : 'Refined Innovation'}
               </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
               {product.features?.map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-10 bg-white rounded-[40px] border border-neutral-100 shadow-sm space-y-6 hover:shadow-luxury transition-all duration-700"
                  >
                     <div className="w-12 h-12 bg-cream-light rounded-2xl flex items-center justify-center mx-auto text-accent-gold">
                        <CheckCircle2 size={24} strokeWidth={1.5} />
                     </div>
                     <h4 className="text-sm uppercase tracking-widest font-bold text-primary leading-tight h-12 flex items-center justify-center">{feature}</h4>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* SECTION 3: THE CRAFTSMANSHIP (Remaining Description) */}
      {secondaryDesc && (
        <section className="px-8 md:px-24 max-w-5xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-4 px-8 py-3 bg-primary text-white rounded-full text-[10px] uppercase tracking-[0.4em]">
             <ShieldCheck size={14} /> Material Integrity
          </div>
          <p className="text-2xl md:text-4xl tracking-tighter text-primary leading-[1.4] font-light uppercase">
            {secondaryDesc}
          </p>
          <div className="w-24 h-px bg-neutral-200 mx-auto" />
        </section>
      )}

      {/* SECTION 4: TECHNICAL ARCHIVE */}
      <section className="px-8 md:px-24">
         <div className="max-w-[1440px] mx-auto bg-neutral-900 text-white rounded-[64px] p-12 md:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/3"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <h3 className="text-3xl md:text-5xl uppercase tracking-tighter">Technical <span className="italic text-accent-gold">Archive.</span></h3>
                  <div className="grid grid-cols-1 gap-6">
                    {product.specs?.map((spec, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-white/10 pb-6 group hover:border-accent-gold transition-colors">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">{spec.label}</span>
                        <span className="text-sm font-bold tracking-tight">{spec.value}</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="hidden lg:block">
                  <div className="aspect-[4/3] relative opacity-40 grayscale blur-[2px]">
                     <Image src={product.image} alt="Technical" fill className="object-contain" />
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default MasterpieceLayout;
