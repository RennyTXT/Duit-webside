'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'shop' | 'compact';
}

// Sub-component to handle Parallax safely after hydration
const ParallaxImage = ({ src, alt, containerRef }: { src: string, alt: string, containerRef: React.RefObject<HTMLDivElement | null> }) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div 
      style={{ y: imageY }} 
      className="absolute -inset-x-0 -inset-y-20 flex items-center justify-center"
    >
      <Image 
        src={src} 
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
      />
    </motion.div>
  );
};

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isCompact = variant === 'compact';
  const productImage = product.image && product.image !== "" ? product.image : "/placeholder-product.png";

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="group"
    >
      <Link href={`/products/${product.id}`} className="block h-full">
        <div className={`relative overflow-hidden bg-white border border-neutral-100 group-hover:border-primary/10 transition-all duration-700 shadow-luxury hover:shadow-luxury-hover
          ${isCompact ? 'rounded-[32px] p-5' : 'rounded-[48px] mb-10'}
        `}>
          <div className={`relative overflow-hidden bg-cream-light ${isCompact ? 'rounded-[24px] aspect-square' : 'rounded-[36px] aspect-[4/5] m-4'}`}>
            
            {isMounted ? (
              <ParallaxImage src={productImage} alt={product.name} containerRef={containerRef} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image src={productImage} alt={product.name} fill className="object-cover" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
              {product.isNew && (
                <div className="bg-primary text-white text-[8px] font-black px-4 py-1.5 rounded-full shadow-2xl uppercase tracking-[0.2em] border border-white/10">New</div>
              )}
              {product.isBest && (
                <div className="bg-white/90 backdrop-blur-md text-primary text-[8px] font-black px-4 py-1.5 rounded-full shadow-2xl uppercase tracking-[0.2em] border border-neutral-100">Essential</div>
              )}
              {product.modelUrl && (
                <div className="bg-accent-gold text-white text-[8px] font-black px-4 py-1.5 rounded-full shadow-2xl uppercase tracking-[0.2em] border border-white/10 flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                  3D View
                </div>
              )}
            </div>

            {/* Hover Overlay - Only for non-compact */}
            {!isCompact && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center backdrop-blur-[3px]">
                <div className="bg-white text-black px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transform translate-y-12 group-hover:translate-y-0 transition-all duration-700 shadow-2xl flex items-center gap-3">
                  Discover Details <ArrowUpRight size={14} />
                </div>
              </div>
            )}
          </div>

          {isCompact && (
            <div className="mt-8 space-y-3 px-2">
               <div className="flex justify-between items-start">
                  <h3 className="text-xs font-black text-primary group-hover:text-accent-gold transition-colors uppercase leading-tight line-clamp-1 tracking-wider">{product.name}</h3>
                  <span className="text-xs font-bold text-primary">฿{product.price.toLocaleString()}</span>
               </div>
               <p className="text-[10px] text-secondary font-medium line-clamp-1 opacity-60 italic tracking-wide">{product.tagline}</p>
            </div>
          )}
        </div>

        {!isCompact && (
          <div className="px-6 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-primary group-hover:text-accent-gold transition-colors truncate uppercase tracking-tight">{product.name}</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-primary bg-cream-light px-4 py-1.5 rounded-xl border border-neutral-100">฿{product.price.toLocaleString()}</span>
                <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                   <ChevronRight size={16} strokeWidth={3} />
                </div>
              </div>
            </div>
            <p className="text-sm text-secondary line-clamp-1 font-medium italic opacity-60 tracking-wide">{product.tagline}</p>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
