'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    category: 'การสั่งซื้อและชำระเงิน',
    items: [
      {
        q: 'ฉันจะสั่งซื้อสินค้าได้อย่างไร?',
        a: 'คุณสามารถเลือกสินค้าที่ต้องการลงในตะกร้า และดำเนินการชำระเงินผ่านระบบหน้าเว็บไซต์ของเราได้ทันที โดยรองรับทั้งการโอนเงิน บัตรเครดิต และ Rabbit LINE Pay'
      },
      {
        q: 'สินค้ามีรับประกันหรือไม่?',
        a: 'สินค้า Duit ทุกชิ้นมีการรับประกันอย่างเป็นทางการ 1 ปี สำหรับความเสียหายที่เกิดจากการผลิต (ยกเว้นวัสดุสิ้นเปลือง)'
      }
    ]
  },
  {
    category: 'การจัดส่ง',
    items: [
      {
        q: 'ค่าจัดส่งราคาเท่าไหร่?',
        a: 'เราบริการจัดส่งฟรีทั่วประเทศไทยสำหรับทุกคำสั่งซื้อที่ไม่มีขั้นต่ำ'
      },
      {
        q: 'ใช้เวลานานแค่ไหนในการได้รับสินค้า?',
        a: 'สำหรับกรุงเทพฯ และปริมณฑล จะได้รับสินค้าภายใน 1-2 วันทำการ สำหรับต่างจังหวัดจะได้รับภายใน 2-4 วันทำการ'
      }
    ]
  },
  {
    category: 'Duit Care+',
    items: [
      {
        q: 'Duit Care+ คืออะไร?',
        a: 'คือโปรแกรมสมาชิกพิเศษที่ช่วยให้คุณได้รับคำแนะนำผลิตภัณฑ์ที่เหมาะสมกับสัตว์เลี้ยงของคุณ พร้อมสิทธิ์เข้าถึงสินค้า Limited Edition และส่วนลดพิเศษ'
      }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="bg-white min-h-screen pt-20 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center py-24 space-y-6">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">FAQ</h1>
          <p className="text-secondary font-medium">คำถามที่พบบ่อยเกี่ยวกับการใช้งานและบริการของเรา</p>
        </div>

        <div className="space-y-16">
          {faqs.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-8">
              <h2 className="text-xs font-black uppercase tracking-ultra text-accent border-b border-neutral-100 pb-4">{group.category}</h2>
              <div className="space-y-4">
                {group.items.map((item, itemIdx) => {
                  const id = `${groupIdx}-${itemIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div key={itemIdx} className="border border-neutral-100 rounded-[24px] overflow-hidden transition-all duration-300 hover:border-accent/20">
                      <button 
                        onClick={() => setOpenIndex(isOpen ? null : id)}
                        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                      >
                        <span className="font-bold text-primary">{item.q}</span>
                        <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : 'text-neutral-300'}`} size={20} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-8 pb-8 text-secondary text-sm leading-relaxed font-medium">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 p-12 bg-neutral-50 rounded-[48px] text-center space-y-8">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-accent">
              <MessageCircle size={32} />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-bold">ยังไม่ได้คำตอบที่ต้องการ?</h3>
              <p className="text-sm text-secondary">ทีมสนับสนุนของเราพร้อมช่วยเหลือคุณเสมอ</p>
           </div>
           <a href="/contact" className="inline-block bg-primary text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-accent transition-all">
              ติดต่อเราเลย
           </a>
        </div>
      </div>
    </div>
  );
}
