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
    { name: t.shop.eatDrink, Icon: Utensils, href: '/collections/eat-drink', bgColor: 'bg-sage-50', iconColor: 'text-sage-600' },
    { name: t.shop.playRest, Icon: Gamepad2, href: '/collections/play-rest', bgColor: 'bg-sky-50', iconColor: 'text-sky-600' },
    { name: t.shop.furniture, Icon: Armchair, href: '/collections/furniture', bgColor: 'bg-sand-50', iconColor: 'text-sand-600' },
    { name: t.shop.hygiene, Icon: Droplets, href: '/collections/hygiene', bgColor: 'bg-rose-50', iconColor: 'text-rose-600' },
    { name: t.shop.daily, Icon: Sparkles, href: '/collections/daily', bgColor: 'bg-neutral-50', iconColor: 'text-neutral-400' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data && data.length > 0) {
          // Map database fields (snake_case) to Product interface (camelCase)
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
  }, [supabase]);

  // Updated bestSellers logic with fallback to show first 4 products if none are marked as "Best"
  const bestSellers = useMemo(() => {
    const filtered = products.filter(p => p.isBest);
    return filtered.length > 0 ? filtered.slice(0, 4) : products.slice(0, 4);
  }, [products]);

  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const personalized = useMemo(() => getRecommendedProducts(profile, products), [profile, products]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Cinematic Text Reveal Animation Variants
  const textRevealVariants = {
    hidden: { y: "100%" },
    visible: (i: number) => ({
      y: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Promotional Hero Banner */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <AnimatePresence initial={false}>
          <motion.div key={currentSlide} initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.05, opacity: 0 }} transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">
            {heroSlides[currentSlide].image && <Image src={heroSlides[currentSlide].image} alt={heroSlides[currentSlide].title} fill className="object-cover brightness-[0.5]" priority />}
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div className="max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }} className="flex items-center justify-center gap-4 mb-8">
                  <div className="h-[1px] w-8 bg-accent-gold/50"></div>
                  <span className="text-accent-gold text-[10px] font-black tracking-[0.4em] uppercase">{heroSlides[currentSlide].tag}</span>
                  <div className="h-[1px] w-8 bg-accent-gold/50"></div>
                </motion.div>
                
                <h1 className="text-5xl sm:text-7xl md:text-[100px] font-black text-white leading-[0.85] mb-12 tracking-[-0.04em] uppercase">
                  {heroSlides[currentSlide].title.split(' ').map((word, i) => (
                    <span key={`${currentSlide}-${language}-${i}`} className="reveal-mask mr-4 last:mr-0">
                      <motion.span 
                        custom={i}
                        variants={textRevealVariants}
                        initial="hidden"
                        animate="visible"
                        className={`inline-block ${word === 'BETTER' || word === 'EVERY' || word === 'EXPLORERS.' ? 'text-accent-gold italic' : ''}`}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </h1>
                
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }} className="text-lg md:text-xl text-white/80 font-medium mb-16 max-w-2xl mx-auto leading-relaxed tracking-wide">
                  {heroSlides[currentSlide].subtitle}
                </motion.p>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1 }} className="flex flex-wrap justify-center gap-8">
                  <Link href="/shop" className="group relative overflow-hidden bg-white text-black px-16 py-6 font-black text-xs uppercase tracking-[0.2em] transition-all duration-500">
                    <span className="relative z-10">{t.hero.discover}</span>
                    <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </Link>
                  <Link href="/about" className="group border border-white/30 text-white px-16 py-6 font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500">{t.hero.philosophy}</Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-10">
           {heroSlides.map((_, i) => (
             <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-12 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'}`} />
           ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-24 bg-mesh border-b border-neutral-100">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tight text-primary uppercase">{t.shop.explore}</h2>
              <p className="text-secondary text-base font-medium">{t.shop.categorySub}</p>
            </div>
            <Link href="/shop" className="text-primary text-sm font-black flex items-center gap-2 hover:translate-x-2 transition-transform duration-300 group">{t.shop.viewAll} <ArrowRight size={18} className="group-hover:text-primary" /></Link>
          </motion.div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
          >
            {categories.map((cat) => (
              <motion.div key={cat.href} variants={itemVariants}>
                <Link href={cat.href} className="group block">
                  <div className="aspect-square bg-white rounded-[48px] flex flex-col items-center justify-center p-10 transition-all duration-700 shadow-luxury hover:shadow-luxury-hover hover:-translate-y-2 relative overflow-hidden group-hover:bg-cream-light border border-neutral-50">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full -translate-y-16 translate-x-16 blur-3xl transition-all duration-700"></div>
                    <div className="w-20 h-20 bg-cream-light rounded-[32px] flex items-center justify-center mb-8 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                      <cat.Icon size={32} strokeWidth={1.2} className="text-primary group-hover:text-accent-gold transition-colors" />
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] relative z-10">{cat.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section with Image Scale Parallax */}
      <section className="py-32 md:py-48 bg-white">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
          <div className="text-center space-y-6 mb-24">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Selection</span>
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">{t.shop.aList.split(' ').map((word, i) => i === t.shop.aList.split(' ').length - 1 ? <span key={i} className="text-accent-gold italic">{word}</span> : word + ' ')}</h2>
             <p className="text-secondary font-medium max-w-xl mx-auto opacity-70">{t.shop.selectionSub}</p>
          </div>
          {isLoading ? (
            <div className="py-40 flex flex-col items-center justify-center gap-6 text-neutral-200">
              <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">{t.shop.curating}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {bestSellers.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Personalized Recommendations Section (Bespoke for Your Companion) */}
      {profile && personalized.length > 0 && (
        <section className="py-24 bg-cream-light/30 border-b border-neutral-100">
          <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles size={16} className="text-accent-gold" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">{t.crm.bespokeCuration}</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight text-primary uppercase">
                  {language === 'th' ? `พิเศษสำหรับ ${profile.name}` : `Bespoke for ${profile.name}`}
                </h2>
                <p className="text-secondary text-base font-medium max-w-xl">
                  {language === 'th' 
                    ? `คัดสรรชิ้นงานที่ตอบโจทย์ไลฟ์สไตล์และสรีระของ ${profile.breed} โดยเฉพาะ` 
                    : `Handpicked masterpieces tailored for the specific lifestyle and ergonomics of your ${profile.breed}.`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {personalized.map((product) => (
                <motion.div 
                  key={`personalized-${product.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Personalized Experience Section */}
      <section className="py-32 md:py-48 bg-primary text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-accent-gold/5 -skew-x-12 translate-x-1/4"></div>
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-16">
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] w-8 bg-accent-gold"></div>
                    <span className="text-accent-gold text-[10px] font-black tracking-[0.4em] uppercase">{t.shop.privateCircle}</span>
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Duit Care+ <br /> <span className="text-accent-gold italic text-5xl md:text-7xl">{t.shop.exclusiveClub}</span></h2>
               </div>
               <p className="text-xl text-neutral-400 font-medium leading-relaxed max-w-lg opacity-80">{t.shop.membershipSub}</p>
               <div className="flex flex-wrap gap-8">
                  <div className="bg-white/5 border border-white/10 px-10 py-6 rounded-[32px] backdrop-blur-md">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-gold block mb-3">Privilege</span>
                     <span className="text-2xl font-black tracking-tight tracking-wider uppercase">{t.common.bespokeCare}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-10 py-6 rounded-[32px] backdrop-blur-md">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-gold block mb-3">Access</span>
                     <span className="text-2xl font-black tracking-tight tracking-wider uppercase">{t.common.earlyAccess}</span>
                  </div>
               </div>
               <Link href="/pet-profile" className="group relative inline-block bg-white text-black px-16 py-6 overflow-hidden transition-all shadow-luxury text-center">
                  <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative z-10 font-black text-xs uppercase tracking-[0.3em]">{t.common.membership}</span>
               </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 relative">
               <div className="space-y-8 pt-16">
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.8 }} className="aspect-[4/5] bg-neutral-900 rounded-[56px] relative overflow-hidden border border-white/5 shadow-luxury"><Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/1eff7a9ff2bb1.jpg?w=800" alt="Duit Decor" fill className="object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-[2s]" /></motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.8 }} className="aspect-[4/5] bg-neutral-900 rounded-[56px] relative overflow-hidden border border-white/5 shadow-luxury"><Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/1ea24a0d5546d.jpg?w=800" alt="Duit Decor" fill className="object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-[2s]" /></motion.div>
               </div>
               <div className="space-y-8">
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.8 }} className="aspect-[4/5] bg-neutral-900 rounded-[56px] relative overflow-hidden border border-white/5 shadow-luxury"><Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=800" alt="Duit Decor" fill className="object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-[2s]" /></motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.8 }} className="aspect-[4/5] bg-neutral-900 rounded-[56px] relative overflow-hidden border border-white/5 shadow-luxury"><Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/02c3dd1725fb7.jpg?w=800" alt="Duit Decor" fill className="object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-[2s]" /></motion.div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 md:py-48 bg-white">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">{t.shop.freshArrivals}</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">{t.shop.newArrivalsTitle.split(' ').slice(0, -1).join(' ')} <br />{t.shop.newArrivalsTitle.split(' ').slice(-1)}</h2>
              <p className="text-secondary font-medium max-w-sm opacity-70">{t.shop.newArrivalsSub}</p>
            </div>
            <Link href="/shop" className="group border border-neutral-100 bg-white hover:border-primary px-12 py-5 rounded-full transition-all duration-500 shadow-sm"><span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-primary transition-colors text-primary">{t.shop.exploreAll}</span></Link>
          </div>
          {isLoading ? (
            <div className="py-40 flex flex-col items-center justify-center gap-6 text-neutral-200">
              <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">{t.shop.curating}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {newArrivals.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-32 md:py-48 border-t border-neutral-100 bg-mesh">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-24">
          {[
            { title: t.common.heritageDesign, desc: t.common.heritageDesc, icon: Star },
            { title: t.common.premiumIntegrity, desc: t.common.premiumDesc, icon: ShieldCheck },
            { title: t.common.globalConcierge, desc: t.common.globalDesc, icon: Truck },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="text-center space-y-8 group"
            >
               <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center mx-auto text-accent-gold transition-all duration-700 shadow-luxury group-hover:bg-primary group-hover:text-white border border-neutral-100 group-hover:-translate-y-2"><item.icon size={36} strokeWidth={1} /></div>
               <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tight text-primary leading-none">{item.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed font-medium opacity-60 px-4">{item.desc}</p>
               </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
