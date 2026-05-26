'use client';

import { Product, products as staticProducts } from '@/data/products';
import Product3DViewer from '@/components/Product3DViewer';
import { ChevronRight, Loader2, Image as ImageIcon, Rotate3D, Sparkles, MessageCircle, ArrowRight, ShieldCheck, Truck, Star } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguageStore, translations } from '@/store/useLanguageStore';

interface ProductOption {
  id: string;
  name: string;
  price_modifier: number;
}

export default function ProductDetailView({ id }: { id: string }) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [product, setProduct] = useState<Product | null>(null);
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'image' | '3d'>('image');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    const fetchProductAndOptions = async () => {
      try {
        const { data: prodData } = await supabase.from('products').select('*').eq('id', id).single();
        const { data: optionsData } = await supabase.from('product_options').select('*').eq('product_id', id);

        if (prodData) {
          const staticProd = staticProducts.find(p => p.id === id);
          const finalProduct = { 
            ...prodData, 
            image: prodData.image_url,
            images: prodData.images || (prodData.image_url ? [prodData.image_url] : []),
            modelUrl: prodData.model_url || staticProd?.modelUrl 
          };
          setProduct(finalProduct);
          setOptions(optionsData || []);
          if (finalProduct.modelUrl && !finalProduct.image && (!finalProduct.images || finalProduct.images.length === 0)) {
            setViewMode('3d');
          }
        } else {
            const staticProd = staticProducts.find(p => p.id === id);
            if (staticProd) setProduct(staticProd);
        }
      } catch (err) {
        const staticProd = staticProducts.find(p => p.id === id);
        if (staticProd) setProduct(staticProd);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductAndOptions();
  }, [id, supabase]);

  useEffect(() => {
    if (isAutoPlaying && viewMode === 'image' && product?.images && product.images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % (product.images?.length || 1));
      }, 4000);
    }
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [isAutoPlaying, viewMode, product?.images]);

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]);
  };

  const totalPrice = (product?.price || 0) + selectedOptions.reduce((acc, optId) => {
    const option = options.find(o => o.id === optId);
    return acc + (option?.price_modifier || 0);
  }, 0);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center uppercase font-black tracking-widest text-neutral-300 text-6xl">Asset Not Found</div>;

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image || "/placeholder-product.png"];
  const currentMainImage = productImages[activeImageIndex];

  return (
    <div className="bg-white min-h-screen pt-20" ref={scrollRef}>
      <nav className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 py-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300">
        <Link href="/" className="hover:text-primary transition-colors">{language === 'th' ? 'หน้าหลัก' : 'Home'}</Link>
        <div className="w-1 h-[1px] bg-neutral-200"></div>
        <Link href="/shop" className="hover:text-primary transition-colors">{language === 'th' ? 'คอลเลกชัน' : 'TH Collection'}</Link>
        <div className="w-1 h-[1px] bg-neutral-200"></div>
        <span className="text-primary truncate">{product.name}</span>
      </nav>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 items-start">
          <div className="lg:col-span-7 space-y-12">
            <div className="relative group">
              <motion.div className="rounded-[64px] overflow-hidden bg-[#f9f9f9] border border-neutral-100 shadow-luxury relative p-8 md:p-16 lg:p-20 flex items-center justify-center min-h-[500px] md:min-h-[700px]" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)}>
                <div className="relative w-full h-full aspect-square md:aspect-video rounded-[48px] overflow-hidden flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {viewMode === '3d' && product.modelUrl ? (
                      <motion.div key="3d" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full h-full relative cursor-grab active:cursor-grabbing">
                        <Product3DViewer modelUrl={product.modelUrl} altText={product.name} />
                        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 2, duration: 1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className="bg-primary/10 backdrop-blur-md px-8 py-4 rounded-full border border-primary/10 flex items-center gap-3">
                              <Rotate3D className="text-primary animate-bounce" size={24} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{language === 'th' ? 'หมุนดู 360 องศา' : '360° Interactive'}</span>
                           </div>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div key={activeImageIndex} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full relative" style={{ y: parallaxY }}>
                        <Image src={currentMainImage} alt={product.name} fill className="object-contain p-4 transition-transform group-hover:scale-105 duration-[2s]" priority />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {product.modelUrl && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-luxury border border-white/50 z-20">
                    <button onClick={() => setViewMode('image')} className={`flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'image' ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:text-primary'}`}>
                      <ImageIcon size={14} /> {language === 'th' ? 'แกลเลอรี่' : 'Gallery'}
                    </button>
                    <button onClick={() => setViewMode('3d')} className={`flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === '3d' ? 'bg-accent-gold text-white shadow-lg' : 'text-primary/40 hover:text-accent-gold'}`}>
                      <Rotate3D size={14} /> {language === 'th' ? 'มุมมอง 3D' : '360° View'}
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
            {viewMode === 'image' && productImages.length > 1 && (
              <div className="flex flex-wrap justify-center gap-6 px-4">
                {productImages.map((url, i) => (
                  <button key={i} onClick={() => { setActiveImageIndex(i); setIsAutoPlaying(false); }} className={`w-20 h-20 rounded-2xl border-2 transition-all overflow-hidden ${activeImageIndex === i ? 'border-accent-gold scale-110 shadow-lg' : 'border-neutral-100 opacity-50 hover:opacity-100'}`}>
                    <div className="w-full h-full relative bg-cream-light"><Image src={url} alt="thumb" fill className="object-contain p-2" /></div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex gap-4">
                  {product.isNew && <span className="bg-primary text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">New Arrival</span>}
                  {product.isBest && <span className="bg-accent-gold text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Masterpiece</span>}
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-primary">{product.name}</h1>
                <p className="text-base font-black text-accent-gold uppercase tracking-[0.4em] italic">{product.tagline}</p>
                <div className="text-5xl font-black text-primary pt-6 tracking-tighter">฿{totalPrice.toLocaleString()}</div>
              </div>

              <div className="p-8 bg-neutral-50 rounded-[40px] border border-neutral-100 italic text-secondary leading-relaxed font-medium opacity-80 relative overflow-hidden">
                 <Sparkles className="absolute -right-4 -top-4 text-accent-gold/10" size={80} />
                 {product.description}
              </div>

              {options.length > 0 && (
                <div className="space-y-8 pt-8 border-t border-neutral-100">
                   <div className="flex items-center gap-4">
                      <Sparkles className="text-accent-gold" size={20} />
                      <h3 className="text-xs font-black uppercase tracking-[0.3em]">Signature Selection</h3>
                   </div>
                   <div className="space-y-4">
                      {options.map((opt) => (
                        <button 
                          key={opt.id} 
                          onClick={() => toggleOption(opt.id)}
                          className={`w-full flex items-center justify-between p-6 rounded-[32px] border-2 transition-all duration-500 ${selectedOptions.includes(opt.id) ? 'border-primary bg-primary text-white shadow-luxury scale-[1.02]' : 'border-neutral-50 bg-cream-light/10 hover:border-neutral-200'}`}
                        >
                          <div className="flex items-center gap-6">
                             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOptions.includes(opt.id) ? 'border-white bg-white' : 'border-neutral-200'}`}>
                                {selectedOptions.includes(opt.id) && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                             </div>
                             <span className="text-[11px] font-black uppercase tracking-widest">{opt.name}</span>
                          </div>
                          <span className={`text-[11px] font-black ${selectedOptions.includes(opt.id) ? 'text-accent-gold' : 'text-primary/60'}`}>+ ฿{opt.price_modifier.toLocaleString()}</span>
                        </button>
                      ))}
                   </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-neutral-100">
                 <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-cream-light rounded-2xl flex items-center justify-center mx-auto text-accent-gold"><ShieldCheck size={20} /></div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">1-Year Warranty</span>
                 </div>
                 <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-cream-light rounded-2xl flex items-center justify-center mx-auto text-accent-gold"><Truck size={20} /></div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">Premium Shipping</span>
                 </div>
                 <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-cream-light rounded-2xl flex items-center justify-center mx-auto text-accent-gold"><Star size={20} /></div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">Korean Design</span>
                 </div>
              </div>

              <div className="space-y-8 pt-12 border-t border-neutral-100">
                 <div className="bg-primary text-white p-12 rounded-[56px] shadow-luxury relative overflow-hidden group/concierge">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover/concierge:scale-110 transition-transform duration-1000"></div>
                    <div className="relative z-10 space-y-8">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Official Concierge</h3>
                       <p className="text-sm font-medium text-neutral-300 leading-relaxed">Our curation specialists are available to assist with your bespoke order requirements and technical specifications.</p>
                       <div className="pt-4 flex flex-col gap-4">
                           <a href="https://line.me" target="_blank" className="flex items-center justify-between bg-white text-black p-6 rounded-[32px] hover:bg-accent-gold hover:text-white transition-all duration-700 group/btn">
                              <div className="flex items-center gap-4">
                                 <MessageCircle size={20} />
                                 <span className="font-black uppercase tracking-widest text-[11px]">Chat with Curator</span>
                              </div>
                              <ArrowRight size={18} className="-translate-x-2 opacity-0 group/btn-hover:translate-x-0 group/btn-hover:opacity-100 transition-all" />
                           </a>
                           <Link href="/contact" className="text-center py-4 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 hover:text-accent-gold transition-colors">{language === 'th' ? 'ตัวแทนจำหน่ายอย่างเป็นทางการ' : 'Official Representative Office'}</Link>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
