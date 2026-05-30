'use client';

import { usePetStore } from '@/store/usePetStore';
import { useLanguageStore, translations } from '@/store/useLanguageStore';
import { getRecommendedProducts, Product, products as staticProducts } from '@/data/products';
import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Settings, Star, ShoppingBag, ShieldCheck, ChevronRight, Dog, Cat, Loader2, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase/client';

export default function DuitCarePage() {
  const { profile } = usePetStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSynthesizing, setIsSynthesizing] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
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
        console.error('Error fetching products:', err);
        setProducts(staticProducts);
      } finally {
        setIsLoading(false);
        // Simulate AI Synthesis for "Duit Care" feel
        setTimeout(() => setIsSynthesizing(false), 1200);
      }
    };
    fetchProducts();
  }, []);

  const recommendations = useMemo(() => getRecommendedProducts(profile, products), [profile, products]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-cream-light pt-20 flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-white rounded-[64px] p-16 md:p-24 text-center space-y-12 shadow-luxury relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="w-24 h-24 bg-cream-light rounded-[32px] flex items-center justify-center mx-auto text-accent-gold shadow-inner border border-neutral-100">
            <Heart size={40} strokeWidth={1} className="fill-accent-gold/10" />
          </div>
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.4em] text-accent-gold font-bold">{language === 'th' ? 'เอกสิทธิ์เฉพาะ' : 'Exclusivity'}</span>
            <h1 className="text-4xl md:text-5xl uppercase tracking-tight">{language === 'th' ? 'ไพรเวท เซอร์เคิล' : 'The Inner Circle'}</h1>
            <p className="text-secondary font-medium leading-relaxed max-w-sm mx-auto opacity-70">
              {language === 'th' 
                ? 'สัมผัสการดูแลที่ออกแบบมาเพื่อคุณโดยเฉพาะ พร้อมสิทธิประโยชน์ระดับพรีเมียมสำหรับเจ้าของสัตว์เลี้ยงที่พิถีพิถันที่สุด' 
                : 'Experience personalized care and elite benefits designed for the most discerning pet owners.'}
            </p>
          </div>
          <Link href="/pet-profile" className="group relative inline-block w-full bg-primary text-white py-6 rounded-full overflow-hidden transition-all shadow-luxury">
            <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <span className="relative z-10 uppercase tracking-[0.2em] text-xs">{language === 'th' ? 'เริ่มต้นสร้างโปรไฟล์' : 'Get Started'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-40">
      {/* Profile Header */}
      <section className="py-24 md:py-32 bg-cream-light border-b border-neutral-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.08),transparent_50%)]"></div>
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="w-48 h-48 rounded-[56px] bg-primary flex items-center justify-center text-white relative shadow-luxury overflow-hidden"
            >
              {profile.imageUrl ? (
                <Image src={profile.imageUrl} alt={profile.name} fill className="object-cover" />
              ) : (
                profile.type === 'dog' ? <Dog size={80} strokeWidth={1} /> : <Cat size={80} strokeWidth={1} />
              )}
              <div className="absolute -bottom-3 -right-3 bg-accent-gold text-white p-4 rounded-3xl shadow-luxury border-[6px] border-cream-light">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
            </motion.div>
            
            <div className="flex-grow text-center md:text-left space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                  <h1 className="text-5xl md:text-7xl uppercase tracking-[-0.04em] text-primary leading-none">{profile.name}</h1>
                  <span className="bg-primary text-white text-[11px] px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg border border-white/10 font-bold">Platinum Elite</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4">
                   <div className="h-[1px] w-8 bg-accent-gold"></div>
                   <p className="text-accent-gold uppercase tracking-[0.3em] text-xs font-bold">
                    {profile.breed || 'Signature Breed'} • {profile.size?.toUpperCase() || 'STANDARD'} Class
                   </p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <Link href="/pet-profile" className="flex items-center gap-3 bg-white border border-neutral-100 hover:border-primary px-8 py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-sm font-medium">
                  <Settings size={14} /> Profile Settings
                </Link>
                <div className="flex items-center gap-3 bg-white/50 border border-white/50 px-8 py-4 rounded-2xl text-xs uppercase tracking-widest text-neutral-400 font-medium">
                  <Star size={14} fill="currentColor" className="text-accent-gold" /> Member Since 2025
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="py-32">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 text-center md:text-left">
            <div className="space-y-4">
              <span className="text-xs text-accent-gold uppercase tracking-[0.4em] font-bold">Personalized Portfolio</span>
              <h2 className="text-4xl md:text-5xl uppercase tracking-tight">Curated for {profile.name}</h2>
            </div>
            <Link href="/shop" className="text-primary text-xs uppercase tracking-[0.3em] border-b-2 border-primary pb-2 hover:text-accent-gold hover:border-accent-gold transition-colors font-bold">
              Discover All Masterpieces
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {isSynthesizing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-40 flex flex-col items-center justify-center gap-8 text-neutral-200"
              >
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin text-accent-gold" strokeWidth={1} />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent-gold animate-pulse" size={24} />
                </div>
                <p className="text-xs uppercase tracking-[0.6em] animate-pulse">{language === 'th' ? 'กำลังประมวลผลความต้องการ...' : 'Synthesizing Biological Needs...'}</p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
              >
                {recommendations.map((p) => (
                  <div key={p.id} className="space-y-6 group">
                    <ProductCard product={p} variant="compact" />
                    <div className="px-2 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                       <span className={`text-[9px] uppercase tracking-widest ${profile.type === 'dog' ? 'text-blue-600' : 'text-accent-gold'} font-bold`}>Bespoke Benefit</span>
                       <p className="text-xs text-secondary font-medium leading-relaxed">
                          {language === 'th' ? (
                            p.id === 'summer-cushion' ? 'ช่วยลดอุณหภูมิร่างกายและผ่อนคลาย' :
                            p.id === 'yummy-ball' ? 'ฝึกทักษะการดมกลิ่นและสมาธิ' :
                            p.id === 'banana-brush' ? 'ดูแลเส้นขนให้เงางามไม่ระคายผิว' :
                            p.id === 'the-table-plus' ? 'จัดการมื้ออาหารอย่างแม่นยำ' :
                            p.id === 'custom-potty' ? 'พื้นที่สุขาที่ถูกหลักสรีระ' :
                            p.id === 'anti-bug-light' ? 'เพิ่มความปลอดภัยในทุกการเดินทาง' :
                            'ดีไซน์เพื่อความงดงามที่เหนือระดับ'
                          ) : (
                            p.id === 'summer-cushion' ? 'Perfect for temperature regulation' :
                            p.id === 'yummy-ball' ? 'Stimulates cognitive instincts' :
                            p.id === 'banana-brush' ? 'Professional coat management' :
                            p.id === 'the-table-plus' ? 'Precision nutrition dispenser' :
                            p.id === 'custom-potty' ? 'Ergonomic hygiene solution' :
                            p.id === 'anti-bug-light' ? 'Essential walk safety' :
                            'Design for refined aesthetics'
                          )}
                       </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Duit Care Benefits */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
           <div className="bg-primary rounded-[80px] p-16 md:p-32 text-white relative overflow-hidden shadow-luxury">
              <div className="absolute top-0 right-0 w-2/3 h-full bg-accent-gold/5 -skew-x-12 translate-x-1/4"></div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                 <div className="space-y-12 text-center lg:text-left">
                    <div className="space-y-6">
                       <span className="text-accent-gold text-xs tracking-[0.4em] uppercase font-bold">Elite Program</span>
                       <h2 className="text-4xl sm:text-5xl md:text-7xl tracking-tighter uppercase leading-[0.9]">
                          Duit Care+ <br />
                          <span className="text-accent-gold italic">Privileges.</span>
                       </h2>
                    </div>
                    <p className="text-lg sm:text-xl text-neutral-400 font-medium leading-relaxed opacity-80 max-w-xl mx-auto lg:mx-0">
                       As a distinguished member of the Duit circle, you and {profile.name} are granted unprecedented access to our latest innovations and bespoke services.
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 sm:gap-8">
                       <div className="bg-white/5 border border-white/10 px-8 sm:px-10 py-5 sm:py-6 rounded-[24px] sm:rounded-[32px] backdrop-blur-md">
                          <span className="text-xs uppercase tracking-[0.2em] text-accent-gold block mb-2 sm:mb-3 font-bold">Privilege 01</span>
                          <span className="text-xl sm:text-2xl tracking-tight font-bold">10% COMPLIMENTARY</span>
                       </div>
                       <div className="bg-white/5 border border-white/10 px-8 sm:px-10 py-5 sm:py-6 rounded-[24px] sm:rounded-[32px] backdrop-blur-md">
                          <span className="text-xs uppercase tracking-[0.2em] text-accent-gold block mb-2 sm:mb-3 font-bold">Privilege 02</span>
                          <span className="text-xl sm:text-2xl tracking-tight font-bold">GLOBAL CONCIERGE</span>
                       </div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    {[
                      { title: 'Personalized Curation', icon: '✨' },
                      { title: 'TH Access', icon: '🏛️' },
                      { title: 'Heritage Support', icon: '🛡️' },
                      { title: 'Bespoke Gifts', icon: '🎁' }
                    ].map((benefit, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[48px] text-center space-y-6 hover:bg-white/10 transition-all duration-500 group">
                         <div className="text-5xl transform group-hover:scale-110 transition-transform duration-500">{benefit.icon}</div>
                         <h4 className="text-xs uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity leading-relaxed font-bold">{benefit.title}</h4>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
