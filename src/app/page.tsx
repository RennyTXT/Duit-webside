'use client';

import Link from 'next/link';
import { usePetStore } from '@/store/usePetStore';
import { Product, products as staticProducts, getRecommendedProducts } from '@/data/products';
import { ArrowRight, ShoppingCart, Star, ShieldCheck, Truck, Utensils, Gamepad2, Armchair, Droplets, Sparkles, Heart, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
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
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const supabase = createClient();

  const heroSlides = [
    {
      image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=1440",
      title: t.hero.slide1Title,
      subtitle: t.hero.slide1Sub,
      tag: t.hero.newCollection
    },
    {
      image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/02c3dd1725fb7.jpg?w=1440",
      title: t.hero.slide2Title,
      subtitle: t.hero.slide2Sub,
      tag: t.hero.bestSeller
    },
    {
      image: "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/189a556efbbf8.jpg?w=1440",
      title: t.hero.slide3Title,
      subtitle: t.hero.slide3Sub,
      tag: t.hero.livingSeries
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [supabase]);

  const bestSellers = useMemo(() => {
    const filtered = products.filter(p => p.isBest);
    return filtered.length > 0 ? filtered.slice(0, 4) : products.slice(0, 4);
  }, [products]);

  const personalized = useMemo(() => getRecommendedProducts(profile, products), [profile, products]);

  return (
    <div className="flex flex-col bg-white">
      
      {/* 1. CLEAN FRAMED HERO */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-white pt-24 px-6 md:px-10">
        <div className="relative w-full h-full rounded-[40px] md:rounded-[60px] overflow-hidden shadow-luxury-sm bg-black">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide} 
              initial={{ scale: 1.05, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} 
              className="absolute inset-0"
            >
              {heroSlides[currentSlide].image && (
                <Image 
                  src={heroSlides[currentSlide].image} 
                  alt={heroSlides[currentSlide].title} 
                  fill 
                  className="object-cover brightness-[0.6] contrast-[1.05]" 
                  priority 
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                <div className="max-w-5xl space-y-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center gap-4"
                    >
                      <span className="text-[9px] font-black uppercase tracking-[0.5em] text-accent-gold/80">
                          {heroSlides[currentSlide].tag}
                      </span>
                      <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-white uppercase tracking-tighter leading-[0.95]">
                          {heroSlides[currentSlide].title.split('.')[0]}
                          <br />
                          <span className="text-luxury-gradient italic font-medium opacity-90">
                            {heroSlides[currentSlide].title.split('.')[1] || ''}
                          </span>
                      </h1>
                    </motion.div>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ delay: 1, duration: 1.5 }}
                      className="text-white text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed tracking-wide"
                    >
                      {heroSlides[currentSlide].subtitle}
                    </motion.p>
                    
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 1.3, duration: 1 }} 
                      className="pt-4"
                    >
                      <Link href="/shop" className="group relative inline-flex items-center gap-4 text-white text-[10px] font-black uppercase tracking-[0.4em] border-b border-white/20 pb-2 hover:border-accent-gold transition-all duration-500">
                        <span>{t.hero.discover}</span>
                        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Minimal Slide Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
             {heroSlides.map((_, i) => (
               <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1 transition-all duration-700 rounded-full ${currentSlide === i ? 'w-12 bg-accent-gold' : 'w-4 bg-white/20 hover:bg-white/40'}`}
               />
             ))}
          </div>
        </div>
      </section>

      {/* 2. MINIMAL GRID (Category Section) */}
      <section className="py-32 md:py-48 px-6 md:px-20 bg-white">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
           <div className="lg:col-span-5 space-y-10">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-accent-gold/60 block mb-4">The Selection</span>
                <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-primary leading-[1]">{t.shop.explore.split(' ')[0]} <span className="text-accent-gold italic font-medium">{t.shop.explore.split(' ')[1] || 'Edition.'}</span></h2>
                <p className="text-sm text-secondary font-medium mt-8 max-w-sm leading-relaxed opacity-50">{t.shop.categorySub}</p>
              </motion.div>
              
              <div className="grid grid-cols-1 gap-2 pt-8">
                {categories.map((cat, i) => (
                  <Link 
                    key={cat.name} 
                    href={cat.href} 
                    onMouseEnter={() => setActiveCategoryIndex(i)}
                    className="group flex items-center justify-between py-6 border-b border-neutral-100 hover:px-4 transition-all duration-500"
                  >
                    <div className="flex items-center gap-6">
                      <span className={`text-[10px] font-black transition-colors duration-500 ${activeCategoryIndex === i ? 'text-accent-gold' : 'text-neutral-300'}`}>0{i+1}</span>
                      <h3 className={`text-lg font-black uppercase tracking-tight transition-colors duration-500 ${activeCategoryIndex === i ? 'text-primary' : 'text-neutral-400 group-hover:text-primary'}`}>{cat.name}</h3>
                    </div>
                    <div className={`w-8 h-8 rounded-full border transition-all duration-500 flex items-center justify-center ${activeCategoryIndex === i ? 'bg-primary text-white border-primary rotate-45' : 'border-neutral-100 group-hover:bg-neutral-50'}`}>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                ))}
              </div>
           </div>

           <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] rounded-[48px] overflow-hidden shadow-luxury">
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategoryIndex}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                       <Image 
                        src={categories[activeCategoryIndex].image} 
                        alt={categories[activeCategoryIndex].name} 
                        fill 
                        className="object-cover" 
                       />
                       <div className="absolute inset-0 bg-primary/5" />
                       
                       {/* Artifact Badge */}
                       <div className="absolute bottom-10 right-10 flex items-center gap-4">
                          <div className="h-px w-8 bg-white/40"></div>
                          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/80">Artifact 0{activeCategoryIndex + 1}</span>
                       </div>
                    </motion.div>
                 </AnimatePresence>
              </div>
              
              <div className="mt-8 flex justify-between items-center px-4">
                 <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-neutral-400 italic">Curated by Duit Design Lab</span>
                 </div>
                 <Link href="/shop" className="text-[8px] font-black uppercase tracking-[0.4em] text-neutral-300 hover:text-accent-gold transition-colors">Exhibition Guide</Link>
              </div>
           </div>
        </div>
      </section>

      {/* 3. CURATED MASTERPIECES */}
      <section className="bg-[#FBFBFA] py-32 md:py-48 px-6 md:px-20 rounded-[60px] md:rounded-[80px]">
        <div className="max-w-[1440px] mx-auto space-y-20">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="space-y-4">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-accent-gold/60">New Arrivals</span>
                <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-primary leading-[1]">{t.shop.freshArrivals.split(' ')[0]} <span className="text-luxury-gradient italic font-medium">{t.shop.freshArrivals.split(' ')[1] || 'Series.'}</span></h2>
              </div>
              <Link href="/shop" className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/40 hover:text-accent-gold transition-colors pb-1 border-b border-neutral-200">
                {t.shop.viewAll}
              </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
           </div>
        </div>
      </section>

      {/* 4. THE ATELIER PHILOSOPHY */}
      <section className="py-40 md:py-60 px-6 md:px-20 text-center relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-transparent to-accent-gold/40" />
         
         <div className="max-w-4xl mx-auto space-y-16">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-accent-gold block">Ethos of Duit</span>
            <p className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-primary leading-[1.1]">
              "Redefining the boundaries of pet living through <span className="text-luxury-gradient italic">architectural precision</span> and enduring aesthetic value."
            </p>
            <div className="flex justify-center gap-12">
               <div className="text-center space-y-2">
                  <div className="text-4xl font-black">2016</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-neutral-400 italic">Established Seoul</div>
               </div>
               <div className="w-px h-12 bg-neutral-200 mt-2" />
               <div className="text-center space-y-2">
                  <div className="text-4xl font-black">120+</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-neutral-400 italic">Patented Designs</div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. MEMBERSHIP (Private Circle) */}
      <section className="py-20 md:py-40 px-6 md:px-20">
         <div className="max-w-[1600px] mx-auto bg-primary rounded-[80px] p-12 md:p-32 relative overflow-hidden group shadow-luxury">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-gold/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-[3s]" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-12 text-white">
                  <div className="space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">{t.shop.privateCircle}</span>
                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{t.shop.exclusiveClub.split(' ')[0]} <br /> <span className="text-accent-gold italic">{t.shop.exclusiveClub.split(' ')[1]}</span></h2>
                  </div>
                  <p className="text-xl font-medium opacity-60 leading-relaxed max-w-md">{t.shop.membershipSub}</p>
                  <Link href="/pet-profile" className="inline-flex items-center gap-6 px-12 py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-accent-gold hover:text-white transition-all duration-700 shadow-luxury group">
                     Explore Benefits <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>
               
               <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
                  <motion.div 
                    initial={{ rotateY: 30, rotateX: 20, opacity: 0 }}
                    whileInView={{ rotateY: -10, rotateX: 10, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-sm aspect-[1.58/1] bg-gradient-to-br from-accent-gold/20 via-white/5 to-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-2xl p-12 relative overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-grain opacity-10" />
                     <div className="flex justify-between items-start h-full flex-col relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><Star className="text-accent-gold" size={24} fill="currentColor" /></div>
                        <div className="space-y-2">
                           <div className="text-[8px] font-black uppercase tracking-widest text-accent-gold/60">Duit Care+ Archive</div>
                           <div className="text-2xl font-black text-white tracking-widest uppercase">Member Card</div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
