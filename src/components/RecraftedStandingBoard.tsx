'use client';

import { motion } from 'framer-motion';
import { Sparkles, Maximize2, ShieldCheck, Heart } from 'lucide-react';
import Image from 'next/image';

const RecraftedStandingBoard = () => {
  return (
    <div className="space-y-40 py-20 bg-white rounded-[64px] border border-neutral-100 shadow-sm overflow-hidden">
      {/* SECTION 1: THE CONCEPT */}
      <section className="px-12 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-10">
          <div className="space-y-4">
             <span className="text-xs uppercase tracking-[0.4em] text-accent-gold font-bold">The Successor</span>
             <h2 className="text-4xl md:text-6xl tracking-tighter text-primary uppercase leading-none">ความภูมิใจใหม่ <br /> <span className="text-secondary italic">แห่งการพักผ่อน.</span></h2>
          </div>
          <p className="text-lg text-secondary leading-relaxed font-medium opacity-70">
            Duit Standing Board คือวิวัฒนาการขั้นกว่าของ All Day Board ที่ครองใจเหล่านักออกแบบ 
            เราผสานสถาปัตยกรรมแนวตั้งเข้ากับสรีระตามธรรมชาติของแมว เพื่อปกป้องเฟอร์นิเจอร์ชิ้นโปรดของคุณ
            และมอบพื้นที่ลับส่วนตัวที่สง่างามที่สุด
          </p>
          <div className="flex gap-12 border-t border-neutral-100 pt-10">
             <div className="space-y-2">
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400">Vertical Design</span>
                <span className="text-xl text-primary uppercase tracking-tighter font-bold">90° Comfort</span>
             </div>
             <div className="space-y-2">
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400">Material</span>
                <span className="text-xl text-primary uppercase tracking-tighter font-bold">Natural Kraft</span>
             </div>
          </div>
        </div>
        <div className="relative aspect-square rounded-[48px] overflow-hidden shadow-luxury">
           <Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/c9f28df13b2e5.jpg" alt="Concept" fill className="object-cover" />
        </div>
      </section>

      {/* SECTION 2: THE ANGLE */}
      <section className="bg-[#f9f8f6] py-32 px-12 md:px-24">
         <div className="max-w-4xl mx-auto text-center space-y-16">
            <div className="space-y-6">
               <Maximize2 className="mx-auto text-accent-gold" size={32} strokeWidth={1} />
               <h2 className="text-3xl md:text-5xl uppercase tracking-tighter">มุมมองที่ <span className="italic text-secondary">แตกต่าง.</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                     <span className="text-accent-gold font-bold">01</span>
                  </div>
                  <h4 className="text-xs uppercase tracking-widest font-bold">ป้องกันเฟอร์นิเจอร์</h4>
                  <p className="text-[11px] text-secondary leading-relaxed opacity-70 uppercase">Vertical scratching saves your sofa.</p>
               </div>
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                     <span className="text-accent-gold font-bold">02</span>
                  </div>
                  <h4 className="text-xs uppercase tracking-widest font-bold">ยืดเหยียดเต็มตัว</h4>
                  <p className="text-[11px] text-secondary leading-relaxed opacity-70 uppercase">Full body stretch for better health.</p>
               </div>
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                     <span className="text-accent-gold font-bold">03</span>
                  </div>
                  <h4 className="text-xs uppercase tracking-widest font-bold">โครงสร้างแข็งแรง</h4>
                  <p className="text-[11px] text-secondary leading-relaxed opacity-70 uppercase">Sturdy and stable construction.</p>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 3: THE MATERIAL */}
      <section className="px-12 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="order-2 lg:order-1 relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-luxury">
           <Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/8282367d30f30.jpg" alt="Material" fill className="object-cover" />
        </div>
        <div className="order-1 lg:order-2 space-y-10">
          <div className="space-y-4">
             <ShieldCheck className="text-accent-gold" size={32} strokeWidth={1} />
             <h2 className="text-4xl md:text-6xl tracking-tighter text-primary uppercase leading-none">สัมผัสจาก <br /> <span className="text-secondary italic">ธรรมชาติ.</span></h2>
          </div>
          <p className="text-lg text-secondary leading-relaxed font-medium opacity-70">
            เราคัดสรรกระดาษคราฟท์เกรดพรีเมียมที่มีความหนาแน่นสูงเป็นพิเศษ 
            เพื่อเลียนแบบผิวสัมผัสของเปลือกไม้ตามธรรมชาติ ช่วยให้น้องแมวได้ลับเล็บอย่างมีความสุข 
            โดยไม่เกิดเศษผงฟุ้งกระจาย รักษาสุขอนามัยใน Atelier ของคุณ
          </p>
          <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-100 flex items-center gap-6">
             <Heart className="text-red-400 fill-red-400/10" size={24} />
             <span className="text-xs uppercase tracking-widest font-bold">Safe for sensitive paws</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecraftedStandingBoard;
