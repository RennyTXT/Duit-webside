'use client';

import Image from 'next/image';
import { ArrowRight, Sparkles, Newspaper, TrendingUp, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const newsItems = [
  {
    id: 1,
    title: 'Duit Design Lab เปิดตัวอย่างเป็นทางการในประเทศไทย',
    excerpt: 'นำที่สุดของงานดีไซน์อุปกรณ์สัตว์เลี้ยงจากเกาหลีมาสู่ใจกลางคนรักสัตว์เลี้ยงชาวไทย พร้อมเปิดตัวคอลเลกชันปี 2026',
    date: '20 MAY 2026',
    category: 'BRAND NEWS',
    image: 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=800'
  },
  {
    id: 2,
    title: 'ทำไมการจำลองแบบ 3D ถึงสำคัญต่อเจ้าของสัตว์เลี้ยง',
    excerpt: 'สำรวจระบบ 3D Product Viewer ใหม่ของเรา และวิธีที่ช่วยให้คุณเลือกสิ่งที่เหมาะสมที่สุดสำหรับบ้านของคุณได้อย่างแม่นยำ',
    date: '15 MAY 2026',
    category: 'INNOVATION',
    image: 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/02c3dd1725fb7.jpg?w=800'
  },
  {
    id: 3,
    title: 'The Table Plus: นิยามใหม่ของการให้อาหารที่แม่นยำ',
    excerpt: 'เจาะลึกเครื่องให้อาหารอัตโนมัติรุ่นล่าสุดของเราและประโยชน์ต่อสุขภาพสำหรับสัตว์เลี้ยงของคุณในระยะยาว',
    date: '10 MAY 2026',
    category: 'PRODUCTS',
    image: 'https://cdn.imweb.me/upload/S201801295a6ea8288a1a1/aab92744b8a85.jpg?w=800'
  }
];

export default function NewsPage() {
  return (
    <div className="bg-white min-h-screen pt-20 pb-32">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
        <div className="text-center py-24 space-y-6">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black tracking-ultra rounded-full uppercase">Duit Journal</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-tight">Latest News</h1>
          <p className="max-w-2xl mx-auto text-lg text-secondary font-medium leading-relaxed">
            ติดตามนวัตกรรมล่าสุด กิจกรรมพิเศษ และเคล็ดลับจากผู้เชี่ยวชาญเพื่อการดูแลสัตว์เลี้ยงที่คุณรักอย่างมืออาชีพ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {newsItems.map((news, i) => (
            <motion.div 
              key={news.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/11] bg-neutral-50 rounded-[40px] overflow-hidden mb-10 relative border border-neutral-100 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                <Image 
                  src={news.image} 
                  alt={news.title} 
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-ultra shadow-lg">
                  {news.category}
                </div>
              </div>
              <div className="space-y-5 px-4">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-ultra text-neutral-400">
                  <Newspaper size={12} className="text-accent" />
                  {news.date}
                </div>
                <h3 className="text-2xl font-bold tracking-tight uppercase leading-snug group-hover:text-accent transition-colors duration-300">{news.title}</h3>
                <p className="text-base text-secondary leading-relaxed line-clamp-2 font-medium">{news.excerpt}</p>
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-ultra pt-4 group-hover:gap-6 transition-all duration-300 text-primary">
                  Read More <ArrowRight size={16} strokeWidth={2.5} className="text-accent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-40 bg-primary text-white rounded-[64px] p-12 md:p-32 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-accent/5 -skew-y-6 translate-y-24 group-hover:translate-y-12 transition-transform duration-[2s]"></div>
          <div className="relative z-10 space-y-12">
            <div className="w-20 h-20 bg-accent/20 rounded-3xl flex items-center justify-center mx-auto text-accent mb-8 shadow-2xl shadow-accent/20 transform group-hover:rotate-12 transition-transform duration-500">
              <Sparkles size={40} strokeWidth={1.5} />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">Join the Duit Family</h2>
              <p className="max-w-xl mx-auto text-lg text-neutral-400 font-medium leading-relaxed">
                สมัครรับข่าวสารเพื่อรับสิทธิ์เข้าถึงคอลเลกชันใหม่ก่อนใคร พร้อมโปรโมชันสุดพิเศษและสาระดีๆ ส่งตรงถึงกล่องข้อความของคุณ
              </p>
            </div>
            <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-5">
              <div className="flex-grow relative group/input">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within/input:text-accent transition-colors" size={20} />
                <input type="email" placeholder="Enter your email address" className="w-full h-16 bg-white/5 border border-white/10 rounded-full pl-16 pr-8 text-sm font-bold outline-none focus:ring-4 ring-accent/10 focus:border-accent transition-all" />
              </div>
              <button className="bg-white text-black px-12 h-16 rounded-full text-sm font-black uppercase tracking-ultra hover:bg-accent hover:text-white transition-all shadow-2xl active:scale-95 duration-300">
                Subscribe Now
              </button>
            </div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest pt-4 font-bold opacity-50 italic flex items-center justify-center gap-2">
              <TrendingUp size={12} /> Trusted by 50,000+ Pet Lovers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
