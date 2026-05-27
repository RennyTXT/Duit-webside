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
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const isArchived = product ? isInWishlist(product.id) : false;

  const handleArchiveToggle = () => {
    if (!product) return;
    if (isArchived) {
      removeItem(product.id);
      toast.error('Removed from The Archive');
    } else {
      addItem(product);
      toast.success('Successfully added to The Archive');
    }
  };

  useEffect(() => {
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
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">Synchronizing Atelier Data...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F8F6] p-10 text-center">
      <h1 className="text-8xl md:text-[12rem] font-black text-neutral-100 leading-none mb-8">404</h1>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Masterpiece Not Found</p>
      <Link href="/shop" className="mt-12 px-10 py-4 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent-gold transition-all">
        Back to Collection
      </Link>
    </div>
  );

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image || "/placeholder-product.png"];
  const currentMainImage = productImages[activeImageIndex];

  return (
    <div className="bg-[#F9F8F6] min-h-screen relative selection:bg-accent-gold/30">
      {/* Background Texture */}
      <div className="grain-overlay"></div>

      {/* Navigation Breadcrumb */}
      <nav className="max-w-[1800px] mx-auto w-full px-6 md:px-12 lg:px-20 py-12 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-neutral-300 relative z-10">
        <Link href="/" className="hover:text-primary transition-colors">Atelier</Link>
        <ChevronRight size={10} className="text-neutral-200" />
        <Link href="/shop" className="hover:text-primary transition-colors">Collection</Link>
        <ChevronRight size={10} className="text-neutral-200" />
        <span className="text-primary truncate">{product.name}</span>
      </nav>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 pb-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">
          
          {/* LEFT: GALLERY SECTION */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-8">
            {/* Thumbnails */}
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

            {/* Main Viewport */}
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
                      <Product3DViewer modelUrl={product.modelUrl} altText={product.name} />
                      <div className="absolute top-10 right-10 pointer-events-none">
                         <div className="bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 flex items-center gap-3">
                            <Rotate3D className="text-accent-gold animate-spin-slow" size={18} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Interactive 360°</span>
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
                        alt={product.name} 
                        fill 
                        className="object-contain p-12 md:p-20 transition-transform duration-1000 group-hover:scale-105" 
                        priority 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* View Controls */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-white/40 backdrop-blur-xl border border-white/40 rounded-full shadow-luxury opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                   <button onClick={() => setViewMode('image')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${viewMode === 'image' ? 'bg-primary text-white' : 'text-primary/40 hover:text-primary hover:bg-white/50'}`}>
                      <ImageIcon size={18} />
                   </button>
                   <div className="w-[1px] h-4 bg-primary/10"></div>
                   <button onClick={() => { /* Open Fullscreen Logic */ }} className="w-10 h-10 rounded-full flex items-center justify-center text-primary/40 hover:text-primary hover:bg-white/50 transition-all">
                      <Maximize2 size={18} />
                   </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO SECTION */}
          <div className="lg:col-span-5 space-y-12">
            {/* Essential Info */}
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-4">
                {product.isNew && (
                  <span className="bg-primary text-white text-[8px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] shadow-luxury-sm">New Era</span>
                )}
                {product.isBest && (
                  <span className="bg-accent-gold text-white text-[8px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] shadow-luxury-sm">Masterpiece</span>
                )}
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">{product.category}</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-primary break-words">
                  {product.name}
                </h1>
                <p className="text-sm md:text-base font-black text-accent-gold uppercase tracking-[0.5em] italic opacity-80">
                  {product.tagline}
                </p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl md:text-6xl font-black text-primary tracking-tighter">
                  ฿{totalPrice.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Inclusive of taxes</span>
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features?.slice(0, 4).map((feature, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-neutral-100/50">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{feature}</span>
                </div>
              ))}
            </div>

            {/* Options Selection */}
            {options.length > 0 && (
              <div className="space-y-6 pt-12 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Box className="text-accent-gold" size={18} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Configuration</h3>
                  </div>
                  <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">Selection Required</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {options.map((opt) => (
                    <button 
                      key={opt.id} 
                      onClick={() => toggleOption(opt.id)}
                      className={`group relative flex items-center justify-between p-6 rounded-3xl border transition-all duration-500 ${selectedOptions.includes(opt.id) ? 'border-primary bg-primary text-white shadow-luxury scale-[1.01]' : 'border-neutral-100 bg-white hover:border-accent-gold hover:shadow-luxury-sm'}`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedOptions.includes(opt.id) ? 'border-white bg-white' : 'border-neutral-200 group-hover:border-accent-gold'}`}>
                          {selectedOptions.includes(opt.id) && <div className="w-2.5 h-2.5 bg-primary rounded-full animate-scale-up" />}
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest">{opt.name}</span>
                      </div>
                      <span className={`text-[10px] font-black ${selectedOptions.includes(opt.id) ? 'text-accent-gold' : 'text-primary/40'}`}>+ ฿{opt.price_modifier.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4 pt-8">
              <button className="w-full h-20 bg-primary text-white rounded-[32px] font-black uppercase tracking-[0.3em] text-[11px] shadow-luxury flex items-center justify-center gap-4 group relative overflow-hidden active:scale-95 transition-all duration-500">
                <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                <span className="relative z-10">Inquire to Order</span>
                <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-2" />
              </button>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleArchiveToggle}
                  className={`flex-grow h-16 border rounded-[28px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isArchived ? 'bg-accent-gold border-accent-gold text-white shadow-luxury' : 'bg-white border-neutral-100 text-primary hover:border-primary'}`}
                >
                  <Star size={16} fill={isArchived ? "currentColor" : "none"} /> 
                  {isArchived ? 'Archived Masterpiece' : 'Save to Archive'}
                </button>
                <button className="w-16 h-16 bg-white border border-neutral-100 rounded-[28px] flex items-center justify-center text-primary hover:text-accent-gold hover:border-accent-gold transition-all">
                  <Info size={18} />
                </button>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="pt-12 border-t border-neutral-100 space-y-8">
              <div className="flex items-center gap-4">
                <Sparkles className="text-accent-gold" size={18} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Philosophy & Material</h3>
              </div>
              <p className="text-sm md:text-base text-secondary leading-[1.8] font-medium opacity-70">
                {product.description}
              </p>
              
              {/* Specs Table */}
              {product.specs && product.specs.length > 0 && (
                <div className="bg-white/30 rounded-3xl border border-neutral-100 p-8 space-y-6">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-neutral-100 last:border-0">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{spec.label}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service & Concierge */}
            <div className="pt-12 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-accent-gold shadow-sm"><ShieldCheck size={18} /></div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest">Quality Assurance</h4>
                  <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-tight">One-year structural warranty</p>
               </div>
               <div className="space-y-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-accent-gold shadow-sm"><Truck size={18} /></div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest">Global Logistics</h4>
                  <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-tight">White-glove delivery service</p>
               </div>
               <div className="space-y-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-accent-gold shadow-sm"><MessageCircle size={18} /></div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest">Artisan Support</h4>
                  <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-tight">Direct access to curation team</p>
               </div>
            </div>

            {/* Contact Concierge */}
            <div className="bg-primary text-white p-10 md:p-14 rounded-[56px] shadow-luxury relative overflow-hidden group/concierge mt-12">
               <div className="absolute top-0 right-0 w-80 h-80 bg-accent-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover/concierge:scale-125 transition-transform duration-[2s]"></div>
               <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] w-8 bg-accent-gold/40"></div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Official Curation</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight">
                      Bespoke Consulting <br /> & Global Heritage
                    </p>
                    <p className="text-sm font-medium text-neutral-400 leading-relaxed max-w-sm">
                      Our curators provide personalized guidance for integrating Duit artifacts into your architectural space.
                    </p>
                  </div>
                  <a href="https://line.me" target="_blank" className="flex items-center justify-between bg-white text-black p-6 rounded-[32px] hover:bg-accent-gold hover:text-white transition-all duration-700 group/btn">
                     <div className="flex items-center gap-4">
                        <MessageCircle size={20} className="text-primary group-hover/btn:text-white transition-colors" />
                        <span className="font-black uppercase tracking-widest text-[11px]">Chat with Specialist</span>
                     </div>
                     <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                  </a>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
