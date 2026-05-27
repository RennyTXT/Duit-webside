'use client';

import Image from 'next/image';
import { ArrowRight, Sparkles, Newspaper, TrendingUp, Mail, Clock, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { useLanguageStore, translations } from '@/store/useLanguageStore';

const newsItems = [
  {
    id: 1,
    title: 'Duit The Table Plus: ยกระดับประสบการณ์การดูแลสัตว์เลี้ยงผ่าน App Update 2026',
    excerpt: 'สัมผัสวิวัฒนาการล่าสุดของแอปพลิเคชัน Duit The Table Plus ที่ออกแบบมาเพื่อการควบคุมที่แม่นยำและไร้รอยต่อ มอบความสะดวกสบายสูงสุดให้คุณและสัตว์เลี้ยงที่คุณรัก',
    date: '20 MAY 2026',
    category: 'INNOVATION',
    image: 'https://cdn.imweb.me/upload/S201801295a6ea8288a1a1/aab92744b8a85.jpg?w=800'
  },
  {
    id: 2,
    title: 'Duit at Interzoo 2024: เผยแพร่งานดีไซน์เกาหลีสู่เวทีระดับโลก ณ ประเทศเยอรมนี',
    excerpt: 'ความสำเร็จครั้งสำคัญของ Duit ในงานนิทรรศการสัตว์เลี้ยงที่ใหญ่ที่สุดในโลก นำเสนอปรัชญา "Designed for Better Living" ให้กับคนรักสัตว์เลี้ยงทั่วโลกได้รับชม',
    date: '24 MAY 2024',
    category: 'GLOBAL EVENT',
    image: 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=800'
  },
  {
    id: 3,
    title: 'Duit X Megazoo 2024: ก้าวต่อไปของนวัตกรรมอุปกรณ์สัตว์เลี้ยงยุคใหม่',
    excerpt: 'เจาะลึกภาพบรรยากาศการเปิดตัวผลิตภัณฑ์ใหม่ล่าสุดของ Duit ในงาน Megazoo ณ KINTEX ที่ได้รับความสนใจอย่างล้นหลามจากเหล่านักสะสมและผู้เชี่ยวชาญ',
    date: '15 NOV 2024',
    category: 'PRODUCTS',
    image: 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/02c3dd1725fb7.jpg?w=800'
  }
];

export default function NewsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="bg-white min-h-screen pt-20 overflow-x-hidden" ref={containerRef}>
      {/* Editorial Progress Bar */}
      <motion.div 
        style={{ scaleX: progressScale }} 
        className="fixed top-0 left-0 right-0 h-1 bg-accent-gold z-[100] origin-left"
      />

      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
        {/* Header - Editorial Style */}
        <div className="py-24 md:py-40 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end border-b border-neutral-100 mb-24">
           <div className="lg:col-span-8 space-y-8">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-gold block"
              >
                {language === 'th' ? 'สารานุกรมแห่งการอยู่อาศัย' : 'THE LIVING ARCHIVE'}
              </motion.span>
              <h1 className="text-6xl md:text-[120px] font-black tracking-tighter uppercase leading-[0.8] text-primary">
                Duit <br /> <span className="text-accent-gold italic">Journal.</span>
              </h1>
           </div>
           <div className="lg:col-span-4 pb-4">
              <p className="text-lg text-secondary font-medium leading-relaxed opacity-70">
                {language === 'th' 
                  ? 'สำรวจโลกแห่งงานดีไซน์ นวัตกรรม และความรักที่มีต่อสัตว์เลี้ยง ผ่านบทความที่คัดสรรมาอย่างพิถีพิถัน' 
                  : 'Curated narratives on design excellence, avant-garde innovation, and the enduring bond between companion and curator.'}
              </p>
           </div>
        </div>

        {/* Featured Story - Magazine Layout */}
        <div className="mb-40">
           <Link href="/news" className="group grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7 aspect-[16/9] rounded-[64px] overflow-hidden relative shadow-luxury group-hover:shadow-luxury-hover transition-all duration-1000">
                 <Image src={newsItems[0].image} alt="Featured" fill className="object-cover group-hover:scale-105 transition-transform duration-[2s]" />
              </div>
              <div className="lg:col-span-5 space-y-10">
                 <div className="flex items-center gap-6">
                    <span className="px-4 py-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full">{newsItems[0].category}</span>
                    <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">{newsItems[0].date}</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight group-hover:text-accent-gold transition-colors">{newsItems[0].title}</h2>
                 <p className="text-lg text-secondary font-medium opacity-60 leading-relaxed">{newsItems[0].excerpt}</p>
                 <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] group-hover:gap-8 transition-all">
                    READ ARTICLE <ChevronRight size={16} strokeWidth={3} />
                 </div>
              </div>
           </Link>
        </div>

        {/* Secondary Stories - Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-40">
           {newsItems.slice(1).map((news, i) => (
             <motion.div 
               key={news.id} 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.2 }}
               className="group cursor-pointer space-y-10"
             >
                <div className="aspect-[4/3] rounded-[48px] overflow-hidden relative shadow-luxury group-hover:shadow-luxury-hover transition-all duration-1000">
                   <Image src={news.image} alt={news.title} fill className="object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                   <div className="absolute top-8 left-8">
                      <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">{news.category}</span>
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-300 uppercase tracking-widest">
                      <Clock size={12} /> {news.date}
                   </div>
                   <h3 className="text-3xl font-black uppercase tracking-tight leading-tight group-hover:text-accent-gold transition-colors">{news.title}</h3>
                   <p className="text-base text-secondary font-medium opacity-60 leading-relaxed line-clamp-3">{news.excerpt}</p>
                   <div className="w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* High-End Newsletter */}
        <div className="mt-40 bg-neutral-50 rounded-[80px] p-12 md:p-32 relative overflow-hidden border border-neutral-100">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-gold/5 rounded-full blur-[100px]"></div>
          <div className="max-w-3xl mx-auto text-center space-y-16 relative z-10">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-gold">SUBSCRIBE</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-primary">Join the Atelier <br /> <span className="text-accent-gold italic">Circle.</span></h2>
              <p className="text-lg text-secondary font-medium opacity-60 leading-relaxed px-4">
                {language === 'th' 
                  ? 'รับข่าวสารเกี่ยวกับนวัตกรรมและสิทธิประโยชน์พิเศษสำหรับสมาชิก Duit Care+ ส่งตรงถึงคุณ' 
                  : 'Acquire insights on avant-garde innovations and exclusive Duit Care+ privileges delivered to your desk.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 px-4">
              <input type="email" placeholder="Email designation..." className="flex-grow h-20 bg-white border border-neutral-200 rounded-full px-10 text-sm font-bold outline-none focus:border-accent-gold focus:ring-4 ring-accent-gold/5 transition-all" />
              <button className="bg-primary text-white px-12 h-20 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:bg-accent-gold transition-all active:scale-95 shadow-luxury">
                Subscribe
              </button>
            </div>
            <div className="pt-8 flex justify-center items-center gap-12 text-[8px] font-black uppercase tracking-[0.4em] text-neutral-300">
               <span className="flex items-center gap-2"><Sparkles size={10} /> Limited Access</span>
               <span className="flex items-center gap-2"><TrendingUp size={10} /> Design Insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
