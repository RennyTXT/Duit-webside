'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Box, History, Globe } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Brand Hero */}
      <section className="py-24 border-b border-neutral-100 bg-neutral-50/50">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black tracking-ultra rounded-full mb-8 uppercase"
          >
            เรื่องราวของเรา
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter uppercase mb-12 leading-[0.9]"
          >
            DESIGNED <br />
            <span className="text-neutral-300">FOR YOU &</span> <br />
            YOUR PETS.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-xl text-secondary leading-relaxed font-medium"
          >
            Duit Design Lab คือแบรนด์อุปกรณ์สัตว์เลี้ยงระดับพรีเมียมที่เชื่อในความกลมกลืนที่สมบูรณ์แบบระหว่างชีวิตมนุษย์สมัยใหม่และความสะดวกสบายของสัตว์เลี้ยง
          </motion.p>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className="py-32">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center text-accent">
                <Box size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">ความกลมกลืน <br /><span className="text-accent italic">Harmony.</span></h2>
              <p className="text-lg text-secondary leading-relaxed font-medium">
                เราออกแบบผลิตภัณฑ์ที่ไม่ใช่แค่ตั้งอยู่ในบ้านของคุณ แต่เป็นส่วนหนึ่งของบ้าน สไตล์ของเราคือความมินิมอล สะอาดตา และทันสมัย เพื่อให้มั่นใจว่าเฟอร์นิเจอร์ของสัตว์เลี้ยงจะช่วยเสริมการออกแบบตกแต่งภายในของคุณ
              </p>
              <div className="aspect-square bg-neutral-50 rounded-[48px] overflow-hidden relative border border-neutral-100 shadow-2xl">
                <Image 
                  src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=800" 
                  alt="Duit Harmony Philosophy"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105" 
                />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:pt-40 space-y-10"
            >
              <div className="aspect-[4/5] bg-neutral-50 rounded-[48px] overflow-hidden mb-12 relative border border-neutral-100 shadow-2xl">
                <Image 
                  src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/02c3dd1725fb7.jpg?w=800" 
                  alt="Duit Evolution Philosophy"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105" 
                />
              </div>
              <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center text-accent">
                <History size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">วิวัฒนาการ <br /><span className="text-accent italic">Evolution.</span></h2>
              <p className="text-lg text-secondary leading-relaxed font-medium">
                ด้วยการบูรณาการเทคโนโลยีอัจฉริยะและการออกแบบตามหลักสรีรศาสตร์ เรากำลังพัฒนารูปแบบการดูแลสัตว์เลี้ยงของเรา ตั้งแต่ถังขยะไร้สัมผัสไปจนด้วยเครื่องให้อาหารอัตโนมัติที่ปรับแต่งได้ เราทำให้การดูแลสัตว์เลี้ยงเป็นเรื่องง่ายและแม่นยำ
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-32 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/10 skew-x-12 translate-x-1/2"></div>
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10 text-center space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <Globe className="text-accent mx-auto" size={48} strokeWidth={1.5} />
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">From Seoul to the World</h2>
            <p className="text-lg text-neutral-400 font-medium leading-relaxed">
              นวัตกรรมที่เราสร้างขึ้นเริ่มต้นจากหัวใจสำคัญในเกาหลีใต้ และวันนี้เราพร้อมส่งต่อความสุขให้เพื่อนตัวน้อยทั่วโลก รวมถึง Duit Thailand Official ที่มุ่งมั่นให้บริการแฟนๆ ชาวไทยอย่างเต็มรูปแบบ
            </p>
          </motion.div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              { role: 'SEOUL HQ', name: 'Tae Hyung Kim', detail: 'Global Founder' },
              { role: 'USA OFFICE', name: 'Brian Park', detail: 'North America Director' },
              { role: 'THAILAND', name: 'Duit Thailand', detail: 'Official Partner' },
            ].map((member, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="p-10 rounded-[32px] bg-neutral-900 border border-neutral-800 hover:border-accent/40 transition-all duration-500 group"
              >
                <h4 className="text-[10px] font-black uppercase tracking-ultra text-accent mb-4">{member.role}</h4>
                <h3 className="text-2xl font-bold uppercase mb-2 group-hover:text-accent transition-colors">{member.name}</h3>
                <p className="text-sm text-neutral-500 uppercase tracking-widest">{member.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 text-center">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-12"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-primary leading-tight">พร้อมที่จะเปลี่ยนชีวิตสัตว์เลี้ยงของคุณหรือยัง?</h2>
            <Link href="/shop" className="inline-flex items-center gap-4 bg-primary text-white px-12 py-6 rounded-full text-base font-black hover:bg-accent transition-all shadow-2xl active:scale-95 duration-300">
              ไปที่ร้านค้า <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
