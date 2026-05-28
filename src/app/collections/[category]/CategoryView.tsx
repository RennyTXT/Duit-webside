'use client';

import { Product, products as staticProducts } from '@/data/products';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguageStore, translations } from '@/store/useLanguageStore';

export default function CategoryView({ category }: { category: string }) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const catKey = category;
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const categoryNames: Record<string, string> = {
    'eat-drink': t.shop.eatDrink,
    'furniture': t.shop.furniture,
    'play-rest': t.shop.playRest,
    'hygiene': t.shop.hygiene,
    'daily': t.shop.daily,
    'bath': language === 'th' ? 'อาบน้ำ' : 'Bath',
    'travel': language === 'th' ? 'การเดินทาง' : 'Travel'
  };
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('category', catKey)
          .order('created_at', { ascending: false });
        
        if (data && data.length > 0) {
          setProducts(data.map(p => ({ ...p, image: p.image_url })));
        } else {
          const filtered = staticProducts.filter(p => p.category === catKey);
          setProducts(filtered);
        }
      } catch (err) {
        const filtered = staticProducts.filter(p => p.category === catKey);
        setProducts(filtered);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [catKey, supabase]);

  const title = categoryNames[catKey] || catKey.replace('-', ' ');

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-300">Synchronizing Collection...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-20">
      <section className="relative py-24 md:py-32 overflow-hidden bg-cream-light border-b border-neutral-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.05),transparent_50%)]"></div>
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10 text-center">
          <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.4em] text-neutral-300 mb-10">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <div className="w-1 h-[1px] bg-neutral-200"></div>
            <Link href="/shop" className="hover:text-primary transition-colors uppercase">Atelier</Link>
            <div className="w-1 h-[1px] bg-neutral-200/50"></div>
            <span className="text-primary">{title}</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-8xl md:text-[110px] leading-[0.85] tracking-[-0.04em] uppercase text-primary">
              {title}
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-accent-gold/40"></div>
              <p className="text-[11px] tracking-[0.3em] text-accent-gold uppercase">
                {products.length} Masterpieces
              </p>
              <div className="h-[1px] w-12 bg-accent-gold/40"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-40">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 space-y-12">
               <div className="w-24 h-24 bg-cream-light rounded-full flex items-center justify-center mx-auto border border-neutral-100">
                  <div className="w-12 h-12 border-t border-neutral-200 rounded-full animate-pulse"></div>
               </div>
               <div className="space-y-4">
                  <h2 className="text-xs tracking-[0.3em] uppercase text-neutral-300">หมวดหมู่ว่างเปล่า</h2>
                  <p className="text-primary text-lg">Coming Soon to the Collection</p>
               </div>
               <Link href="/shop" className="inline-block border-b-2 border-primary pb-2 text-[10px] tracking-ultra uppercase hover:text-accent-gold hover:border-accent-gold transition-colors">
                  Return to Atelier
               </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
