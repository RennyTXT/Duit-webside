'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Box, History, Globe, Sparkles, PenTool, Layout, CheckCircle2 } from 'lucide-react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguageStore, translations } from '@/store/useLanguageStore';

const BlueprintSVG = () => (
  <svg className="absolute inset-0 w-full h-full text-accent-gold/10 pointer-events-none" viewBox="0 0 100 100" fill="none">
    <motion.path 
      d="M 10,10 L 90,10 M 10,30 L 90,30 M 10,50 L 90,50 M 10,70 L 90,70 M 10,90 L 90,90 M 30,10 L 30,90 M 50,10 L 50,90 M 70,10 L 70,90" 
      stroke="currentColor" strokeWidth="0.1" 
      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}
    />
    <motion.circle 
      cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.2"
      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }}
    />
  </svg>
);

export default function AboutPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const headingY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <div className="bg-white min-h-screen pt-20 overflow-x-hidden" ref={containerRef}>
      {/* 1. Editorial Hero */}
      <section className="relative h-[90vh] flex items-center justify-center bg-[#faf7f2] overflow-hidden">
        <BlueprintSVG />
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-20 text-center relative z-10">
          <motion.div style={{ y: headingY, opacity }}>
            <motion.span 
              initial={{ opacity: 0, letterSpacing: "1em" }}
              animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 1.5 }}
              className="block text-[10px] font-black uppercase text-accent-gold mb-12"
            >
              {language === 'th' ? 'สถาบันการออกแบบระดับสากล' : 'THE GLOBAL DESIGN ATELIER'}
            </motion.span>
            <h1 className="text-6xl md:text-[140px] font-black leading-[0.8] tracking-tighter uppercase text-primary">
              Design <br /> <span className="text-accent-gold italic">Integrity.</span>
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1, duration: 1.5 }}
              className="mt-16 max-w-xl mx-auto text-lg font-medium text-secondary leading-relaxed"
            >
              {language === 'th' 
                ? 'ความงามที่สร้างขึ้นจากการวิเคราะห์เชิงลึก เพื่อความสมบูรณ์แบบในการใช้ชีวิตของสัตว์เลี้ยงยุคใหม่' 
                : 'Aesthetic precision forged through rigorous analysis, defining the standard for modern pet living.'}
            </motion.p>
          </motion.div>
        </div>
        
        {/* Floating Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-neutral-300">SCROLL STORY</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-neutral-200 to-transparent"></div>
        </motion.div>
      </section>

      {/* 2. Asymmetric Storytelling Section */}
      <section className="py-40 md:py-60 px-6 md:px-20">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
           <div className="lg:col-span-5 space-y-16">
              <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-px w-12 bg-accent-gold"></div>
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Philosophy 01</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight text-primary">
                  {language === 'th' ? 'ออกแบบเพื่อคุณและ' : 'Designed for You'} <br /> <span className="italic text-accent-gold">{language === 'th' ? 'เพื่อนคนสำคัญ' : '& Your Pets.'}</span>
                </h2>
                <p className="mt-12 text-lg text-secondary font-medium leading-relaxed opacity-70">
                  {language === 'th' 
                    ? 'หัวใจสำคัญของ Duit คือการสร้างสภาพแวดล้อมที่กลมกลืน ซึ่งความต้องการของทั้งเจ้าของและสัตว์เลี้ยงได้รับการตอบสนองผ่านงานดีไซน์ที่ผ่านการคิดค้นมาอย่างถี่ถ้วน' 
                    : 'The core philosophy of Duit focuses on creating a harmonious living environment where the needs of both the owner and the pet are met through thoughtful design.'}
                </p>
              </motion.div>
              
              <div className="grid grid-cols-2 gap-8">
                 <div className="p-10 rounded-[40px] bg-neutral-50 border border-neutral-100 space-y-4">
                    <Layout className="text-accent-gold" size={24} />
                    <h4 className="font-black uppercase text-xs tracking-widest">Duit Design Lab</h4>
                    <p className="text-[10px] font-bold text-neutral-400">Headquarters in Seoul, Korea</p>
                 </div>
                 <div className="p-10 rounded-[40px] bg-neutral-50 border border-neutral-100 space-y-4">
                    <PenTool className="text-accent-gold" size={24} />
                    <h4 className="font-black uppercase text-xs tracking-widest">Hand-Crafted</h4>
                    <p className="text-[10px] font-bold text-neutral-400">Precision in Every Line</p>
                 </div>
              </div>
           </div>
           
           <div className="lg:col-span-7">
              <motion.div 
                initial={{ scale: 1.1, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="aspect-[16/10] rounded-[64px] overflow-hidden relative shadow-luxury"
              >
                 <Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/1eff7a9ff2bb1.jpg?w=1440" alt="About Duit" fill className="object-cover hover:scale-105 transition-transform duration-[2s]" />
              </motion.div>
           </div>
        </div>
      </section>

      {/* 3. Material Showcase (Editorial) */}
      <section className="py-40 bg-primary text-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="order-2 lg:order-1 relative">
             <motion.div 
               initial={{ x: -100, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1.2 }}
               className="aspect-[4/5] rounded-[64px] overflow-hidden relative z-10 shadow-2xl"
             >
                <Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=800" alt="Material" fill className="object-cover" />
             </motion.div>
             <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-accent-gold/20 rounded-full blur-[100px]"></div>
          </div>
          <div className="order-1 lg:order-2 space-y-16">
             <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-gold mb-8 block">Quality 02</span>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-12">
                   Medical <br /> <span className="text-accent-gold italic">Grade.</span>
                </h2>
                <p className="text-xl text-neutral-400 font-medium leading-relaxed opacity-80">
                   {language === 'th' 
                    ? 'เพราะความปลอดภัยคือสิ่งสำคัญที่สุด เราเลือกใช้สแตนเลส 304L และวัสดุเกรดการแพทย์ที่ทนทานต่อแบคทีเรีย เพื่อสุขภาพที่ดีของเพื่อนตัวน้อยในระยะยาว' 
                    : 'Safety is our absolute priority. We utilize 304L stainless steel and bio-inert medical-grade materials to ensure long-term well-being.'}
                </p>
                <div className="pt-12 grid grid-cols-1 gap-6">
                   {['BPA Free', 'Food Safe Cert', 'Eco-Conscious Packaging'].map((item) => (
                     <div key={item} className="flex items-center gap-6 group">
                        <CheckCircle2 className="text-accent-gold opacity-40 group-hover:opacity-100 transition-opacity" size={20} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">{item}</span>
                     </div>
                   ))}
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Global Vision */}
      <section className="py-60 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-16">
           <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
              <Globe className="text-accent-gold mx-auto mb-12" size={64} strokeWidth={1} />
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-primary leading-none">
                 Global <br /> <span className="text-accent-gold italic">Visionary.</span>
              </h2>
           </motion.div>
           <p className="text-xl text-secondary font-medium leading-relaxed max-w-2xl mx-auto opacity-70">
              {language === 'th' 
                ? 'จากจุดเริ่มต้นในโซล สู่ความรักความผูกพันในไทย Duit Thailand พร้อมส่งต่อคุณภาพชีวิตที่ดีให้กับทุกครอบครัว' 
                : 'From our origins in Seoul to our heartbeat in Thailand, Duit is committed to elevating pet living globally.'}
           </p>
           <Link href="/shop" className="group relative inline-flex items-center gap-6 px-16 py-8 rounded-full border border-neutral-100 bg-white shadow-luxury hover:bg-primary hover:text-white transition-all duration-700 active:scale-95">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t.hero.discover}</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
           </Link>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-neutral-50/50 pointer-events-none select-none -z-10 font-black text-[30vw] uppercase opacity-20">SEOUL</div>
      </section>
    </div>
  );
}
