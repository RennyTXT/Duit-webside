'use client';

import Link from 'next/link';
import { usePetStore } from '@/store/usePetStore';
import { Product, products as staticProducts, getRecommendedProducts } from '@/data/products';
import { ArrowRight, Utensils, Gamepad2, Armchair, Droplets, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useMemo, useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase/client';
import { useLanguageStore, translations } from '@/store/useLanguageStore';

const Home = () => {
  const { profile } = usePetStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const supabase = createClient();

  const heroSlides = [
    {
      image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=1440",
      title: "Edition 01",
      subtitle: "The evolution of Duit design language.",
      tag: "New Collection"
    },
    {
      image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/02c3dd1725fb7.jpg?w=1440",
      title: "The Essential",
      subtitle: "Curated for the modern companion.",
      tag: "Best Seller"
    },
    {
      image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/189a556efbbf8.jpg?w=1440",
      title: "Living Series",
      subtitle: "Seamlessly blending into your home.",
      tag: "Heritage"
    },
    {
      image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/8040a424e8150.jpg?w=1440",
      title: "Dining Culture",
      subtitle: "Elevating the daily ritual of eating.",
      tag: "Eat & Drink"
    },
    {
      image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/7161e1b854371.jpg?w=1440",
      title: "Pure Form",
      subtitle: "Furniture designed with architectural precision.",
      tag: "Atelier"
    },
    {
      image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/f41249b674844.jpg?w=1440",
      title: "Quiet Hygiene",
      subtitle: "Clean solutions for a harmonious life.",
      tag: "Hygiene"
    },
    {
      image: "https://duit.kr/web/product/big/window_hammock.jpg",
      title: "Window Hammock",
      subtitle: "A wider world, wider enjoyment.",
      tag: "Relax"
    },
    {
      image: "https://duit.kr/web/product/big/the_table_plus.jpg",
      title: "The Table Plus",
      subtitle: "Customized automatic feeding in your hand.",
      tag: "Technology"
    }
  ];

  const categories = [
    { name: t.shop.eatDrink, Icon: Utensils, href: '/collections/eat-drink', image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/8040a424e8150.jpg?w=1440" },
    { name: t.shop.playRest, Icon: Gamepad2, href: '/collections/play-rest', image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/02c3dd1725fb7.jpg?w=1440" },
    { name: t.shop.furniture, Icon: Armchair, href: '/collections/furniture', image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/7161e1b854371.jpg?w=1440" },
    { name: t.shop.hygiene, Icon: Droplets, href: '/collections/hygiene', image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/f41249b674844.jpg?w=1440" },
    { name: t.shop.daily, Icon: Sparkles, href: '/collections/daily', image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=1440" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          setProducts(data.map(p => ({ ...p, image: p.image_url, isBest: p.is_best, isNew: p.is_new, recommendedFor: p.recommended_for })));
        } else {
          setProducts(staticProducts);
        }
      } catch (err) {
        setProducts(staticProducts);
      }
    };
    fetchProducts();
  }, [supabase]);

  const bestSellers = useMemo(() => {
    const filtered = products.filter(p => p.isBest);
    return filtered.length > 0 ? filtered.slice(0, 4) : products.slice(0, 4);
  }, [products]);

  return (
    <div className="flex flex-col bg-white">
      
      {/* 1. HERO - CLEAN & BALANCED */}
      <section className="relative h-[70vh] w-full overflow-hidden bg-white pt-20 px-6 md:px-12 lg:px-20">
        <div className="relative w-full h-full overflow-hidden rounded-sm bg-neutral-50">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 1.5 }} 
              className="absolute inset-0"
            >
              <Image 
                src={heroSlides[currentSlide].image} 
                alt={heroSlides[currentSlide].title} 
                fill 
                className="object-cover" 
                priority 
              />
              <div className="absolute inset-0 bg-white/5" />
              
              <div className="absolute inset-0 flex items-center justify-start px-12 md:px-20">
                <div className="max-w-3xl space-y-6">
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] uppercase tracking-[0.4em] text-primary/60"
                    >
                        {heroSlides[currentSlide].tag}
                    </motion.span>
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[1] text-primary uppercase"
                    >
                        {heroSlides[currentSlide].title.replace('.', '')}
                    </motion.h1>
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 0.5 }} 
                      className="pt-6"
                    >
                      <Link href="/shop" className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-primary border-b border-primary/20 pb-2 hover:border-primary transition-colors">
                        Explore Shop <ArrowRight size={14} />
                      </Link>
                    </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
           {heroSlides.map((_, i) => (
             <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${currentSlide === i ? 'bg-primary w-10' : 'bg-neutral-300 hover:bg-neutral-400 shadow-sm'}`}
             />
           ))}
        </div>
      </section>

      {/* 2. CATEGORIES - CLEAN GRID */}
      <section className="py-32 md:py-48 px-6 md:px-20 lg:px-32 bg-white">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
           <div className="lg:col-span-4 space-y-12">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-secondary">Collections</span>
                <h2 className="text-4xl md:text-5xl tracking-tighter text-primary uppercase leading-[1.1]">Explore our <br /> <span className="text-secondary italic">Categories.</span></h2>
              </div>
              
              <div className="flex flex-col gap-1">
                {categories.map((cat, i) => (
                  <button 
                    key={cat.name}
                    onMouseEnter={() => setActiveCategoryIndex(i)}
                    className={`group flex items-center justify-between py-6 border-b border-neutral-50 transition-all ${activeCategoryIndex === i ? 'px-4 bg-neutral-50' : ''}`}
                  >
                    <span className={`text-[10px] tracking-widest ${activeCategoryIndex === i ? 'text-primary' : 'text-neutral-300'}`}>0{i+1}</span>
                    <h3 className={`text-base uppercase tracking-tight transition-colors ${activeCategoryIndex === i ? 'text-primary' : 'text-neutral-400'}`}>{cat.name}</h3>
                    <ArrowRight size={14} className={`transition-transform ${activeCategoryIndex === i ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                  </button>
                ))}
              </div>
           </div>

           <div className="lg:col-span-8">
              <div className="relative aspect-[16/10] bg-neutral-50 overflow-hidden">
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategoryIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0"
                    >
                       <Image 
                        src={categories[activeCategoryIndex].image} 
                        alt={categories[activeCategoryIndex].name} 
                        fill 
                        className="object-cover" 
                       />
                    </motion.div>
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </section>

      {/* 3. BEST SELLERS - FLUSH GRID */}
      <section className="bg-neutral-50 py-32 md:py-48 px-6 md:px-20 lg:px-32">
        <div className="max-w-[1440px] mx-auto space-y-20">
           <div className="flex justify-between items-end border-b border-neutral-200 pb-8">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.4em] text-secondary">Selection</span>
                <h2 className="text-4xl md:text-5xl tracking-tighter text-primary uppercase leading-[1]">Best <span className="text-secondary italic">Sellers.</span></h2>
              </div>
              <Link href="/shop" className="text-[10px] uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors">
                View All
              </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
           </div>
        </div>
      </section>

      {/* 4. PHILOSOPHY - TYPOGRAPHY FOCUS */}
      <section className="py-48 px-6 md:px-20 lg:px-32 text-center bg-white">
         <div className="max-w-4xl mx-auto space-y-12">
            <span className="text-[10px] uppercase tracking-[0.6em] text-neutral-300">Our Ethos</span>
            <p className="text-3xl md:text-5xl tracking-tighter text-primary leading-[1.2] uppercase">
              "Simple solutions for a <span className="text-secondary italic">complex world</span>. We design for the quiet moments between you and your companion."
            </p>
            <div className="w-12 h-px bg-neutral-200 mx-auto" />
         </div>
      </section>

      {/* 5. CTA - MINIMAL & BOLD */}
      <section className="py-32 px-6 md:px-20 lg:px-32 bg-white">
         <div className="max-w-[1440px] mx-auto border border-neutral-100 p-12 md:p-24 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-4 text-center md:text-left">
               <span className="text-[10px] uppercase tracking-[0.4em] text-secondary">Duit Care+</span>
               <h2 className="text-4xl md:text-6xl tracking-tighter text-primary uppercase leading-none">Join the <br /> <span className="text-secondary italic">Circle.</span></h2>
            </div>
            <Link href="/pet-profile" className="inline-flex items-center gap-6 px-12 py-6 bg-primary text-white text-[10px] uppercase tracking-[0.3em] hover:bg-neutral-800 transition-colors">
               Become a Member <ArrowRight size={16} />
            </Link>
         </div>
      </section>
    </div>
  );
};

export default Home;
