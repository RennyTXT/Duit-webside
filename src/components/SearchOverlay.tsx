'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, products as staticProducts } from '@/data/products';
import { createClient } from '@/lib/supabase/client';
import { useLanguageStore, translations } from '@/store/useLanguageStore';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const fetchAllProducts = async () => {
      try {
        const { data } = await supabase.from('products').select('*');
        if (data && data.length > 0) {
          setAllProducts(data.map(p => ({ ...p, image: p.image_url })));
        } else {
          setAllProducts(staticProducts);
        }
      } catch (err) {
        setAllProducts(staticProducts);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchQuery, allProducts]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 md:px-12 lg:px-20 h-24 border-b border-neutral-50">
            <div className="flex-1 flex items-center gap-4">
              <Search size={20} className="text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'th' ? 'ค้นหาสินค้าที่ต้องการ...' : 'Search for products...'}
                className="w-full bg-transparent border-none outline-none text-xl lg:text-2xl lowercase tracking-tight placeholder:text-neutral-200"
              />
            </div>
            <button 
              onClick={onClose}
              className="p-3 rounded-full hover:bg-neutral-50 transition-colors"
            >
              <X size={24} strokeWidth={1} />
            </button>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-20 py-12 md:py-20">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
              
              {/* Quick Links / Suggestions */}
              <div className="lg:col-span-4 space-y-12">
                <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] text-neutral-300">{language === 'th' ? 'หมวดหมู่ยอดนิยม' : 'Popular Categories'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {['eat-drink', 'furniture', 'play-rest', 'hygiene'].map((cat) => (
                      <Link
                        key={cat}
                        href={`/collections/${cat}`}
                        onClick={onClose}
                        className="px-6 py-3 border border-neutral-100 rounded-full text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                      >
                        {cat.replace('-', ' & ')}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] text-neutral-300">{language === 'th' ? 'ความช่วยเหลือ' : 'Support'}</h3>
                  <ul className="space-y-4 text-xs uppercase tracking-widest text-secondary">
                    <li><Link href="/faq" onClick={onClose} className="hover:text-primary">FAQ</Link></li>
                    <li><Link href="/shipping" onClick={onClose} className="hover:text-primary">Shipping Info</Link></li>
                    <li><Link href="/contact" onClick={onClose} className="hover:text-primary">Contact Us</Link></li>
                  </ul>
                </div>
              </div>

              {/* Search Results */}
              <div className="lg:col-span-8 space-y-10">
                <div className="flex justify-between items-end border-b border-neutral-100 pb-4">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] text-neutral-300">
                    {searchQuery ? (language === 'th' ? `ผลลัพธ์ (${results.length})` : `Results (${results.length})`) : (language === 'th' ? 'สินค้าแนะนำ' : 'Featured Products')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {(searchQuery.length > 1 ? results : allProducts.filter(p => p.isBest).slice(0, 4)).map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/products/${product.id}`}
                      onClick={onClose}
                      className="group flex gap-6 p-4 hover:bg-neutral-50 rounded-sm transition-all"
                    >
                      <div className="relative w-24 h-24 shrink-0 bg-neutral-50 overflow-hidden">
                        <Image 
                          src={product.image || '/placeholder-product.png'} 
                          alt={product.name} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                      </div>
                      <div className="flex flex-col justify-center gap-1">
                        <span className="text-[9px] uppercase tracking-widest text-neutral-300">{product.category}</span>
                        <h4 className="text-sm uppercase tracking-tight text-primary group-hover:text-accent-gold transition-colors">{product.name}</h4>
                        <p className="text-[11px] text-secondary">฿{product.price.toLocaleString()}</p>
                      </div>
                      <div className="ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight size={16} className="text-neutral-300" />
                      </div>
                    </Link>
                  ))}
                </div>

                {searchQuery && results.length === 0 && (
                  <div className="py-20 text-center space-y-4">
                    <p className="text-lg text-neutral-300">{language === 'th' ? 'ไม่พบสินค้าที่ตรงกับการค้นหา' : 'No products found for this search.'}</p>
                  </div>
                )}
                
                {searchQuery && results.length > 0 && (
                  <Link 
                    href="/shop" 
                    onClick={onClose}
                    className="inline-block text-[10px] uppercase tracking-[0.4em] text-primary border-b border-primary/20 pb-2 hover:border-primary transition-colors"
                  >
                    View All Products
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
