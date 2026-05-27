'use client';

import { Product, products as staticProducts } from '@/data/products';
import Product3DViewer from '@/components/Product3DViewer';
import { 
  ChevronRight, 
  Loader2, 
  Image as ImageIcon, 
  Rotate3D, 
  Sparkles, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Star,
  Plus,
  Info,
  CheckCircle2,
  Box,
  Maximize2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguageStore, translations } from '@/store/useLanguageStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'sonner';

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
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const isArchived = (product && isMounted) ? isInWishlist(product.id) : false;

  const handleArchiveToggle = () => {
    if (!product) return;
    if (isArchived) {
      removeItem(product.id);
      toast.error(language === 'th' ? 'นำออกจากคลังสะสมแล้ว' : 'Removed from The Archive');
    } else {
      addItem(product);
      toast.success(language === 'th' ? 'บันทึกลงในคลังสะสมเรียบร้อย' : 'Successfully added to The Archive');
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const fetchProductAndOptions = async () => {
      try {
        const { data: prodData } = await supabase.from('products').select('*').eq('id', id).single();
        const { data: optionsData } = await supabase.from('product_options').select('*').eq('product_id', id);

        if (prodData) {
          const staticProd = staticProducts.find(p => p.id === id);
          
          const allImages = Array.from(new Set([
            prodData.image_url,
            ...(prodData.images || []),
            ...(staticProd?.images || [])
          ])).filter(Boolean) as string[];

          const finalProduct = { 
            ...prodData, 
            image: prodData.image_url || staticProd?.image,
            images: allImages.length > 0 ? allImages : (staticProd?.images || []),
            features: prodData.features || staticProd?.features || [],
            specs: prodData.specs || staticProd?.specs || [],
            modelUrl: prodData.model_url || staticProd?.modelUrl 
          };
          
          setProduct(finalProduct);
          setOptions(optionsData || []);
          
          if (finalProduct.modelUrl && allImages.length === 0) {
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

  // ระบบแปลภาษาแบบ Dynamic (Smart Translation Fallback)
  const localizedInfo = useMemo(() => {
    if (!product) return null;
    
    // พยายามดึงข้อมูลจาก staticProducts ถ้ามีข้อมูลแปลอยู่แล้ว
    const staticInfo = staticProducts.find(p => p.id === id);
    
    // ตารางจับคู่หมวดหมู่
    const categoryMap: Record<string, {th: string, en: string}> = {
      'eat-drink': { th: t.shop.eatDrink, en: 'Eat & Drink' },
      'furniture': { th: t.shop.furniture, en: 'Furniture' },
      'play-rest': { th: t.shop.playRest, en: 'Play & Rest' },
      'hygiene': { th: t.shop.hygiene, en: 'Hygiene' },
      'daily': { th: t.shop.daily, en: 'Daily Essentials' }
    };

    const catInfo = categoryMap[product.category] || { th: product.category, en: product.category };

    return {
      name: language === 'th' ? (staticInfo?.name || product.name) : (staticInfo?.name || product.name),
      tagline: language === 'th' ? (staticInfo?.tagline || product.tagline) : (staticInfo?.tagline || product.tagline),
      description: language === 'th' ? (staticInfo?.description || product.description) : (staticInfo?.description || product.description),
      category: language === 'th' ? catInfo.th : catInfo.en,
      features: product.features || [],
      specs: product.specs || []
    };
  }, [product, language, id, t]);

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]);
  };

  const totalPrice = useMemo(() => {
    return (product?.price || 0) + selectedOptions.reduce((acc, optId) => {
      const option = options.find(o => o.id === optId);
      return acc + (option?.price_modifier || 0);
    }, 0);
  }, [product?.price, selectedOptions, options]);

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F8F6] gap-8">
      <div className="relative">
        <div className="w-20 h-20 border-2 border-primary/10 rounded-full"></div>
        <div className="w-20 h-20 border-t-2 border-primary rounded-full animate-spin absolute inset-0"></div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">
        {language === 'th' ? 'กำลังดึงข้อมูลงานศิลป์...' : 'Synchronizing Atelier Data...'}
      </p>
    </div>
  );

  if (!product || !localizedInfo) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F8F6] p-10 text-center">
      <h1 className="text-8xl md:text-[12rem] font-black text-neutral-100 leading-none mb-8">404</h1>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
        {language === 'th' ? 'ไม่พบข้อมูลชิ้นงาน' : 'Masterpiece Not Found'}
      </p>
      <Link href="/shop" className="mt-12 px-10 py-4 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent-gold transition-all">
        {language === 'th' ? 'กลับไปยังคอลเลกชัน' : 'Back to Collection'}
      </Link>
    </div>
  );

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image || "/placeholder-product.png"];
  const currentMainImage = productImages[activeImageIndex];

  return (
    <div className="bg-[#F9F8F6] min-h-screen relative selection:bg-accent-gold/30">
      <div className="grain-overlay"></div>

      {/* Navigation Breadcrumb */}
      <nav className="max-w-[1800px] mx-auto w-full px-6 md:px-12 lg:px-20 py-12 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-neutral-300 relative z-10">
        <Link href="/" className="hover:text-primary transition-colors">{language === 'th' ? 'หน้าหลัก' : 'Atelier'}</Link>
        <ChevronRight size={10} className="text-neutral-200" />
        <Link href="/shop" className="hover:text-primary transition-colors">{language === 'th' ? 'คอลเลกชัน' : 'Collection'}</Link>
        <ChevronRight size={10} className="text-neutral-200" />
        <span className="text-primary truncate">{localizedInfo.name}</span>
      </nav>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 pb-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">
          
          {/* LEFT: GALLERY SECTION */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-8">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[700px] py-2">
              {productImages.map((url, i) => (
                <button 
                  key={i} 
                  onClick={() => { setActiveImageIndex(i); setViewMode('image'); }}
                  className={`relative w-20 h-20 md:w-24 md:h-24 rounded-3xl border transition-all duration-500 overflow-hidden shrink-0 ${activeImageIndex === i && viewMode === 'image' ? 'border-accent-gold shadow-luxury-sm scale-105' : 'border-neutral-100 opacity-60 hover:opacity-100 hover:border-neutral-200'}`}
                >
                  <Image src={url} alt={`View ${i}`} fill className="object-contain p-3 bg-white" />
                </button>
              ))}
              {product.modelUrl && (
                <button 
                  onClick={() => setViewMode('3d')}
                  className={`relative w-20 h-20 md:w-24 md:h-24 rounded-3xl border transition-all duration-500 flex flex-col items-center justify-center gap-2 shrink-0 ${viewMode === '3d' ? 'border-accent-gold bg-accent-gold text-white shadow-luxury-sm' : 'border-neutral-100 bg-white text-primary/40 hover:text-primary hover:border-neutral-200'}`}
                >
                  <Rotate3D size={24} />
                  <span className="text-[8px] font-black uppercase tracking-widest">3D</span>
                </button>
              )}
            </div>

            <div className="flex-grow">
              <div className="relative aspect-[4/5] md:aspect-square bg-white rounded-[48px] md:rounded-[64px] border border-neutral-100 shadow-luxury overflow-hidden group">
                <AnimatePresence mode="wait">
                  {viewMode === '3d' && product.modelUrl ? (
                    <motion.div 
                      key="3d" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      className="w-full h-full relative cursor-grab active:cursor-grabbing"
                    >
                      <Product3DViewer modelUrl={product.modelUrl} altText={localizedInfo.name} />
                      <div className="absolute top-10 right-10 pointer-events-none">
                         <div className="bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 flex items-center gap-3">
                            <Rotate3D className="text-accent-gold animate-spin-slow" size={18} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">{language === 'th' ? 'หมุนได้ 360°' : 'Interactive 360°'}</span>
                         </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key={activeImageIndex} 
                      initial={{ opacity: 0, scale: 1.05 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full relative"
                    >
                      <Image 
                        src={currentMainImage} 
                        alt={localizedInfo.name} 
                        fill 
                        className="object-contain p-12 md:p-20 transition-transform duration-1000 group-hover:scale-105" 
                        priority 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO SECTION */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-4">
                {product.isNew && (
                  <span className="bg-primary text-white text-[8px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] shadow-luxury-sm">New Era</span>
                )}
                {product.isBest && (
                  <span className="bg-accent-gold text-white text-[8px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] shadow-luxury-sm">Masterpiece</span>
                )}
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">{localizedInfo.category}</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-primary break-words">
                  {localizedInfo.name}
                </h1>
                <p className="text-sm md:text-base font-black text-accent-gold uppercase tracking-[0.5em] italic opacity-80">
                  {localizedInfo.tagline}
                </p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl md:text-6xl font-black text-primary tracking-tighter">
                  ฿{totalPrice.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">{language === 'th' ? 'รวมภาษีมูลค่าเพิ่มแล้ว' : 'Inclusive of taxes'}</span>
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localizedInfo.features?.slice(0, 4).map((feature, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-neutral-100/50">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{feature}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-8">
              <button className="w-full h-20 bg-primary text-white rounded-[32px] font-black uppercase tracking-[0.3em] text-[11px] shadow-luxury flex items-center justify-center gap-4 group relative overflow-hidden active:scale-95 transition-all duration-500">
                <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                <span className="relative z-10">{language === 'th' ? 'สอบถามข้อมูลการสั่งซื้อ' : 'Inquire to Order'}</span>
                <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-2" />
              </button>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleArchiveToggle}
                  className={`flex-grow h-16 border rounded-[28px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isArchived ? 'bg-accent-gold border-accent-gold text-white shadow-luxury' : 'bg-white border-neutral-100 text-primary hover:border-primary'}`}
                >
                  <Star size={16} fill={isArchived ? "currentColor" : "none"} /> 
                  {isArchived ? (language === 'th' ? 'บันทึกในคลังแล้ว' : 'Archived Masterpiece') : (language === 'th' ? 'บันทึกลงในคลัง' : 'Save to Archive')}
                </button>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="pt-12 border-t border-neutral-100 space-y-8">
              <div className="flex items-center gap-4">
                <Sparkles className="text-accent-gold" size={18} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">{language === 'th' ? 'ปรัชญาและวัสดุ' : 'Philosophy & Material'}</h3>
              </div>
              <p className="text-sm md:text-base text-secondary leading-[1.8] font-medium opacity-70">
                {localizedInfo.description}
              </p>
              
              {/* Specs Table */}
              {localizedInfo.specs && localizedInfo.specs.length > 0 && (
                <div className="bg-white/30 rounded-3xl border border-neutral-100 p-8 space-y-6">
                  {localizedInfo.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-neutral-100 last:border-0">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{spec.label}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- IMMERSIVE STORYTELLING SECTION --- */}
        <div className="mt-40 md:mt-60 space-y-40">
           <div className="text-center space-y-8 max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-accent-gold/40"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-accent-gold">{language === 'th' ? 'มุมมองอย่างละเอียด' : 'Close-up Perspective'}</span>
                <div className="h-px w-12 bg-accent-gold/40"></div>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-primary leading-tight">
                {language === 'th' ? 'ศิลปะแห่งการ' : 'The Art of'} <span className="text-luxury-gradient italic">{language === 'th' ? 'ประณีตศิลป์' : 'Craftsmanship'}</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-lg text-secondary font-medium leading-relaxed">
                {language === 'th' 
                  ? 'ทุกองศา ทุกส่วนโค้ง และทุกวัสดุถูกคัดสรรด้วยความแม่นยำทางสถาปัตยกรรม เพื่อมอบคุณค่าด้านความงามที่ยั่งยืนและความสะดวกสบายที่ไม่มีใครเทียบได้' 
                  : 'Every angle, every curve, and every material is selected with architectural precision to ensure a lifetime of aesthetic value and unparalleled comfort.'}
              </motion.p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="md:col-span-8 aspect-[16/9] md:aspect-[4/3] relative rounded-[40px] md:rounded-[64px] overflow-hidden group shadow-luxury">
                <Image src={productImages[1] || productImages[0]} alt="Detail Focus" fill className="object-cover transition-transform duration-[2s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 flex items-end p-12">
                   <p className="text-white text-xs font-black uppercase tracking-[0.4em]">{language === 'th' ? 'ความสมบูรณ์ของวัสดุ' : 'Material Integrity'}</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="md:col-span-4 aspect-square relative rounded-[40px] md:rounded-[56px] overflow-hidden shadow-luxury">
                <Image src={productImages[2] || productImages[0]} alt="Detail Focus" fill className="object-cover" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-12 h-[300px] md:h-[500px] relative rounded-[40px] md:rounded-[64px] overflow-hidden shadow-luxury-hover group">
                 <Image src={productImages[3] || productImages[0]} alt="Atmosphere" fill className="object-cover brightness-90 group-hover:brightness-100 transition-all duration-1000" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 md:p-16 rounded-[48px] text-center space-y-4 max-w-lg mx-6">
                      <Sparkles className="text-accent-gold mx-auto" size={24} />
                      <h3 className="text-white text-2xl font-black uppercase tracking-widest leading-none">{language === 'th' ? 'ความกลมกลืน' : 'Seamless'} <br /> {language === 'th' ? 'ที่ไร้รอยต่อ' : 'Adaptation'}</h3>
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        {language === 'th' ? 'ออกแบบมาเพื่อให้กลมกลืนกับพื้นที่สถาปัตยกรรมร่วมสมัยได้อย่างง่ายดาย' : 'Designed to blend effortlessly into any contemporary architectural space.'}
                      </p>
                   </div>
                </div>
              </motion.div>
           </div>
        </div>
      </div>
    </div>
  );
}
