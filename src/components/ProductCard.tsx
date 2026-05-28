'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'shop' | 'compact';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const productImage = product.image && product.image !== "" ? product.image : "/placeholder-product.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/products/${product.id}`} className="block space-y-4">
        <div className="relative aspect-square overflow-hidden bg-neutral-50 rounded-sm">
          <Image 
            src={productImage} 
            alt={product.name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          
          {/* Subtle Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-white/90 backdrop-blur-sm text-[8px] px-2 py-1 uppercase tracking-widest text-primary border border-neutral-100">New</span>
            )}
            {product.isBest && (
              <span className="bg-white/90 backdrop-blur-sm text-[8px] px-2 py-1 uppercase tracking-widest text-secondary border border-neutral-100">Essential</span>
            )}
          </div>
        </div>

        <div className="space-y-1 px-1">
          <h3 className="text-sm uppercase tracking-[0.1em] text-primary group-hover:opacity-60 transition-opacity">
            {product.name}
          </h3>
          <div className="flex justify-between items-baseline">
            <p className="text-[13px] text-secondary">
              ฿{product.price.toLocaleString()}
            </p>
            {product.category && (
              <span className="text-[10px] uppercase tracking-widest text-neutral-300">
                {product.category}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
