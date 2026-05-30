'use client';

import { Product, products as staticProducts } from '@/data/products';
import Link from 'next/link';
import { ChevronRight, Filter, SlidersHorizontal, Grid3X3, LayoutList, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase/client';
import { useLanguageStore, translations } from '@/store/useLanguageStore';

export default function ShopPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categoryList = [
    { id: 'all', name: t.shop.allProducts, color: 'neutral' },
    { id: 'eat-drink', name: t.shop.eatDrink, color: 'neutral' },
    { id: 'furniture', name: t.shop.furniture, color: 'neutral' },
    { id: 'play-rest', name: t.shop.playRest, color: 'neutral' },
    { id: 'hygiene', name: t.shop.hygiene, color: 'neutral' },
    { id: 'daily', name: t.shop.daily, color: 'neutral' }
  ];

  useEffect(() => {
    // Reset to page 1 when category changes
    setCurrentPage(1);
  }, [activeCategory]);

  useEffect(() => {
    const supabase = createClient();
    const fetchProducts = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data && data.length > 0) {
          setProducts(data.map(p => ({ 
            ...p, 
            image: p.image_url,
            isBest: p.is_best,
            isNew: p.is_new,
            recommendedFor: p.recommended_for
          })));
        } else {
          setProducts(staticProducts);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts(staticProducts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const categories = categoryList.map(cat => ({
    ...cat,
    count: cat.id === 'all' ? products.length : products.filter(p => p.category === cat.id).length
  }));

  const currentCategoryName = categoryList.find(c => c.id === activeCategory)?.name || (language === 'th' ? 'ทั้งหมด' : 'All');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Breadcrumbs & Title */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-cream-light border-b border-neutral-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.05),transparent_50%)]"></div>
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.4em] text-accent-gold/60 mb-10">
            <Link href="/" className="hover:text-primary transition-colors">{language === 'th' ? 'หน้าหลัก' : 'Home'}</Link>
            <div className="w-1 h-[1px] bg-accent-gold/30"></div>
            <span className="text-primary">{language === 'th' ? 'ดี ยู ไอ ที ที เอช' : 'DUIT TH'}</span>
            {activeCategory !== 'all' && (
              <>
                <div className="w-1 h-[1px] bg-accent-gold/30"></div>
                <span className="text-primary">{currentCategoryName}</span>
              </>
            )}
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-[100px] tracking-[-0.04em] text-primary uppercase leading-none"
          >
            {activeCategory === 'all' ? (language === 'th' ? 'คอลเลกชัน' : 'The Collection') : currentCategoryName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-secondary font-medium tracking-wide uppercase text-[11px] opacity-60"
          >
            {language === 'th' ? 'ชิ้นงานที่คัดสรรมาเพื่อไลฟ์สไตล์สัตว์เลี้ยงที่เหนือระดับ' : 'Curated pieces for the refined pet lifestyle'}
          </motion.p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-16">
            <div className="sticky top-32">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-primary pb-4 border-b border-neutral-100 flex items-center justify-between">
                    {language === 'th' ? 'หมวดหมู่' : 'Categories'} <span className="text-[8px] font-medium text-neutral-300">({products.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {categories.map((cat) => {
                      const isActive = activeCategory === cat.id;
                      
                      return (
                        <button 
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all text-[13px] tracking-tight ${isActive ? 'bg-primary text-white shadow-luxury translate-x-2' : 'text-secondary hover:bg-cream-light hover:text-primary'}`}
                        >
                          <span className="uppercase">{cat.name}</span>
                          <span className={`text-[9px] w-5 h-5 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-white/10 text-white/50' : 'bg-neutral-50 text-neutral-300'}`}>{cat.count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-10 bg-primary text-white rounded-[48px] relative overflow-hidden group shadow-luxury">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/20 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-accent-gold/30 transition-all duration-1000"></div>
                  <div className="relative z-10 space-y-6">
                    <span className="text-accent-gold text-[8px] uppercase tracking-[0.3em]">Signature</span>
                    <h4 className="text-xl uppercase leading-tight tracking-tight">Duit Care+ <br />Elite Membership</h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed font-medium">
                      {language === 'th' ? 'เข้าร่วมวงล้อมพิเศษของเราเพื่อรับคำแนะนำเฉพาะตัวและการเข้าถึงรุ่นจำกัดก่อนใคร' : 'Join our exclusive circle for bespoke recommendations and early access to limited releases.'}
                    </p>
                    <Link href="/about" className="inline-block text-[10px] uppercase tracking-[0.2em] border-b border-accent-gold pb-1 hover:text-accent-gold transition-colors">
                      {language === 'th' ? 'เรียนรู้เพิ่มเติม' : 'Learn More'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Container */}
          <div className="lg:col-span-9">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center mb-16 pb-8 border-b border-neutral-100 gap-8">
               <div className="space-y-1">
                 <p className={`text-[11px] uppercase tracking-widest text-neutral-300 ${language === 'th' ? '' : ''}`}>{language === 'th' ? 'แคตตาล็อก' : 'Catalog'}</p>
                 <p className="text-sm text-primary">
                   {language === 'th' ? 'แสดง' : 'Showing'} <span className="text-accent-gold">{filteredProducts.length}</span> {language === 'th' ? 'ผลงานชิ้นเอก' : 'Masterpieces'}
                 </p>
               </div>
               <div className="flex items-center gap-10">
                  <div className="flex items-center gap-6">
                    <span className={`text-[10px] uppercase tracking-[0.2em] text-neutral-400 ${language === 'th' ? '' : ''}`}>{language === 'th' ? 'เรียงตาม' : 'Sort By'}</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`bg-transparent border-none text-[12px] uppercase tracking-widest outline-none cursor-pointer hover:text-accent-gold transition-colors ${language === 'th' ? '' : ''}`}
                    >
                      <option value="newest">{language === 'th' ? 'มาใหม่ล่าสุด' : 'Latest Arrivals'}</option>
                      <option value="price-low">{language === 'th' ? 'ราคา: ต่ำ - สูง' : 'Price: Low - High'}</option>
                      <option value="price-high">{language === 'th' ? 'ราคา: สูง - ต่ำ' : 'Price: High - Low'}</option>
                      <option value="popular">{language === 'th' ? 'ยอดนิยม' : 'Most Coveted'}</option>
                    </select>
                  </div>
               </div>
            </div>

            {/* Grid */}
            {isLoading ? (
               <div className="py-40 flex flex-col items-center justify-center gap-6 text-neutral-200">
                  <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
                  <p className="text-[10px] uppercase tracking-[0.4em]">{t.shop.curating}</p>
               </div>
            ) : (
              <>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-20 gap-x-12"
                >
                  <AnimatePresence mode="popLayout">
                    {paginatedProducts.map((product: Product) => (
                      <motion.div
                        layout
                        key={product.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-32 pt-12 border-t border-neutral-50 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                      {language === 'th' ? 'หน้า' : 'Page'} <span className="text-primary">{currentPage}</span> {language === 'th' ? 'จาก' : 'of'} <span className="text-primary">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-6 py-3 text-[10px] uppercase tracking-[0.2em] border border-neutral-100 rounded-sm hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        {language === 'th' ? 'ก่อนหน้า' : 'Previous'}
                      </button>
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 text-[10px] rounded-sm transition-all ${currentPage === page ? 'bg-primary text-white' : 'hover:bg-neutral-50 text-secondary'}`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-6 py-3 text-[10px] uppercase tracking-[0.2em] border border-neutral-100 rounded-sm hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        {language === 'th' ? 'ถัดไป' : 'Next'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
