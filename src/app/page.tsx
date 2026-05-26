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
    { name: t.shop.eatDrink, Icon: Utensils, href: '/collections/eat-drink' },
    { name: t.shop.playRest, Icon: Gamepad2, href: '/collections/play-rest' },
    { name: t.shop.furniture, Icon: Armchair, href: '/collections/furniture' },
    { name: t.shop.hygiene, Icon: Droplets, href: '/collections/hygiene' },
    { name: t.shop.daily, Icon: Sparkles, href: '/collections/daily' },
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

  const textRevealVariants = {
    hidden: { y: "100%" },
    visible: (i: number) => ({
      y: 0,
      transition: { delay: 0.5 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] as const }
    })
  };

  return (
    <div className="flex flex-col bg-white">
      
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">
            {heroSlides[currentSlide].image && <Image src={heroSlides[currentSlide].image} alt={heroSlides[currentSlide].title} fill className="object-cover brightness-[0.4]" priority />}
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div className="max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-4 mb-8">
                  <div className="h-[1px] w-8 bg-accent-gold/50"></div>
                  <span className="text-accent-gold text-[10px] font-black tracking-[0.4em] uppercase">{heroSlides[currentSlide].tag}</span>
                  <div className="h-[1px] w-8 bg-accent-gold/50"></div>
                </motion.div>
                <h1 className="text-4xl sm:text-6xl md:text-[110px] font-black text-white leading-[0.85] mb-12 tracking-[-0.04em] uppercase">
                  {heroSlides[currentSlide].title.split(' ').map((word, i) => (
                    <span key={`${currentSlide}-${language}-${i}`} className="reveal-mask mr-4">
                      <motion.span custom={i} variants={textRevealVariants} initial="hidden" animate="visible" className={`inline-block ${word === 'BETTER' || word === 'EVERY' || word === 'EXPLORERS.' ? 'text-accent-gold italic' : ''}`}>{word}</motion.span>
                    </span>
                  ))}
                </h1>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1.5 }} className="flex flex-col sm:flex-row justify-center gap-8">
                  <Link href="/shop" className="group relative overflow-hidden bg-white text-black px-16 py-6 font-black text-xs uppercase tracking-[0.3em] transition-all duration-700">
                    <span className="relative z-10">{t.hero.discover}</span>
                    <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Slide Numbers */}
        <div className="absolute bottom-20 left-20 hidden lg:flex items-end gap-4">
           <span className="text-5xl font-black text-white">0{currentSlide + 1}</span>
           <div className="h-px w-20 bg-white/20 relative mb-3"><motion.div className="absolute left-0 top-0 h-full bg-accent-gold" initial={{ width: 0 }} animate={{ width: "100%" }} key={currentSlide} transition={{ duration: 6, ease: "linear" }} /></div>
           <span className="text-xs font-black text-white/40 mb-2">0{heroSlides.length}</span>
        </div>
      </section>

      {/* 2. ASYMMETRIC ARCHITECTURAL GRID (Category Section) */}
      <section className="py-40 md:py-60 px-6 md:px-20 overflow-hidden">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
           <div className="lg:col-span-5 space-y-12">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold block mb-6">Mastery of Form</span>
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-primary leading-[0.85]">{t.shop.explore.split(' ')[0]} <br /> <span className="text-accent-gold italic">{t.shop.explore.split(' ')[1] || 'Essence.'}</span></h2>
                <p className="text-lg text-secondary font-medium mt-12 max-w-md leading-relaxed opacity-70">{t.shop.categorySub}</p>
              </motion.div>
              
              <div className="grid grid-cols-1 gap-4 pt-12">
                {categories.map((cat, i) => (
                  <Link key={cat.href} href={cat.href} className="group flex items-center justify-between py-8 border-b border-neutral-100 hover:border-accent-gold transition-all duration-700">
                    <div className="flex items-center gap-8">
                       <span className="text-[10px] font-mono text-neutral-300 group-hover:text-accent-gold">0{i+1}</span>
                       <span className="text-2xl font-black uppercase tracking-tight group-hover:translate-x-4 transition-transform duration-700">{cat.name}</span>
                    </div>
                    <cat.Icon className="opacity-0 group-hover:opacity-100 group-hover:text-accent-gold -translate-x-10 group-hover:translate-x-0 transition-all duration-700" size={24} />
                  </Link>
                ))}
              </div>
           </div>
           
           <div className="lg:col-span-7 grid grid-cols-2 gap-8 relative">
              {/* Blueprint SVG Animation Overlay */}
              <svg className="absolute -top-20 -right-20 w-80 h-80 text-accent-gold/10 pointer-events-none" viewBox="0 0 100 100">
                 <motion.path 
                   d="M 10,10 L 90,10 L 90,90 L 10,90 Z M 50,10 L 50,90 M 10,50 L 90,50" 
                   fill="none" stroke="currentColor" strokeWidth="0.5"
                   initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 3, ease: "easeInOut" }}
                 />
              </svg>
              
              <motion.div initial={{ y: 100, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="aspect-[4/6] rounded-[64px] overflow-hidden relative shadow-luxury-hover mt-24">
                 <Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/1eff7a9ff2bb1.jpg?w=800" alt="Design" fill className="object-cover hover:scale-110 transition-transform duration-[2s]" />
              </motion.div>
              <motion.div initial={{ y: -100, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 }} className="aspect-[4/6] rounded-[64px] overflow-hidden relative shadow-luxury-hover">
                 <Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/1ea24a0d5546d.jpg?w=800" alt="Design" fill className="object-cover hover:scale-110 transition-transform duration-[2s]" />
              </motion.div>
           </div>
        </div>
      </section>

      {/* 3. SELECTION (Horizontal Feel) */}
      <section className="py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Curated Assets</span>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">{t.shop.aList.split(' ').map((word, i) => i === t.shop.aList.split(' ').length - 1 ? <span key={i} className="text-accent-gold italic">{word}</span> : word + ' ')}</h2>
            </div>
            <Link href="/shop" className="group flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] hover:text-accent-gold transition-colors">
               <span>Explore Inventory</span> <div className="w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center group-hover:bg-accent-gold group-hover:text-white transition-all"><ArrowRight size={16} /></div>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. PERSONALIZED RECOMMENDATIONS (Interactive Reveal) */}
      {profile && personalized.length > 0 && (
        <section className="py-40 px-6 md:px-20 bg-cream-light/30">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
             <div className="lg:col-span-4 sticky top-40 space-y-8">
                <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-accent-gold shadow-sm"><Sparkles size={28} /></div>
                <h2 className="text-5xl font-black uppercase tracking-tighter text-primary leading-none">Bespoke for <br /> <span className="text-accent-gold italic">{profile.name}</span></h2>
                <p className="text-secondary font-medium opacity-60 leading-relaxed">{language === 'th' ? `วิเคราะห์จากข้อมูลของ ${profile.breed} เราคัดสรรสิ่งที่ดีที่สุดเพื่อสรีระของน้องโดยเฉพาะ` : `Synthesized from ${profile.breed} data. These assets are precision-tuned for their ergonomics.`}</p>
             </div>
             <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-12">
                {personalized.map((product) => (
                  <ProductCard key={`personalized-${product.id}`} product={product} />
                ))}
             </div>
          </div>
        </section>
      )}

      {/* 5. EXCLUSIVE CLUB (Dark Section) */}
      <section className="py-60 bg-primary text-white overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="space-y-16">
             <div className="space-y-8">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-gold">Atelier Access</span>
                <h2 className="text-6xl md:text-[120px] font-black tracking-tighter uppercase leading-[0.8] mb-12">Duit <br /> <span className="text-accent-gold italic">Care+</span></h2>
                <p className="text-xl text-neutral-400 font-medium leading-relaxed max-w-lg opacity-80">{t.shop.membershipSub}</p>
             </div>
             <Link href="/pet-profile" className="group relative inline-flex bg-white text-black px-20 py-8 overflow-hidden transition-all shadow-luxury">
                <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                <span className="relative z-10 font-black text-xs uppercase tracking-[0.4em]">{t.common.membership}</span>
             </Link>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-8">
             {[
               "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/1eff7a9ff2bb1.jpg?w=800",
               "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/1ea24a0d5546d.jpg?w=800",
               "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=800",
               "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/02c3dd1725fb7.jpg?w=800"
             ].map((img, i) => (
               <motion.div key={i} whileHover={{ scale: 1.05 }} transition={{ duration: 1 }} className={`aspect-[3/4] rounded-[48px] overflow-hidden relative ${i % 2 !== 0 ? 'mt-20' : ''}`}>
                  <Image src={img} alt="Duit Decor" fill className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" />
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* 6. TRUST ICONS (Minimal Blueprint) */}
      <section className="py-40 bg-white border-t border-neutral-50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-24">
          {[
            { title: t.common.heritageDesign, desc: t.common.heritageDesc, icon: Star },
            { title: t.common.premiumIntegrity, desc: t.common.premiumDesc, icon: ShieldCheck },
            { title: t.common.globalConcierge, desc: t.common.globalDesc, icon: Truck },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="space-y-10 group">
               <div className="w-20 h-20 bg-cream-light rounded-[32px] flex items-center justify-center text-accent-gold transition-all duration-700 group-hover:bg-primary group-hover:text-white border border-neutral-50">
                  <item.icon strokeWidth={1} size={36} />
               </div>
               <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tight text-primary">{item.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed font-medium opacity-60">{item.desc}</p>
               </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
